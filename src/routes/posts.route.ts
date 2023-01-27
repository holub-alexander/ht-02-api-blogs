import express from "express";
import { validate } from "../middleware/custom/validate";
import {
  createPostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getPostsHandler,
  updatePostByIdHandler,
} from "../service-layer/controllers/posts.controller";
import { postSchema, postsQuerySchema } from "../business-layer/validators/schemas/post-schema";
import { basicAuth } from "../middleware/custom/basic-auth";

const postsRouter = express.Router();

postsRouter.get("/", ...postsQuerySchema, getPostsHandler);
postsRouter.get("/:id", getPostByIdHandler);
postsRouter.post("/", basicAuth, postSchema, validate, createPostHandler);
postsRouter.put("/:id", basicAuth, postSchema, validate, updatePostByIdHandler);
postsRouter.delete("/:id", basicAuth, deletePostHandler);

export default postsRouter;
