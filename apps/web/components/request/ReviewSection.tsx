"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import type { ReportPayload } from "@/lib/types";

const RESULT_LABELS: Record<ReportPayload["result"], string> = {
  done: "Réparée",
  unrepairable: "Irréparable",
};

export function ReportView({ report }: { report: NonNullable<SectionProps["request"]["report"]> }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Rapport de réparation</h2>
      <dl className="space-y-2 text-sm">
        <div><dt className="font-medium">Résultat</dt><dd>{RESULT_LABELS[report.result]}</dd></div>
        <div><dt className="font-medium">Diagnostic</dt><dd className="whitespace-pre-line">{report.diagnosis}</dd></div>
        <div><dt className="font-medium">Travaux réalisés</dt><dd className="whitespace-pre-line">{report.actions}</dd></div>
        {report.parts && (
          <div><dt className="font-medium">Pièces</dt><dd className="whitespace-pre-line">{report.parts}</dd></div>
        )}
      </dl>
    </section>
  );
}

export function ReviewSection({ request, isOwner, busy, run }: SectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // L'avis n'est possible qu'après une réparation terminée, et une seule fois
  const canReview = isOwner && request.status === "done" && !request.review;

  if (request.review) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Avis</h2>
        <p className="text-amber-600">{"★".repeat(request.review.rating)}{"☆".repeat(5 - request.review.rating)}</p>
        <p className="mt-2 text-sm text-slate-700">{request.review.comment}</p>
      </section>
    );
  }

  if (!canReview) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Laisser un avis</h2>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Note
          <select
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} / 5</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Commentaire
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <Button
          disabled={busy || comment.trim().length < 5}
          onClick={() =>
            run(() => api.requests.addReview(request.id, { rating, comment: comment.trim() }))
          }
        >
          Publier l'avis
        </Button>
      </div>
    </section>
  );
}
