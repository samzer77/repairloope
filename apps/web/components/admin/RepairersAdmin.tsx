"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { errorMessage } from "@/components/admin/shared";
import { api } from "@/lib/api";
import type { RepairerProfile } from "@/lib/types";

export function RepairersAdmin() {
  const [repairers, setRepairers] = useState<RepairerProfile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.repairers
      .list()
      .then(setRepairers)
      .catch((e) => setError(errorMessage(e)));
  }, []);

  async function toggle(r: RepairerProfile) {
    setError("");
    try {
      const updated = await api.repairers.verify(r.userId, !r.verified);
      // On remplace seulement la fiche modifiée dans la liste
      setRepairers((prev) => prev.map((x) => (x.userId === updated.userId ? updated : x)));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Réparateurs</h2>

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {repairers.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun profil réparateur pour le moment.</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {repairers.map((r) => (
            <li key={r.userId} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-slate-500">
                  {r.zone || "Zone non précisée"} · {r.categories.join(", ") || "aucune catégorie"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">{r.verified ? "Vérifié" : "Non vérifié"}</span>
                <Button variant={r.verified ? "secondary" : "primary"} onClick={() => toggle(r)}>
                  {r.verified ? "Retirer la vérification" : "Vérifier"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
