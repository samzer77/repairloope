import { RequestHandler } from "express";
import { ZodType } from "zod";

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

export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Données invalides", errors: toFieldErrors(result.error.issues) });
      return;
    }
    req.body = result.data;
    next();
  };
