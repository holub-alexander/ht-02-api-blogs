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
import { basicAuth } from "../middleware/basic-auth";

const postsRouter = express.Router();

postsRouter.get("/", getPostsHandler);
postsRouter.get("/:id", getPostByIdHandler);
postsRouter.post("/", basicAuth, postSchema, validate, createPostHandler);
postsRouter.put("/:id", basicAuth, postSchema, validate, updatePostByIdHandler);
postsRouter.delete("/:id", basicAuth, deletePostHandler);

export default postsRouter;
