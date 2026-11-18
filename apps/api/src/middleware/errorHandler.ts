import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { toFieldErrors } from "./validate";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string>,
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: "Données invalides", errors: toFieldErrors(err.issues) });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON invalide" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Erreur interne du serveur" });
};
