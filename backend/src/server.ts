import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { advertisementRouter } from "./routes/advertisementRoutes";
import { authRouter } from "./routes/authRoutes";
import { notificationRouter } from "./routes/notificationRoutes";
import { profileRouter } from "./routes/profileRoutes";
import { responseRouter } from "./routes/responseRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "musician-platform-backend" });
});

app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api/advertisements", advertisementRouter);
app.use("/api/responses", responseRouter);
app.use("/api/notifications", notificationRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend API is running on http://localhost:${port}`);
});
