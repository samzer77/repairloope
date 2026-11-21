"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import { reportFormSchema, toFieldErrors } from "@/lib/schemas";
import { formatDateTime } from "@/lib/utils";
import type { ReportPayload } from "@/lib/types";

type Props = Omit<SectionProps, "isOwner">;

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const errorClass = "mt-1 text-xs text-red-600";

export function RepairerProgressSection({ request, busy, run }: Props) {
  const [slotInputs, setSlotInputs] = useState<string[]>([""]);
  const [slotError, setSlotError] = useState("");
  const [report, setReport] = useState<ReportPayload>({
    diagnosis: "",
    actions: "",
    parts: "",
    result: "done",
  });
  const [reportErrors, setReportErrors] = useState<Record<string, string>>({});

  const { status, appointment } = request;
  const confirmed = appointment?.confirmed;

  if (status !== "planned" && status !== "in_repair") return null;

  function updateSlot(index: number, value: string) {
    setSlotInputs((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function submitSlots(e: FormEvent) {
    e.preventDefault();
    const filled = slotInputs.filter(Boolean).map((s) => new Date(s));
    if (filled.length === 0) {
      setSlotError("Ajoute au moins un créneau");
      return;
    }
    if (filled.some((d) => Number.isNaN(d.getTime()) || d.getTime() < Date.now())) {
      setSlotError("Les créneaux doivent être valides et dans le futur");
      return;
    }
    setSlotError("");
    run(() => api.requests.proposeSlots(request.id, filled.map((d) => d.toISOString())));
  }

  function submitReport(e: FormEvent) {
    e.preventDefault();
    const result = reportFormSchema.safeParse(report);
    if (!result.success) {
      setReportErrors(toFieldErrors(result.error.issues));
      return;
    }
    setReportErrors({});
    run(() => api.requests.saveReport(request.id, result.data));
  }

  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Avancement de la réparation</h2>

      {status === "planned" && (
        <div className="space-y-4">
          {confirmed ? (
            <p className="text-sm">
              Rendez-vous confirmé :{" "}
              <span className="font-medium">{formatDateTime(confirmed)}</span>
            </p>
          ) : (
            <form onSubmit={submitSlots} className="space-y-3">
              {appointment?.slots.length ? (
                <p className="text-sm text-slate-600">
                  Créneaux en attente de réponse du propriétaire :{" "}
                  {appointment.slots.map((s) => formatDateTime(s)).join(" · ")}
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Propose un ou plusieurs créneaux. Le propriétaire en choisira un.
                </p>
              )}

              {slotInputs.map((value, i) => (
                <input
                  key={i}
                  type="datetime-local"
                  className={inputClass}
                  value={value}
                  onChange={(e) => updateSlot(i, e.target.value)}
                />
              ))}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSlotInputs((prev) => [...prev, ""])}
                >
                  Ajouter un créneau
                </Button>
                <Button type="submit" disabled={busy}>
                  Proposer ces créneaux
                </Button>
              </div>
              {slotError && <p className={errorClass}>{slotError}</p>}
            </form>
          )}

          {confirmed && (
            <Button disabled={busy} onClick={() => run(() => api.requests.start(request.id))}>
              Démarrer la réparation
            </Button>
          )}
        </div>
      )}

      {status === "in_repair" && (
        <form onSubmit={submitReport} className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium">
            Diagnostic
            <textarea
              rows={3}
              className={inputClass}
              value={report.diagnosis}
              onChange={(e) => setReport({ ...report, diagnosis: e.target.value })}
            />
            {reportErrors.diagnosis && <span className={errorClass}>{reportErrors.diagnosis}</span>}
          </label>

          <label className="sm:col-span-2 text-sm font-medium">
            Travaux réalisés
            <textarea
              rows={3}
              className={inputClass}
              value={report.actions}
              onChange={(e) => setReport({ ...report, actions: e.target.value })}
            />
            {reportErrors.actions && <span className={errorClass}>{reportErrors.actions}</span>}
          </label>

          <label className="sm:col-span-2 text-sm font-medium">
            Pièces utilisées (facultatif)
            <textarea
              rows={2}
              className={inputClass}
              value={report.parts}
              onChange={(e) => setReport({ ...report, parts: e.target.value })}
            />
          </label>

          <label className="sm:col-span-2 text-sm font-medium">
            Résultat
            <select
              className={inputClass}
              value={report.result}
              onChange={(e) =>
                setReport({ ...report, result: e.target.value as ReportPayload["result"] })
              }
            >
              <option value="done">Réparée</option>
              <option value="unrepairable">Irréparable</option>
            </select>
          </label>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>
              Envoyer le rapport
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
