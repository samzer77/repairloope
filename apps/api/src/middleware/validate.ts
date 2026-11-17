import { RequestHandler } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "form");
        if (!errors[field]) errors[field] = issue.message;
      }
      res.status(400).json({ message: "Données invalides", errors });
      return;
    }
    req.body = result.data;
    next();
  };
