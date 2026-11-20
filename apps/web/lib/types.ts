export type Role = "owner" | "repairer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/* ---------- Demandes de réparation ---------- */

export type RequestStatus =
  | "draft" | "submitted" | "discussion" | "quotes" | "planned"
  | "in_repair" | "done" | "unrepairable" | "cancelled";

export const OPEN_STATUSES: RequestStatus[] = ["submitted", "discussion", "quotes"];
export const CLOSED_STATUSES: RequestStatus[] = ["done", "unrepairable", "cancelled"];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Brouillon",
  submitted: "Soumise",
  discussion: "En discussion",
  quotes: "Devis reçus",
  planned: "Planifiée",
  in_repair: "En réparation",
  done: "Terminée",
  unrepairable: "Irréparable",
  cancelled: "Annulée",
};

export type QuoteStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "En attente",
  accepted: "Accepté",
  rejected: "Refusé",
  withdrawn: "Retiré",
};

export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  answer?: string;
}

export interface Quote {
  id: string;
  repairerId: string;
  repairerName: string;
  work: string;
  price: number;
  durationDays: number;
  validUntil: string; // AAAA-MM-JJ
  status: QuoteStatus;
}

export interface RepairRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  category: string;
  title: string;
  description: string;
  location: string;
  availability: string;
  imageUrl?: string;
  status: RequestStatus;
  createdAt: string;
  questions: Question[];
  quotes: Quote[];
  selectedQuoteId?: string;
  appointment?: { slots: string[]; confirmed?: string };
  report?: { diagnosis: string; actions: string; parts: string; result: "done" | "unrepairable" };
  review?: { rating: number; comment: string };
}

export interface RepairerProfile {
  userId: string;
  name: string;
  bio: string;
  categories: string[];
  zone: string;
  availability: string;
  verified: boolean;
}

/* ---------- Payloads envoyés à l'API ---------- */

export interface DraftPayload {
  category: string;
  title: string;
  description: string;
  location: string;
  availability: string;
  imageUrl?: string;
}

export interface QuotePayload {
  work: string;
  price: number;
  durationDays: number;
  validUntil: string;
}

export interface ReportPayload {
  diagnosis: string;
  actions: string;
  parts: string;
  result: "done" | "unrepairable";
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface ProfilePayload {
  bio: string;
  zone: string;
  availability: string;
  categories: string[];
}

export interface ListFilters {
  q?: string;
  category?: string;
  location?: string;
  since?: string; // AAAA-MM-JJ
  sort?: "recent" | "oldest" | "title";
}
