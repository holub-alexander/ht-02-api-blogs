import express from "express";
import { validate } from "../middleware/validate";
import {
  createPostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getPostsHandler,
  updatePostByIdHandler,
} from "../controllers/posts.controller";
import { postSchema } from "../utils/schemas/post-schema";

const postsRouter = express.Router();

postsRouter.get("/", getPostsHandler);
postsRouter.get("/:id", getPostByIdHandler);
postsRouter.post("/", postSchema, validate, createPostHandler);
postsRouter.put("/:id", postSchema, validate, updatePostByIdHandler);
postsRouter.delete("/:id", deletePostHandler);

export default postsRouter;
