"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { ApiError } from "@/lib/api";
import { registerSchema, toFieldErrors } from "@/lib/schemas";
import { useAuth } from "./AuthContext";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      await register(result.data);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setServerError(err.message);
      } else {
        setServerError("Erreur inattendue");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        label="Nom"
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={(name) => setValues({ ...values, name })}
        error={errors.name}
      />
      <FormField
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(email) => setValues({ ...values, email })}
        error={errors.email}
      />
      <FormField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(password) => setValues({ ...values, password })}
        error={errors.password}
      />

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Type de compte
        </label>
        <select
          id="role"
          value={values.role}
          onChange={(e) => setValues({ ...values, role: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="owner">Propriétaire (je veux faire réparer un objet)</option>
          <option value="repairer">Réparateur (je propose mes services)</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {submitting ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
