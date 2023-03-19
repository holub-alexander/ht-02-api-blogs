import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import blogsRouter from "../../routes/blogs-route";
import authRouter from "../../routes/auth-route";
import postsRouter from "../../routes/posts-route";
import usersRouter from "../../routes/users-route";
import { commentsRouter } from "../../routes/comments-route";
import { securityRouter } from "../../routes/security-route";
import testingRouter from "../../routes/testing-route";

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

  /**
   *  Routes
   */

  app.use("/api/auth", authRouter);
  app.use("/api/blogs", blogsRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/security", securityRouter);
  app.use("/api/testing", testingRouter);

  return app;
};
