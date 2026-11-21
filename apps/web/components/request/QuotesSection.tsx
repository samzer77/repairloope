"use client";

import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import { OPEN_STATUSES, QUOTE_STATUS_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function QuotesSection({ request, isOwner, busy, run }: SectionProps) {
  const isOpen = OPEN_STATUSES.includes(request.status);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Devis ({request.quotes.length})</h2>
      {request.quotes.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun devis reçu pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {request.quotes.map((q) => {
            const canDecide = isOwner && isOpen && q.status === "pending";
            return (
              <li key={q.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {formatPrice(q.price)} · {q.durationDays} jour{q.durationDays > 1 ? "s" : ""}
                  </p>
                  <span className="text-xs text-slate-600">{QUOTE_STATUS_LABELS[q.status]}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{q.work}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Par {q.repairerName} · Valable jusqu'au {q.validUntil}
                </p>

                {canDecide && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      disabled={busy}
                      onClick={() => run(() => api.requests.acceptQuote(request.id, q.id))}
                    >
                      Accepter
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() => run(() => api.requests.rejectQuote(request.id, q.id))}
                    >
                      Refuser
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
