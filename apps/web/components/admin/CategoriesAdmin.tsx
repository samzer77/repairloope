"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { errorMessage } from "@/components/admin/shared";
import { api } from "@/lib/api";

const inputClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm";

export function CategoriesAdmin() {
  const [categories, setCategories] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    setCategories(await api.categories.list());
  }

  useEffect(() => {
    refresh().catch((e) => setError(errorMessage(e)));
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    setError("");
    try {
      await api.categories.add(clean);
      setName("");
      await refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function remove(category: string) {
    if (!window.confirm(`Supprimer la catégorie « ${category} » ?`)) return;
    setError("");
    try {
      await api.categories.remove(category);
      await refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Catégories</h2>

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={add} className="flex gap-2">
        <input
          className={`flex-1 ${inputClass}`}
          placeholder="Nouvelle catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={!name.trim()}>
          Ajouter
        </Button>
      </form>

      <ul className="divide-y divide-slate-200">
        {categories.map((c) => (
          <li key={c} className="flex items-center justify-between py-2 text-sm">
            <span>{c}</span>
            <Button variant="danger" type="button" onClick={() => remove(c)}>
              Supprimer
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
