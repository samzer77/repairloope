import { Router } from "express";
import { requestController as c } from "../controllers/requestController";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  confirmSchema, draftSchema, quoteSchema, reportSchema, reviewSchema, slotsSchema, textSchema,
} from "../validation/requests";

export const requestRouter = Router();
requestRouter.use(requireAuth);

const owner = requireRole("owner");
const repairer = requireRole("repairer");

requestRouter.get("/", requireRole("repairer", "admin"), c.list);
requestRouter.get("/mine", c.mine);
requestRouter.post("/", owner, validate(draftSchema), c.create);

requestRouter.get("/:id", c.get);
requestRouter.put("/:id", owner, validate(draftSchema), c.update);
requestRouter.post("/:id/submit", owner, c.submit);
requestRouter.post("/:id/cancel", owner, c.cancel);

requestRouter.post("/:id/questions", repairer, validate(textSchema), c.ask);
requestRouter.post("/:id/questions/:questionId/answer", owner, validate(textSchema), c.answer);

requestRouter.post("/:id/quotes", repairer, validate(quoteSchema), c.addQuote);
requestRouter.delete("/:id/quotes/:quoteId", repairer, c.withdrawQuote);
requestRouter.post("/:id/quotes/:quoteId/accept", owner, c.acceptQuote);
requestRouter.post("/:id/quotes/:quoteId/reject", owner, c.rejectQuote);

requestRouter.post("/:id/appointment", repairer, validate(slotsSchema), c.proposeSlots);
requestRouter.post("/:id/appointment/confirm", owner, validate(confirmSchema), c.confirmSlot);
requestRouter.post("/:id/start", repairer, c.startRepair);
requestRouter.post("/:id/report", repairer, validate(reportSchema), c.saveReport);
requestRouter.post("/:id/review", owner, validate(reviewSchema), c.addReview);
