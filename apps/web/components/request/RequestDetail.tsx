"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { AppointmentSection } from "@/components/request/AppointmentSection";
import { QuestionsSection } from "@/components/request/QuestionsSection";
import { QuotesSection } from "@/components/request/QuotesSection";
import { ReviewSection, ReportView } from "@/components/request/ReviewSection";
import type { RunAction } from "@/components/request/shared";
import { useAuth } from "@/features/auth/AuthContext";
import { api, ApiError } from "@/lib/api";
import { CLOSED_STATUSES, type RepairRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { RepairerQuoteSection } from "@/components/request/RepairerQuoteSection";
import { RepairerProgressSection } from "@/components/request/RepairerProgressSection";

export function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.requests
      .get(id)
      .then(setRequest)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const busyRef = useRef(false);

  const run: RunAction = useCallback(async (action) => {
    if (busyRef.current) return; // ignore les clics répétés avant le rafraîchissement
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      setRequest(await action());
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fieldErrors).length > 0) {
        // Affiche les erreurs de champ, par exemple « demande incomplète » au moment de soumettre
        setError(Object.values(e.fieldErrors).join(" · "));
      } else {
        setError(e instanceof Error ? e.message : "Erreur inattendue");
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, []);
  
      if (!request || !user) {
    return error ? (
      <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>
    ) : (
      <p className="text-slate-500">Chargement…</p>
    );
  }

  const isOwner = user.role === "owner" && user.id === request.ownerId;

  const isRepairer = user.role === "repairer";
  const isSelectedRepairer =
  isRepairer &&
  !!request.selectedQuoteId &&
  request.quotes.some((q) => q.id === request.selectedQuoteId && q.repairerId === user.id);

  const canCancel =
    isOwner && !CLOSED_STATUSES.includes(request.status) && request.status !== "in_repair";

  return (
    <div className="space-y-6">
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {request.category || "Sans catégorie"} · {request.location || "Lieu non précisé"} · Créée le{" "}
          {formatDate(request.createdAt)} par {request.ownerName}
        </p>
        <p className="mt-4 whitespace-pre-line text-slate-800">{request.description}</p>
        <p className="mt-3 text-sm text-slate-600">
          <span className="font-medium">Disponibilités :</span> {request.availability || "non précisées"}
        </p>
        {request.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={request.imageUrl} alt="" className="mt-4 max-h-64 rounded-lg object-contain" />
        )}
        {canCancel && (
          <div className="mt-4">
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Annuler cette demande ?")) {
                  run(() => api.requests.cancel(request.id));
                }
              }}
            >
              Annuler la demande
            </Button>
          </div>
        )}
      </header>

      <QuestionsSection request={request} isOwner={isOwner} busy={busy} run={run} />
      <QuotesSection request={request} isOwner={isOwner} busy={busy} run={run} />
      {isRepairer && (
        <RepairerQuoteSection request={request} busy={busy} run={run} userId={user.id} />
      )}
      <AppointmentSection request={request} isOwner={isOwner} busy={busy} run={run} />
      {isSelectedRepairer && <RepairerProgressSection request={request} busy={busy} run={run} />}
      
      {request.report && <ReportView report={request.report} />}
      <ReviewSection request={request} isOwner={isOwner} busy={busy} run={run} />
    </div>
  );
}
