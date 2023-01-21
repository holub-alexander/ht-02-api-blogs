import express from "express";
import {
  createBlogHandler,
  createPostForCurrentBlog,
  deleteBlogHandler,
  getAllPostsByBlogId,
  getBlogByIdHandler,
  getBlogsHandler,
  updateBlogByIdHandler,
} from "../controllers/blogs.controller";
import { validate } from "../middleware/validate";
import { blogSchema, blogsQuerySchema } from "../utils/schemas/blog-schema";
import { basicAuth } from "../middleware/basic-auth";
import { blogPostSchema } from "../utils/schemas/post-schema";

const blogsRouter = express.Router();

blogsRouter.get("/", ...blogsQuerySchema, validate, getBlogsHandler);
blogsRouter.get("/:id", getBlogByIdHandler);
blogsRouter.get("/:id/posts", getAllPostsByBlogId);
blogsRouter.post("/", basicAuth, blogSchema, validate, createBlogHandler);
blogsRouter.post("/:id/posts", basicAuth, blogPostSchema, validate, createPostForCurrentBlog);
blogsRouter.put("/:id", basicAuth, blogSchema, validate, updateBlogByIdHandler);
blogsRouter.delete("/:id", basicAuth, deleteBlogHandler);

export default blogsRouter;
