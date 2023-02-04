import express from "express";
import { validate } from "../middleware/custom/validate";
import {
  createCommentByCurrentPost,
  createPostHandler,
  deletePostHandler,
  getAllCommentsForPostHandler,
  getPostByIdHandler,
  getPostsHandler,
  updatePostByIdHandler,
} from "../service-layer/controllers/posts.controller";
import { postSchema, postsQuerySchema } from "../business-layer/validators/schemas/post-schema";
import { basicAuth } from "../middleware/custom/basic-auth";
import { verifyJwtToken } from "../middleware/custom/jwt-auth";
import { commentCreateSchema } from "../business-layer/validators/schemas/comment-schema";

const postsRouter = express.Router();

postsRouter.get("/", ...postsQuerySchema, getPostsHandler);
postsRouter.get("/:id", getPostByIdHandler);
postsRouter.post("/", basicAuth, postSchema, validate, createPostHandler);
postsRouter.put("/:id", basicAuth, postSchema, validate, updatePostByIdHandler);
postsRouter.delete("/:id", basicAuth, deletePostHandler);
postsRouter.post("/:id/comments", verifyJwtToken, commentCreateSchema, validate, createCommentByCurrentPost);
postsRouter.get("/:id/comments", getAllCommentsForPostHandler);

export default postsRouter;
