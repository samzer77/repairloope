"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { RepairerProfile } from "@/lib/types";

export function RepairerDetail() {
  const { id } = useParams<{ id: string }>();
  const [repairer, setRepairer] = useState<RepairerProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.repairers
      .get(id)
      .then(setRepairer)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>;
  if (!repairer) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/repairers" className="text-sm text-teal-700 hover:underline">
        ← Retour aux réparateurs
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{repairer.name}</h1>
          {repairer.verified && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Vérifié
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-600">{repairer.zone || "Zone non précisée"}</p>
        <p className="mt-4 whitespace-pre-line text-slate-800">{repairer.bio || "Pas encore de présentation."}</p>

        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium">Disponibilités :</span> {repairer.availability || "non précisées"}
        </p>

        {repairer.categories.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Catégories</p>
            <div className="flex flex-wrap gap-1">
              {repairer.categories.map((c) => (
                <span key={c} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
