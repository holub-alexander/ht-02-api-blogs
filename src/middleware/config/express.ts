import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

export const expressConfig = (): Application => {
  const app: Application = express();
  const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.set("trust proxy", true);

  app.use(cookieParser());
  app.use("/api/auth", limiter);
  app.use(
    cors({
      credentials: true,
      origin: [process.env.ORIGIN_LINK as string],
    })
  );
  app.use(bodyParser.json());

  return app;
};
