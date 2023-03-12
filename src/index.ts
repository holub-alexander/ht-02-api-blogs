import blogsRouter from "./routes/blogs-route";
import postsRouter from "./routes/posts-route";
import testingRouter from "./routes/testing-route";
import usersRouter from "./routes/users-route";
import authRouter from "./routes/auth-route";
import { commentsRouter } from "./routes/comments-route";
import { securityRouter } from "./routes/security-route";

import { applicationConfig } from "./middleware/config/application";

const app = applicationConfig();

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
