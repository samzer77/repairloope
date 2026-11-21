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
const todayParis = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });

export const quoteFormSchema = z.object({
  work: z.string().trim().min(10, "Décris les travaux (10 caractères minimum)"),
  price: z.coerce.number({ message: "Prix invalide" }).positive("Le prix doit être supérieur à 0"),
  durationDays: z.coerce
    .number({ message: "Durée invalide" })
    .int("Nombre entier requis")
    .positive("La durée doit être d'au moins 1 jour"),
  validUntil: z
    .string()
    .min(1, "Date de validité requise")
    .refine((d) => d >= todayParis(), "La date ne peut pas être dans le passé"),
});

export const reportFormSchema = z.object({
  diagnosis: z.string().trim().min(5, "Diagnostic requis (5 caractères minimum)"),
  actions: z.string().trim().min(5, "Décris le travail réalisé"),
  parts: z.string().trim(),
  result: z.enum(["done", "unrepairable"], { message: "Résultat invalide" }),
});
