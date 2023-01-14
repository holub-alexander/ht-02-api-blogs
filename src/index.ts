import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import blogsRouter from "./routes/blogs.route";
import postsRouter from "./routes/posts.route";
import testingRouter from "./routes/testing.route";
import { connectDB } from "./utils/common/connectDB";

export const app: Application = express();
const port = process.env.PORT || 5000;

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

app.use("/api/blogs", blogsRouter);
// app.use("/api/posts", postsRouter);
app.use("/api/testing", testingRouter);

app.listen(port, async () => {
  await connectDB();
  console.log(`App listening on port ${port}`);
});
