import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().trim().email("E-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["owner", "repairer"], { message: "Choisis un type de compte" }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export function toFieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
