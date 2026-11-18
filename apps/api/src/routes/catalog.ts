import { Router } from "express";
import { categoryController, repairerController, userController } from "../controllers/catalogController";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { activeSchema, categorySchema, profileSchema, verifySchema } from "../validation/misc";

const admin = requireRole("admin");

export const categoryRouter = Router();
categoryRouter.get("/", categoryController.list);
categoryRouter.post("/", requireAuth, admin, validate(categorySchema), categoryController.add);
categoryRouter.delete("/:name", requireAuth, admin, categoryController.remove);

export const repairerRouter = Router();
repairerRouter.get("/", repairerController.list);
repairerRouter.get("/me", requireAuth, requireRole("repairer"), repairerController.getMine);
repairerRouter.put("/me", requireAuth, requireRole("repairer"), validate(profileSchema), repairerController.saveMine);
repairerRouter.get("/:id", repairerController.get);
repairerRouter.patch("/:id/verify", requireAuth, admin, validate(verifySchema), repairerController.verify);

export const userRouter = Router();
userRouter.use(requireAuth, admin);
userRouter.get("/", userController.search);
userRouter.patch("/:id/active", validate(activeSchema), userController.setActive);
