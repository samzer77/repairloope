"use client";

import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

export function AppointmentSection({ request, isOwner, busy, run }: SectionProps) {
  const appointment = request.appointment;
  if (!appointment) return null;

  const pending = !appointment.confirmed && appointment.slots.length > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Rendez-vous</h2>

      {appointment.confirmed ? (
        <p className="text-sm text-emerald-700">
          Rendez-vous confirmé : <span className="font-medium">{formatDateTime(appointment.confirmed)}</span>
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-600">
            {isOwner ? "Choisis un créneau proposé par le réparateur." : "Créneaux proposés, en attente de confirmation."}
          </p>
          <ul className="flex flex-wrap gap-2">
            {appointment.slots.map((slot) => (
              <li key={slot}>
                {isOwner && pending ? (
                  <Button
                    variant="secondary"
                    disabled={busy}
                    onClick={() => run(() => api.requests.confirmSlot(request.id, slot))}
                  >
                    {formatDateTime(slot)}
                  </Button>
                ) : (
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm">{formatDateTime(slot)}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
