import express from "express";
import {
  createBlogHandler,
  createPostForCurrentBlog,
  deleteBlogHandler,
  getAllPostsByBlogId,
  getBlogByIdHandler,
  getBlogsHandler,
  updateBlogByIdHandler,
} from "../service-layer/controllers/blogs.controller";
import { validate } from "../middleware/custom/validate";
import { blogSchema, blogsQuerySchema } from "../business-layer/validators/schemas/blog-schema";
import { basicAuth } from "../middleware/custom/basic-auth";
import { blogPostSchema } from "../business-layer/validators/schemas/post-schema";

const blogsRouter = express.Router();

blogsRouter.get("/", ...blogsQuerySchema, validate, getBlogsHandler);
blogsRouter.get("/:id", getBlogByIdHandler);
blogsRouter.get("/:id/posts", getAllPostsByBlogId);
blogsRouter.post("/", basicAuth, blogSchema, validate, createBlogHandler);
blogsRouter.post("/:id/posts", basicAuth, blogPostSchema, validate, createPostForCurrentBlog);
blogsRouter.put("/:id", basicAuth, blogSchema, validate, updateBlogByIdHandler);
blogsRouter.delete("/:id", basicAuth, deleteBlogHandler);

export default blogsRouter;
