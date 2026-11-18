import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

const imageUrl = z.string().trim().url("URL invalide").or(z.literal("")).optional();

// Brouillon : seul le titre est obligatoire
export const draftSchema = z.object({
  category: z.string().trim().default(""),
  title: z.string().trim().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().trim().default(""),
  location: z.string().trim().default(""),
  availability: z.string().trim().default(""),
  imageUrl,
});

// Soumission : tout est obligatoire
export const requestSchema = z.object({
  category: z.string().min(1, "Choisis une catégorie"),
  title: z.string().trim().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().trim().min(20, "La description doit contenir au moins 20 caractères"),
  location: z.string().trim().min(2, "Localisation requise"),
  availability: z.string().trim().min(3, "Indique tes disponibilités"),
  imageUrl,
});

export const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  location: z.string().trim().optional(),
  since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (AAAA-MM-JJ)").optional(),
  sort: z.enum(["recent", "oldest", "title"]).default("recent"),
});

export const textSchema = z.object({
  text: z.string().trim().min(3, "Écris au moins 3 caractères"),
});

export const quoteSchema = z.object({
  work: z.string().trim().min(10, "Décris les travaux (10 caractères minimum)"),
  price: z.coerce.number({ message: "Prix invalide" }).positive("Le prix doit être supérieur à 0"),
  durationDays: z.coerce
    .number({ message: "Durée invalide" })
    .int("Nombre entier requis")
    .positive("La durée doit être d'au moins 1 jour"),
  validUntil: z
    .string()
    .min(1, "Date de validité requise")
    .refine((d) => d >= today(), "La date ne peut pas être dans le passé"),
});

const dateString = z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Date invalide");

export const slotsSchema = z.object({
  slots: z.array(dateString).min(1, "Ajoute au moins un créneau"),
});

export const confirmSchema = z.object({ slot: dateString });

export const reportSchema = z.object({
  diagnosis: z.string().trim().min(5, "Diagnostic requis (5 caractères minimum)"),
  actions: z.string().trim().min(5, "Décris le travail réalisé"),
  parts: z.string().trim().default(""),
  result: z.enum(["done", "unrepairable"], { message: "Résultat invalide" }),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Note de 1 à 5").max(5, "Note de 1 à 5"),
  comment: z.string().trim().min(5, "Écris au moins 5 caractères").max(500, "500 caractères maximum"),
});

export type DraftInput = z.infer<typeof draftSchema>;
export type ListFilters = z.infer<typeof listQuerySchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
