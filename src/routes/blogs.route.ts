import express from "express";
import { createBlogHandler, getBlogByIdHandler, getBlogsHandler } from "../controllers/blogs.controller";
import { body } from "express-validator";

const blogsRouter = express.Router();

blogsRouter.get("/", getBlogsHandler);
blogsRouter.get("/:id", getBlogByIdHandler);
blogsRouter.post("/", body("name").isLength({ min: 5 }), createBlogHandler);

export default blogsRouter;
