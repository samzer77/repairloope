"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { RequestCard } from "@/components/RequestCard";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "../../features/auth/AuthContext"; // adapte le chemin si besoin
import { api } from "@/lib/api";
import type { RepairRequest } from "@/lib/types";
import { isClosed } from "@/lib/utils";

function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RepairRequest[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.requests
      .mine()
      .then(setRequests)
      .catch((e: Error) => setError(e.message));
  }, []);

  const active = requests?.filter((r) => !isClosed(r.status)) ?? [];
  const closed = requests?.filter((r) => isClosed(r.status)) ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-slate-600">Bonjour {user?.name}</p>
        </div>
        {user?.role === "owner" && <ButtonLink href="/requests/new">Nouvelle demande</ButtonLink>}
        {user?.role === "repairer" && <ButtonLink href="/requests">Parcourir les demandes</ButtonLink>}
        {user?.role === "admin" && <ButtonLink href="/admin">Administration</ButtonLink>}
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {!requests && !error && <p className="text-slate-500">Chargement…</p>}

      {requests && (
        <>
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">En cours ({active.length})</h2>
            {active.length === 0 ? (
              <p className="text-slate-500">Aucune demande en cours.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {active.map((r) => <RequestCard key={r.id} request={r} />)}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Clôturées ({closed.length})</h2>
            {closed.length === 0 ? (
              <p className="text-slate-500">Aucune demande clôturée.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {closed.map((r) => <RequestCard key={r.id} request={r} />)}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
