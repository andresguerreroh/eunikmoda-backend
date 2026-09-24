import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "node:path";
import { env } from "./config/env";
import { publicRouter } from "./routes/public";
import { adminRouter } from "./routes/admin";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      // permite que las imágenes servidas desde /uploads se carguen en el
      // frontend (otro origen) sin que el CSP por defecto las bloquee.
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  if (env.nodeEnv !== "test") {
    app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  }

  app.use("/uploads", express.static(path.resolve(process.cwd(), env.uploadsDir)));

  app.get("/health", (_req, res) => res.json({ ok: true, env: env.nodeEnv }));

  app.use("/api/v1/public", publicRouter);
  app.use("/api/v1/admin", adminRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
