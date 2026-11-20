import type {
  AuthResponse, DraftPayload, ListFilters, ProfilePayload, QuotePayload,
  RepairRequest, RepairerProfile, ReportPayload, ReviewPayload, User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem("token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? "Erreur réseau", data?.errors ?? {});
  }
  return data as T;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const post = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

const put = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) });

const patch = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) });

const del = <T>(path: string) => apiFetch<T>(path, { method: "DELETE" });

/** Construit "?a=1&b=2" en ignorant les valeurs vides. */
function qs(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/* ------------------------------------------------------------------ */
/* Une méthode par route de l'API                                     */
/* ------------------------------------------------------------------ */

export const api = {
  auth: {
    me: () => apiFetch<{ user: User }>("/auth/me"),
    login: (body: { email: string; password: string }) => post<AuthResponse>("/auth/login", body),
  },

  categories: {
    list: () => apiFetch<string[]>("/categories"),
    add: (name: string) => post<unknown>("/categories", { name }),
    remove: (name: string) => del<unknown>(`/categories/${encodeURIComponent(name)}`),
  },

  requests: {
    /** Répertoire (réparateur / admin) avec recherche, filtres et tri. */
    list: (filters: ListFilters = {}) =>
      apiFetch<RepairRequest[]>(`/requests${qs({ ...filters })}`),
    /** Mes demandes (owner) ou celles où je suis impliqué (repairer). */
    mine: () => apiFetch<RepairRequest[]>("/requests/mine"),
    get: (id: string) => apiFetch<RepairRequest>(`/requests/${id}`),

    create: (data: DraftPayload) => post<RepairRequest>("/requests", data),
    update: (id: string, data: DraftPayload) => put<RepairRequest>(`/requests/${id}`, data),
    submit: (id: string) => post<RepairRequest>(`/requests/${id}/submit`),
    cancel: (id: string) => post<RepairRequest>(`/requests/${id}/cancel`),

    ask: (id: string, text: string) => post<RepairRequest>(`/requests/${id}/questions`, { text }),
    answer: (id: string, questionId: string, text: string) =>
      post<RepairRequest>(`/requests/${id}/questions/${questionId}/answer`, { text }),

    addQuote: (id: string, data: QuotePayload) => post<RepairRequest>(`/requests/${id}/quotes`, data),
    withdrawQuote: (id: string, quoteId: string) => del<RepairRequest>(`/requests/${id}/quotes/${quoteId}`),
    acceptQuote: (id: string, quoteId: string) =>
      post<RepairRequest>(`/requests/${id}/quotes/${quoteId}/accept`),
    rejectQuote: (id: string, quoteId: string) =>
      post<RepairRequest>(`/requests/${id}/quotes/${quoteId}/reject`),

    proposeSlots: (id: string, slots: string[]) =>
      post<RepairRequest>(`/requests/${id}/appointment`, { slots }),
    confirmSlot: (id: string, slot: string) =>
      post<RepairRequest>(`/requests/${id}/appointment/confirm`, { slot }),
    start: (id: string) => post<RepairRequest>(`/requests/${id}/start`),
    saveReport: (id: string, data: ReportPayload) => post<RepairRequest>(`/requests/${id}/report`, data),
    addReview: (id: string, data: ReviewPayload) => post<RepairRequest>(`/requests/${id}/review`, data),
  },

  repairers: {
    list: () => apiFetch<RepairerProfile[]>("/repairers"),
    get: (id: string) => apiFetch<RepairerProfile>(`/repairers/${id}`),
    getMine: () => apiFetch<RepairerProfile>("/repairers/me"),
    saveMine: (data: ProfilePayload) => put<RepairerProfile>("/repairers/me", data),
    verify: (id: string, verified: boolean) => patch<RepairerProfile>(`/repairers/${id}/verify`, { verified }),
  },

  users: {
    search: (q = "") => apiFetch<User[]>(`/users${qs({ q })}`),
    setActive: (id: string, active: boolean) => patch<User>(`/users/${id}/active`, { active }),
  },
};
