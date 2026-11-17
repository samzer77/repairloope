import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { authService } from "../services/authService";

export async function register(req: Request, res: Response) {
  res.status(201).json(await authService.register(req.body));
}

export async function login(req: Request, res: Response) {
  res.json(await authService.login(req.body));
}

export async function me(req: AuthRequest, res: Response) {
  res.json({ user: await authService.me(req.auth!.id) });
}
