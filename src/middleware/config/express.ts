import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

export const expressConfig = (): Application => {
  const app: Application = express();

  app.use(
    cors({
      credentials: true,
      origin: [process.env.ORIGIN_LINK as string],
    })
  );
  app.use(bodyParser.json());

  return app;
};
