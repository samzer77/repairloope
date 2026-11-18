import type { Request } from "express";

/** Lit un paramètre de route (/:id) et garantit un string. */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

/** Lit un paramètre de query (?q=...) : string ou undefined. */
export function queryString(req: Request, name: string): string | undefined {
  const value = req.query[name];
  return typeof value === "string" ? value : undefined;
}
