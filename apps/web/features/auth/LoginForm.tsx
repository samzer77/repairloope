"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { ApiError } from "@/lib/api";
import { loginSchema, toFieldErrors } from "@/lib/schemas";
import { useAuth } from "./AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Erreur inattendue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        autoComplete="current-password"
        value={values.password}
        onChange={(password) => setValues({ ...values, password })}
        error={errors.password}
      />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {submitting ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
