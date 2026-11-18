import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(40, "40 caractères maximum"),
});

export const profileSchema = z.object({
  bio: z.string().trim().min(10, "Présentation trop courte (10 caractères minimum)"),
  zone: z.string().trim().min(2, "Zone desservie requise"),
  availability: z.string().trim().min(3, "Indique tes disponibilités"),
  categories: z.array(z.string()).min(1, "Choisis au moins une catégorie"),
});

export const verifySchema = z.object({ verified: z.boolean({ message: "Valeur invalide" }) });
export const activeSchema = z.object({ active: z.boolean({ message: "Valeur invalide" }) });

export type ProfileInput = z.infer<typeof profileSchema>;
