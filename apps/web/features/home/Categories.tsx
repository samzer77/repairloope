"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DEFAULT_ICON = "🔧";

// Associe une icône à une catégorie d'après un mot-clé, sans accents ni majuscules
const ICON_RULES: [keyword: string, icon: string][] = [
  ["electromenager", "🧺"],
  ["electricite", "💡"],
  ["textile", "🧵"],
  ["plomb", "🚿"],
  ["electronique", "📱"],
  ["mobilier", "🪑"],
  ["velo", "🚲"],
];

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function iconFor(name: string) {
  const clean = normalize(name);
  return ICON_RULES.find(([keyword]) => clean.includes(keyword))?.[1] ?? DEFAULT_ICON;
}

export default function Categories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Que pouvez-vous faire réparer ?</h2>

        {loading && <p className="mt-10 text-center text-slate-500">Chargement…</p>}

        {!loading && categories.length === 0 && (
          <p className="mt-10 text-center text-slate-500">Les catégories arrivent bientôt.</p>
        )}

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((name) => (
            <li
              key={name}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center"
            >
              <div className="text-3xl">{iconFor(name)}</div>
              <p className="mt-2 text-sm font-medium">{name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
