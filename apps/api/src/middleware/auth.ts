import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../repositories/userRepository";
import { HttpError } from "./errorHandler";

export interface AuthRequest extends Request {
  auth?: { id: string; role: Role };
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentification requise");
  }
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as jwt.JwtPayload;
    req.auth = { id: payload.sub as string, role: payload.role as Role };
    next();
  } catch {
    throw new HttpError(401, "Token invalide ou expiré");
  }
}

export const requireRole =
  (...roles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw new HttpError(403, "Accès interdit");
    }
    next();
  };
