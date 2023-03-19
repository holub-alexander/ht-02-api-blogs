import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import blogsRouter from "../../routes/blogs-route";

export const expressConfig = (): Application => {
  const app: Application = express();

  app.set("trust proxy", true);

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [process.env.ORIGIN_LINK as string],
    })
  );
  app.use(bodyParser.json());

  app.use("/api/blogs", blogsRouter);

  return app;
};
