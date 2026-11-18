import { randomUUID } from "crypto";
import { HttpError } from "../middleware/errorHandler";
import { toFieldErrors } from "../middleware/validate";
import {
  Actor, CLOSED_STATUSES, OPEN_STATUSES, Quote, RepairRequest, RequestStatus,
} from "../models";
import { categoryRepository } from "../repositories/categoryRepository";
import { requestRepository } from "../repositories/requestRepository";
import {
  DraftInput, ListFilters, QuoteInput, ReportInput, ReviewInput, requestSchema,
} from "../validation/requests";

/* ---------- Aides ---------- */

const today = () => new Date().toISOString().slice(0, 10);
const isExpired = (q: Quote) => q.validUntil < today();

async function load(id: string) {
  const r = await requestRepository.findById(id);
  if (!r) throw new HttpError(404, "Demande introuvable");
  return r;
}

function assertOwner(r: RepairRequest, actor: Actor) {
  if (r.ownerId !== actor.id) throw new HttpError(403, "Seul le propriétaire de la demande peut faire cela");
}

function assertSelectedRepairer(r: RepairRequest, actor: Actor) {
  const selected = r.quotes.find((q) => q.id === r.selectedQuoteId);
  if (!selected || selected.repairerId !== actor.id) {
    throw new HttpError(403, "Seul le réparateur sélectionné peut faire cela");
  }
}

function assertStatus(r: RepairRequest, allowed: RequestStatus[], message: string) {
  if (!allowed.includes(r.status)) throw new HttpError(409, message);
}

function findQuote(r: RepairRequest, quoteId: string) {
  const q = r.quotes.find((x) => x.id === quoteId);
  if (!q) throw new HttpError(404, "Devis introuvable");
  return q;
}

// Si plus aucun devis n'est en attente, la demande revient en arrière
function refreshStatus(r: RepairRequest) {
  if (r.status === "quotes" && !r.quotes.some((q) => q.status === "pending")) {
    r.status = r.questions.length ? "discussion" : "submitted";
  }
}

// Ce que l'utilisateur a le droit de voir : un réparateur ne voit que ses devis,
// et seuls les participants voient le rendez-vous et le rapport.
function viewFor(r: RepairRequest, actor: Actor): RepairRequest {
  if (actor.role === "admin" || r.ownerId === actor.id) return r;
  const selected = r.quotes.find((q) => q.id === r.selectedQuoteId);
  const participant = selected?.repairerId === actor.id;
  return {
    ...r,
    quotes: r.quotes.filter((q) => q.repairerId === actor.id),
    appointment: participant ? r.appointment : undefined,
    report: participant ? r.report : undefined,
  };
}

// Charge, applique la règle, sauvegarde, renvoie la vue de l'utilisateur
async function act(id: string, actor: Actor, fn: (r: RepairRequest) => void | Promise<void>) {
  const r = await load(id);
  await fn(r);
  await requestRepository.update(r);
  return viewFor(r, actor);
}

const sorters: Record<string, (a: RepairRequest, b: RepairRequest) => number> = {
  recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
  oldest: (a, b) => a.createdAt.localeCompare(b.createdAt),
  title: (a, b) => a.title.localeCompare(b.title),
};

/* ---------- Service ---------- */

export const requestService = {
  // Répertoire des réparateurs : demandes ouvertes, avec recherche, filtres et tri
  async search(actor: Actor, f: ListFilters) {
    const q = f.q?.toLowerCase();
    const loc = f.location?.toLowerCase();
    const all = await requestRepository.findAll();
    return all
      .filter((r) => OPEN_STATUSES.includes(r.status))
      .filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
      .filter((r) => !f.category || r.category === f.category)
      .filter((r) => !loc || r.location.toLowerCase().includes(loc))
      .filter((r) => !f.since || r.createdAt.slice(0, 10) >= f.since)
      .sort(sorters[f.sort])
      .map((r) => viewFor(r, actor));
  },

  // Tableau de bord
  async mine(actor: Actor) {
    const all = await requestRepository.findAll();
    return all
      .filter((r) => {
        if (actor.role === "admin") return true;
        if (actor.role === "owner") return r.ownerId === actor.id;
        return (
          r.quotes.some((q) => q.repairerId === actor.id) ||
          r.questions.some((q) => q.authorId === actor.id)
        );
      })
      .sort(sorters.recent)
      .map((r) => viewFor(r, actor));
  },

  async get(actor: Actor, id: string) {
    const r = await load(id);
    if (actor.role === "owner" && r.ownerId !== actor.id) throw new HttpError(403, "Accès interdit");
    if (
      actor.role === "repairer" &&
      !OPEN_STATUSES.includes(r.status) &&
      !r.quotes.some((q) => q.repairerId === actor.id)
    ) {
      throw new HttpError(404, "Demande introuvable");
    }
    return viewFor(r, actor);
  },

  async create(actor: Actor, input: DraftInput) {
    const request: RepairRequest = {
      id: randomUUID(),
      ownerId: actor.id,
      ownerName: actor.name,
      category: input.category,
      title: input.title,
      description: input.description,
      location: input.location,
      availability: input.availability,
      imageUrl: input.imageUrl || undefined,
      status: "draft",
      createdAt: new Date().toISOString(),
      questions: [],
      quotes: [],
    };
    await requestRepository.insert(request);
    return request;
  },

  update: (actor: Actor, id: string, input: DraftInput) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      assertStatus(r, ["draft"], "Seul un brouillon peut être modifié");
      Object.assign(r, { ...input, imageUrl: input.imageUrl || undefined });
    }),

  submit: (actor: Actor, id: string) =>
    act(id, actor, async (r) => {
      assertOwner(r, actor);
      assertStatus(r, ["draft"], "Cette demande est déjà soumise");
      const result = requestSchema.safeParse(r);
      if (!result.success) {
        throw new HttpError(400, "La demande est incomplète", toFieldErrors(result.error.issues));
      }
      if (!(await categoryRepository.list()).includes(r.category)) {
        throw new HttpError(400, "Catégorie inconnue", { category: "Catégorie inconnue" });
      }
      r.status = "submitted";
    }),

  cancel: (actor: Actor, id: string) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      if (CLOSED_STATUSES.includes(r.status)) throw new HttpError(409, "Cette demande est déjà clôturée");
      r.status = "cancelled";
    }),

  ask: (actor: Actor, id: string, text: string) =>
    act(id, actor, (r) => {
      assertStatus(r, OPEN_STATUSES, "Les questions sont fermées pour cette demande");
      r.questions.push({ id: randomUUID(), authorId: actor.id, authorName: actor.name, text });
      if (r.status === "submitted") r.status = "discussion";
    }),

  answer: (actor: Actor, id: string, questionId: string, text: string) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      assertStatus(r, OPEN_STATUSES, "Les questions sont fermées pour cette demande");
      const q = r.questions.find((x) => x.id === questionId);
      if (!q) throw new HttpError(404, "Question introuvable");
      if (q.answer) throw new HttpError(409, "Cette question a déjà une réponse");
      q.answer = text;
    }),

  // Crée un devis, ou révise le devis en attente du même réparateur
  addQuote: (actor: Actor, id: string, data: QuoteInput) =>
    act(id, actor, (r) => {
      assertStatus(r, OPEN_STATUSES, "Cette demande n'accepte plus de devis");
      const existing = r.quotes.find((q) => q.repairerId === actor.id && q.status === "pending");
      if (existing) Object.assign(existing, data);
      else {
        r.quotes.push({
          id: randomUUID(), repairerId: actor.id, repairerName: actor.name, status: "pending", ...data,
        });
      }
      r.status = "quotes";
    }),

  withdrawQuote: (actor: Actor, id: string, quoteId: string) =>
    act(id, actor, (r) => {
      const q = findQuote(r, quoteId);
      if (q.repairerId !== actor.id) throw new HttpError(403, "Ce devis n'est pas le vôtre");
      if (q.status !== "pending") throw new HttpError(409, "Seul un devis non accepté peut être retiré");
      q.status = "withdrawn";
      refreshStatus(r);
    }),

  rejectQuote: (actor: Actor, id: string, quoteId: string) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      const q = findQuote(r, quoteId);
      if (q.status !== "pending") throw new HttpError(409, "Ce devis n'est plus disponible");
      q.status = "rejected";
      refreshStatus(r);
    }),

  // Un seul devis accepté ; un devis expiré ou retiré est refusé
  acceptQuote: (actor: Actor, id: string, quoteId: string) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      assertStatus(r, ["quotes"], "Aucun devis à accepter");
      const q = findQuote(r, quoteId);
      if (q.status !== "pending") throw new HttpError(409, "Ce devis n'est plus disponible");
      if (isExpired(q)) throw new HttpError(409, "Ce devis est expiré");
      for (const x of r.quotes) {
        if (x.status === "pending") x.status = x.id === q.id ? "accepted" : "rejected";
      }
      r.selectedQuoteId = q.id;
      r.status = "planned"; // seul chemin vers « Planifiée »
    }),

  proposeSlots: (actor: Actor, id: string, slots: string[]) =>
    act(id, actor, (r) => {
      assertStatus(r, ["planned"], "La demande doit être planifiée");
      assertSelectedRepairer(r, actor);
      if (r.appointment?.confirmed) throw new HttpError(409, "Le rendez-vous est déjà confirmé");
      r.appointment = { slots };
    }),

  confirmSlot: (actor: Actor, id: string, slot: string) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      assertStatus(r, ["planned"], "La demande doit être planifiée");
      if (!r.appointment?.slots.includes(slot)) throw new HttpError(404, "Créneau introuvable");
      if (r.appointment.confirmed) throw new HttpError(409, "Le rendez-vous est déjà confirmé");
      r.appointment.confirmed = slot;
    }),

  startRepair: (actor: Actor, id: string) =>
    act(id, actor, (r) => {
      assertStatus(r, ["planned"], "La demande doit être planifiée");
      assertSelectedRepairer(r, actor);
      if (!r.appointment?.confirmed) throw new HttpError(409, "Le rendez-vous doit d'abord être confirmé");
      r.status = "in_repair";
    }),

  // Le rapport est obligatoire pour clôturer : « Terminée » ne s'obtient que par ici
  saveReport: (actor: Actor, id: string, report: ReportInput) =>
    act(id, actor, (r) => {
      assertStatus(r, ["in_repair"], "La réparation doit être en cours");
      assertSelectedRepairer(r, actor);
      r.report = report;
      r.status = report.result;
    }),

  addReview: (actor: Actor, id: string, review: ReviewInput) =>
    act(id, actor, (r) => {
      assertOwner(r, actor);
      assertStatus(r, ["done"], "Un avis n'est possible qu'après une réparation terminée");
      if (r.review) throw new HttpError(409, "Un seul avis par réparation");
      r.review = review;
    }),
};
