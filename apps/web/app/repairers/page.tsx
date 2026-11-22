"use client";

import { useEffect, useMemo, useState } from "react";
import { RepairerCard } from "@/components/repairer/RepairerCard";
import { api } from "@/lib/api";
import type { RepairerProfile } from "@/lib/types";

export default function RepairersPage() {
  const [repairers, setRepairers] = useState<RepairerProfile[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.repairers.list(), api.categories.list()])
      .then(([list, cats]) => {
        setRepairers(list);
        setCategories(cats);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (category ? repairers.filter((r) => r.categories.includes(category)) : repairers),
    [repairers, category],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Réparateurs</h1>
          <p className="text-sm text-slate-600">Trouve un professionnel près de chez toi.</p>
        </div>

        <label className="text-sm font-medium">
          Catégorie
          <select
            className="mt-1 block w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading && <p className="text-slate-500">Chargement…</p>}

      {!loading && !error && visible.length === 0 && (
        <p className="text-sm text-slate-500">Aucun réparateur ne correspond à ce filtre.</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => (
          <RepairerCard key={r.userId} repairer={r} />
        ))}
      </ul>
    </div>
  );
}
