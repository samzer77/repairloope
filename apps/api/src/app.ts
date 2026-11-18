import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { requestRouter } from "./routes/requests";
import { categoryRouter, repairerRouter, userRouter } from "./routes/catalog";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://10.188.255.30:3000"],
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ app: "RepairLoop API", health: "/api/health" });
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/requests", requestRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/repairers", repairerRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);
