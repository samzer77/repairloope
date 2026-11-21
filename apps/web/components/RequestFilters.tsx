"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import type { ListFilters } from "@/lib/types";

// Les champs du formulaire restent en chaînes, la conversion se fait à l'envoi
interface FormState {
  q: string;
  category: string;
  location: string;
  since: string;
  sort: string;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none";

function toFilters(f: FormState): ListFilters {
  return {
    q: f.q.trim() || undefined,
    category: f.category || undefined,
    location: f.location.trim() || undefined,
    since: f.since || undefined,
    sort: (f.sort as ListFilters["sort"]) || "recent",
  };
}

export function RequestFilters({
  initial,
  onApply,
}: {
  initial: ListFilters;
  onApply: (filters: ListFilters) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({
    q: initial.q ?? "",
    category: initial.category ?? "",
    location: initial.location ?? "",
    since: initial.since ?? "",
    sort: initial.sort ?? "recent",
  });

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const set =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    onApply(toFilters(form));
  }

  function reset() {
    setForm({ q: "", category: "", location: "", since: "", sort: "recent" });
    onApply({ sort: "recent" });
  }

  return (
    <form onSubmit={submit} className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="block text-sm font-medium text-slate-700 lg:col-span-2">
        Recherche
        <input className={inputClass} value={form.q} onChange={set("q")} placeholder="Titre ou description" />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Catégorie
        <select className={inputClass} value={form.category} onChange={set("category")}>
          <option value="">Toutes</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Localisation
        <input className={inputClass} value={form.location} onChange={set("location")} placeholder="Ex. Pau" />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Publiées depuis
        <input className={inputClass} type="date" value={form.since} onChange={set("since")} />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Tri
        <select className={inputClass} value={form.sort} onChange={set("sort")}>
          <option value="recent">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
          <option value="title">Titre (A à Z)</option>
        </select>
      </label>

      <div className="flex gap-3 sm:col-span-2 lg:col-span-5">
        <Button type="submit">Appliquer</Button>
        <Button type="button" variant="secondary" onClick={reset}>
          Réinitialiser
        </Button>
      </div>
    </form>
  );
}
