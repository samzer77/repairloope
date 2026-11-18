import type { Role } from "./repositories/userRepository";

export type RequestStatus =
  | "draft" | "submitted" | "discussion" | "quotes" | "planned"
  | "in_repair" | "done" | "unrepairable" | "cancelled";

export const OPEN_STATUSES: RequestStatus[] = ["submitted", "discussion", "quotes"];
export const CLOSED_STATUSES: RequestStatus[] = ["done", "unrepairable", "cancelled"];

export type QuoteStatus = "pending" | "accepted" | "rejected" | "withdrawn";

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

// Utilisateur authentifié, attaché à la requête par requireAuth
export interface Actor {
  id: string;
  role: Role;
  name: string;
}
