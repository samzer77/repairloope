"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import { toFieldErrors } from "@/lib/schemas";
import { OPEN_STATUSES } from "@/lib/types";

const askSchema = z.object({
  text: z.string().trim().min(3, "Écris au moins 3 caractères"),
});

type Props = Omit<SectionProps, "isOwner">;

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const errorClass = "mt-1 text-xs text-red-600";

export function RepairerQuestionForm({ request, busy, run }: Props) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Les questions ne sont possibles que tant que la demande est ouverte
  if (!OPEN_STATUSES.includes(request.status)) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = askSchema.safeParse({ text });
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }
    setErrors({});
    // Le champ n'est vidé que si l'envoi réussit
    run(async () => {
      const updated = await api.requests.ask(request.id, result.data.text);
      setText("");
      return updated;
    });
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Poser une question au propriétaire</h2>

      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm font-medium">
          Ta question
          <textarea
            rows={3}
            className={inputClass}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex. : le modèle exact de l'appareil, la marque ou une photo de la panne ?"
          />
          {errors.text && <span className={errorClass}>{errors.text}</span>}
        </label>

        <Button type="submit" disabled={busy}>
          Envoyer la question
        </Button>
      </form>
    </section>
  );
}
