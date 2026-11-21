"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import { quoteFormSchema, toFieldErrors } from "@/lib/schemas";
import { OPEN_STATUSES } from "@/lib/types";

type Props = Omit<SectionProps, "isOwner"> & { userId: string };

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const errorClass = "mt-1 text-xs text-red-600";

export function RepairerQuoteSection({ request, busy, run, userId }: Props) {
  // Un réparateur n'a qu'un devis en attente à la fois : on le retrouve pour le réviser
  const myPending = request.quotes.find((q) => q.repairerId === userId && q.status === "pending");

  const [form, setForm] = useState({
    work: myPending?.work ?? "",
    price: myPending ? String(myPending.price) : "",
    durationDays: myPending ? String(myPending.durationDays) : "",
    validUntil: myPending?.validUntil ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!OPEN_STATUSES.includes(request.status)) return null;

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = quoteFormSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }
    setErrors({});
    run(() => api.requests.addQuote(request.id, result.data));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">
        {myPending ? "Ton devis en attente" : "Proposer un devis"}
      </h2>

      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-medium">
          Travaux proposés
          <textarea
            className={inputClass}
            rows={3}
            value={form.work}
            onChange={(e) => handleChange("work", e.target.value)}
          />
          {errors.work && <span className={errorClass}>{errors.work}</span>}
        </label>

        <label className="text-sm font-medium">
          Prix (€)
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          {errors.price && <span className={errorClass}>{errors.price}</span>}
        </label>

        <label className="text-sm font-medium">
          Durée (jours)
          <input
            type="number"
            min="1"
            className={inputClass}
            value={form.durationDays}
            onChange={(e) => handleChange("durationDays", e.target.value)}
          />
          {errors.durationDays && <span className={errorClass}>{errors.durationDays}</span>}
        </label>

        <label className="sm:col-span-2 text-sm font-medium">
          Valable jusqu'au
          <input
            type="date"
            className={inputClass}
            value={form.validUntil}
            onChange={(e) => handleChange("validUntil", e.target.value)}
          />
          {errors.validUntil && <span className={errorClass}>{errors.validUntil}</span>}
        </label>

        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            {myPending ? "Mettre à jour le devis" : "Envoyer le devis"}
          </Button>
          {myPending && (
            <Button
              type="button"
              variant="danger"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Retirer ton devis ?")) {
                  run(() => api.requests.withdrawQuote(request.id, myPending.id));
                }
              }}
            >
              Retirer mon devis
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
