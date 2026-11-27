"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/Button";
import { api, ApiError } from "@/lib/api";
import type { DraftPayload, RepairRequest } from "@/lib/types";

const EMPTY: DraftPayload = {
  category: "", title: "", description: "", location: "", availability: "", imageUrl: "",
};

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 Mo

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

// Lit le fichier choisi et renvoie son contenu encodé en texte (data URL)
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}

export function RequestForm({ initial }: { initial?: RepairRequest }) {
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(initial?.id);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<DraftPayload>(
    initial
      ? {
          category: initial.category,
          title: initial.title,
          description: initial.description,
          location: initial.location,
          availability: initial.availability,
          imageUrl: initial.imageUrl ?? "",
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => setMessage("Impossible de charger les catégories"));
  }, []);

  const set =
    (key: keyof DraftPayload) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPhotoError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Le fichier doit être une image");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo trop lourde (2 Mo maximum)");
      e.target.value = "";
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      setForm((f) => ({ ...f, imageUrl: dataUrl }));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Erreur inattendue");
    }
  }

  function removePhoto() {
    setForm((f) => ({ ...f, imageUrl: "" }));
    setPhotoError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  /** Enregistre le brouillon, puis le soumet si demandé. */
  async function save(submit: boolean) {
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      const payload = { ...form, imageUrl: form.imageUrl || undefined };
      // Si la demande existe déjà, on la met à jour au lieu d'en créer une autre
      const saved = id
        ? await api.requests.update(id, payload)
        : await api.requests.create(payload);
     setId(saved.id);
if (submit) {
  await api.requests.submit(saved.id);
  router.push("/dashboard");
} else {
  // Brouillon : on reste dans l'édition de cette demande
  router.push(`/requests/${saved.id}/edit`);
}

    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setMessage(err.message);
      } else {
        setMessage("Erreur inattendue");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        save(true);
      }}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      {message && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{message}</p>}

      <Field label="Catégorie" error={errors.category}>
        <select className={inputClass} value={form.category} onChange={set("category")}>
          <option value="">Choisir…</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="Titre" error={errors.title}>
        <input className={inputClass} value={form.title} onChange={set("title")} />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea className={inputClass} rows={5} value={form.description} onChange={set("description")} />
      </Field>

      <Field label="Localisation" error={errors.location}>
        <input className={inputClass} value={form.location} onChange={set("location")} placeholder="Ex. Pau" />
      </Field>

      <Field label="Disponibilités" error={errors.availability}>
        <input className={inputClass} value={form.availability} onChange={set("availability")} placeholder="Ex. Week-ends" />
      </Field>

      {/* Hors de <label> : un bouton à l'intérieur d'un label déclencherait le sélecteur de fichier */}
      <div className="block text-sm font-medium text-slate-700">
        <p>Photo (facultatif)</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <p className="mt-1 text-xs font-normal text-slate-500">JPG, PNG ou WebP, 2 Mo maximum.</p>
        {photoError && <span className="mt-1 block text-xs text-red-600">{photoError}</span>}
        {errors.imageUrl && <span className="mt-1 block text-xs text-red-600">{errors.imageUrl}</span>}

        {form.imageUrl && (
          <div className="mt-3 space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.imageUrl} alt="Aperçu de la photo" className="max-h-48 rounded-lg object-contain" />
            <Button type="button" variant="secondary" onClick={removePhoto}>
              Retirer la photo
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="button" variant="secondary" disabled={busy} onClick={() => save(false)}>
          Enregistrer le brouillon
        </Button>
        <Button type="submit" disabled={busy}>
          Soumettre la demande
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
