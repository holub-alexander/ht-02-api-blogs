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
import { basicAuth } from "../middleware/basic-auth";

const blogsRouter = express.Router();

blogsRouter.get("/", getBlogsHandler);
blogsRouter.get("/:id", getBlogByIdHandler);
blogsRouter.post("/", basicAuth, blogSchema, validate, createBlogHandler);
blogsRouter.put("/:id", basicAuth, blogSchema, validate, updateBlogByIdHandler);
blogsRouter.delete("/:id", basicAuth, deleteBlogHandler);

export default blogsRouter;
