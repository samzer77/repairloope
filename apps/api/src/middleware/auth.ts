import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role, userRepository } from "../repositories/userRepository";
import { HttpError } from "./errorHandler";

export interface AuthRequest extends Request {
  auth?: { id: string; role: Role; name: string };
}

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentification requise");
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(header.slice(7), env.JWT_SECRET) as jwt.JwtPayload;
  } catch {
    throw new HttpError(401, "Token invalide ou expiré");
  }

  const user = await userRepository.findById(payload.sub as string);
  if (!user || !user.active) throw new HttpError(401, "Session invalide");

  req.auth = { id: user.id, role: user.role, name: user.name };
  next();
}

export const requireRole =
  (...roles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw new HttpError(403, "Accès interdit");
    }
    next();
  };
