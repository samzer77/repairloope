"use client";

import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/Button";
import { RequireAuth } from "@/components/RequireAuth";
import { api, ApiError } from "@/lib/api";
import { toFieldErrors } from "@/lib/schemas";
import type { ProfilePayload } from "@/lib/types";

const profileFormSchema = z.object({
  bio: z.string().trim().min(20, "Présente-toi en 20 caractères minimum"),
  zone: z.string().trim().min(2, "Indique ta zone d'intervention"),
  availability: z.string().trim().min(3, "Indique tes disponibilités"),
  categories: z.array(z.string()).min(1, "Choisis au moins une catégorie"),
});

const EMPTY_PROFILE: ProfilePayload = {
  bio: "",
  zone: "",
  availability: "",
  categories: [],
};

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const errorClass = "mt-1 text-xs text-red-600";

export default function ProfilePage() {
  return (
    <RequireAuth roles={["repairer"]}>
      <ProfileForm />
    </RequireAuth>
  );
}

function ProfileForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<ProfilePayload>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      api.categories.list(),
      // Pas de profil encore créé : le serveur répond 404, ce n'est pas une erreur
      api.repairers.getMine().catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    ])
      .then(([cats, profile]) => {
        setCategories(cats);
        if (profile) {
          setForm({
            bio: profile.bio,
            zone: profile.zone,
            availability: profile.availability,
            categories: profile.categories,
          });
        }
      })
      .catch((e: Error) => {
        setIsError(true);
        setMessage(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof ProfilePayload>(field: K, value: ProfilePayload[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCategory(name: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(name)
        ? prev.categories.filter((c) => c !== name)
        : [...prev.categories, name],
    }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = profileFormSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    setErrors({});
    setMessage("");
    setIsError(false);
    setSaving(true);
    try {
      await api.repairers.saveMine(result.data);
      setMessage("Profil enregistré. Il apparaît maintenant dans l'annuaire.");
    } catch (err) {
      setIsError(true);
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
        setErrors(err.fieldErrors);
      }
      setMessage(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mon profil réparateur</h1>
        <p className="text-sm text-slate-600">
          Ta fiche est visible dans l'annuaire. Les propriétaires la trouvent grâce aux catégories que tu coches.
        </p>
      </header>

      {message && (
        <p className={`rounded p-3 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
          {message}
        </p>
      )}

      <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium">
          Présentation
          <textarea
            rows={4}
            className={inputClass}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Ex. : technicien indépendant depuis 8 ans, spécialisé en petit électroménager."
          />
          {errors.bio && <span className={errorClass}>{errors.bio}</span>}
        </label>

        <label className="block text-sm font-medium">
          Zone d'intervention
          <input
            className={inputClass}
            value={form.zone}
            onChange={(e) => update("zone", e.target.value)}
            placeholder="Ex. : Pau et environs"
          />
          {errors.zone && <span className={errorClass}>{errors.zone}</span>}
        </label>

        <label className="block text-sm font-medium">
          Disponibilités
          <input
            className={inputClass}
            value={form.availability}
            onChange={(e) => update("availability", e.target.value)}
            placeholder="Ex. : lundi au vendredi, après 17 h"
          />
          {errors.availability && <span className={errorClass}>{errors.availability}</span>}
        </label>

        <fieldset>
          <legend className="text-sm font-medium">Catégories que tu répares</legend>
          {categories.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">
              Aucune catégorie n'a encore été créée par l'administrateur.
            </p>
          ) : (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(c)}
                    onChange={() => toggleCategory(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          )}
          {errors.categories && <span className={errorClass}>{errors.categories}</span>}
        </fieldset>

        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer mon profil"}
        </Button>
      </form>
    </div>
  );
}
