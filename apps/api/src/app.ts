import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://10.188.255.30:3000"],
  }),
);

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);
