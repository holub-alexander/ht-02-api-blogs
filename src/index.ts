import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import blogsRouter from "./routes/blogs.route";

export const app: Application = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

/**
 *  Routes
 */

app.use("/api/blogs", blogsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
