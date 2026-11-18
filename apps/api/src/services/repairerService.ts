import { HttpError } from "../middleware/errorHandler";
import { Actor, RepairRequest, RepairerProfile } from "../models";
import { categoryRepository } from "../repositories/categoryRepository";
import { profileRepository } from "../repositories/profileRepository";
import { requestRepository } from "../repositories/requestRepository";
import { userRepository } from "../repositories/userRepository";
import { ProfileInput } from "../validation/misc";

function completedCounts(requests: RepairRequest[]) {
  const counts = new Map<string, number>();
  for (const r of requests) {
    if (r.status !== "done") continue;
    const repairerId = r.quotes.find((q) => q.id === r.selectedQuoteId)?.repairerId;
    if (repairerId) counts.set(repairerId, (counts.get(repairerId) ?? 0) + 1);
  }
  return counts;
}

export const repairerService = {
  async list(category?: string) {
    const [profiles, users, requests] = await Promise.all([
      profileRepository.findAll(),
      userRepository.findAll(),
      requestRepository.findAll(),
    ]);
    const activeIds = new Set(users.filter((u) => u.active).map((u) => u.id));
    const counts = completedCounts(requests);
    return profiles
      .filter((p) => activeIds.has(p.userId))
      .filter((p) => !category || p.categories.includes(category))
      .map((p) => ({ ...p, completedCount: counts.get(p.userId) ?? 0 }));
  },

  async get(userId: string) {
    const profile = await profileRepository.findByUserId(userId);
    const user = await userRepository.findById(userId);
    if (!profile || !user?.active) throw new HttpError(404, "Réparateur introuvable");
    const counts = completedCounts(await requestRepository.findAll());
    return { ...profile, completedCount: counts.get(userId) ?? 0 };
  },

  async save(actor: Actor, input: ProfileInput) {
    const known = await categoryRepository.list();
    if (input.categories.some((c) => !known.includes(c))) {
      throw new HttpError(400, "Catégorie inconnue", { categories: "Catégorie inconnue" });
    }
    const existing = await profileRepository.findByUserId(actor.id);
    const profile: RepairerProfile = {
      ...input,
      userId: actor.id,
      name: actor.name,
      verified: existing?.verified ?? false,
    };
    return profileRepository.save(profile);
  },

  async setVerified(userId: string, verified: boolean) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new HttpError(404, "Profil introuvable");
    return profileRepository.save({ ...profile, verified });
  },
};
