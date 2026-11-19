import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { categoryService } from "../services/categoryService";
import { repairerService } from "../services/repairerService";
import { userService } from "../services/userService";
import { param, queryString } from "../utils/params";

export const categoryController = {
  async list(_req: Request, res: Response) {
    res.json(await categoryService.list());
  },
  async add(req: Request, res: Response) {
    res.status(201).json({ name: await categoryService.add(req.body.name) });
  },
  async remove(req: Request, res: Response) {
    await categoryService.remove(param(req, "name"));
    res.status(204).end();
  },
};

export const repairerController = {
  async list(req: Request, res: Response) {
    res.json(await repairerService.list(queryString(req, "category")));
  },
  async get(req: Request, res: Response) {
    res.json(await repairerService.get(param(req, "id")));
  },
  async getMine(req: AuthRequest, res: Response) {
    res.json(await repairerService.get(req.auth!.id));
  },
  async saveMine(req: AuthRequest, res: Response) {
    res.json(await repairerService.save(req.auth!, req.body));
  },
  async verify(req: Request, res: Response) {
    res.json(await repairerService.setVerified(param(req, "id"), req.body.verified));
  },
};

export const userController = {
  async search(req: Request, res: Response) {
    res.json(await userService.search(queryString(req, "q")));
  },
  async setActive(req: AuthRequest, res: Response) {
    res.json(await userService.setActive(req.auth!, param(req, "id"), req.body.active));
  },
};
