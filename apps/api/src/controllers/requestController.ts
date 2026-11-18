import { param } from "../utils/params.js";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { requestService } from "../services/requestService";
import { listQuerySchema } from "../validation/requests";

const me = (req: AuthRequest) => req.auth!;

export const requestController = {
  async list(req: AuthRequest, res: Response) {
    res.json(await requestService.search(me(req), listQuerySchema.parse(req.query)));
  },
  async mine(req: AuthRequest, res: Response) {
    res.json(await requestService.mine(me(req)));
  },
  async get(req: AuthRequest, res: Response) {
    res.json(await requestService.get(me(req), param(req, "id")));
  },
  async create(req: AuthRequest, res: Response) {
    res.status(201).json(await requestService.create(me(req), req.body));
  },
  async update(req: AuthRequest, res: Response) {
    res.json(await requestService.update(me(req), param(req, "id"), req.body));
  },
  async submit(req: AuthRequest, res: Response) {
    res.json(await requestService.submit(me(req), param(req, "id")));
  },
  async cancel(req: AuthRequest, res: Response) {
    res.json(await requestService.cancel(me(req), param(req, "id")));
  },
  async ask(req: AuthRequest, res: Response) {
    res.status(201).json(await requestService.ask(me(req), param(req, "id"), req.body.text));
  },
  async answer(req: AuthRequest, res: Response) {
    res.json(await requestService.answer(me(req), param(req, "id"), param(req, "questionId"), req.body.text));
  },
  async addQuote(req: AuthRequest, res: Response) {
    res.status(201).json(await requestService.addQuote(me(req), param(req, "id"), req.body));
  },
  async withdrawQuote(req: AuthRequest, res: Response) {
    res.json(await requestService.withdrawQuote(me(req), param(req, "id"), param(req, "quoteId")));
  },
  async rejectQuote(req: AuthRequest, res: Response) {
    res.json(await requestService.rejectQuote(me(req), param(req, "id"), param(req, "quoteId")));
  },
  async acceptQuote(req: AuthRequest, res: Response) {
    res.json(await requestService.acceptQuote(me(req), param(req, "id"), param(req, "quoteId")));
  },
  async proposeSlots(req: AuthRequest, res: Response) {
    res.json(await requestService.proposeSlots(me(req), param(req, "id"), req.body.slots));
  },
  async confirmSlot(req: AuthRequest, res: Response) {
    res.json(await requestService.confirmSlot(me(req), param(req, "id"), req.body.slot));
  },
  async startRepair(req: AuthRequest, res: Response) {
    res.json(await requestService.startRepair(me(req), param(req, "id")));
  },
  async saveReport(req: AuthRequest, res: Response) {
    res.json(await requestService.saveReport(me(req), param(req, "id"), req.body));
  },
  async addReview(req: AuthRequest, res: Response) {
    res.status(201).json(await requestService.addReview(me(req), param(req, "id"), req.body));
  },
};
