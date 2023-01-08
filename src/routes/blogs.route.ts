import express from "express";
import {
  createBlogHandler,
  deleteBlogHandler,
  getBlogByIdHandler,
  getBlogsHandler,
  updateBlogByIdHandler,
} from "../controllers/blogs.controller";
import { validate } from "../middleware/validate";
import { blogSchema } from "../utils/schemas/blog-schema";

const blogsRouter = express.Router();

blogsRouter.get("/", getBlogsHandler);
blogsRouter.get("/:id", getBlogByIdHandler);
blogsRouter.post("/", blogSchema, validate, createBlogHandler);
blogsRouter.put("/:id", blogSchema, validate, updateBlogByIdHandler);
blogsRouter.delete("/:id", deleteBlogHandler);

export default blogsRouter;
