import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { categoryService } from "../services/categoryService";
import { repairerService } from "../services/repairerService";
import { userService } from "../services/userService";

export const categoryController = {
  async list(_req: Request, res: Response) {
    res.json(await categoryService.list());
  },
  async add(req: Request, res: Response) {
    res.status(201).json({ name: await categoryService.add(req.body.name) });
  },
  async remove(req: Request, res: Response) {
    await categoryService.remove(req.params.name);
    res.status(204).end();
  },
};

export const repairerController = {
  async list(req: Request, res: Response) {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    res.json(await repairerService.list(category));
  },
  async get(req: Request, res: Response) {
    res.json(await repairerService.get(req.params.id));
  },
  async getMine(req: AuthRequest, res: Response) {
    res.json(await repairerService.get(req.auth!.id));
  },
  async saveMine(req: AuthRequest, res: Response) {
    res.json(await repairerService.save(req.auth!, req.body));
  },
  async verify(req: Request, res: Response) {
    res.json(await repairerService.setVerified(req.params.id, req.body.verified));
  },
};

export const userController = {
  async search(req: Request, res: Response) {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    res.json(await userService.search(search));
  },
  async setActive(req: AuthRequest, res: Response) {
    res.json(await userService.setActive(req.auth!, req.params.id, req.body.active));
  },
};
