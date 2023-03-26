import express from "express";
import { validate } from "../middleware/custom/validate";
import { blogSchema, blogsQuerySchema } from "../business-layer/validators/schemas/blog-schema";
import { basicAuth } from "../middleware/custom/basic-auth";
import { blogPostSchema } from "../business-layer/validators/schemas/post-schema";
import { blogsController } from "../data-layer/composition-root";
import { verifyJwtTokenOptional } from "../middleware/custom/jwt-auth";

const blogsRouter = express.Router();

blogsRouter.get("/", ...blogsQuerySchema, validate, blogsController.getBlogsHandler.bind(blogsController));
blogsRouter.get("/:id", blogsController.getBlogByIdHandler.bind(blogsController));
blogsRouter.get("/:id/posts", verifyJwtTokenOptional, blogsController.getAllPostsByBlogId.bind(blogsController));
blogsRouter.post("/", basicAuth, blogSchema, validate, blogsController.createBlogHandler.bind(blogsController));
blogsRouter.post(
  "/:id/posts",
  basicAuth,
  blogPostSchema,
  validate,
  blogsController.createPostForCurrentBlog.bind(blogsController)
);
blogsRouter.put("/:id", basicAuth, blogSchema, validate, blogsController.updateBlogByIdHandler.bind(blogsController));
blogsRouter.delete("/:id", basicAuth, blogsController.deleteBlogHandler.bind(blogsController));

export default blogsRouter;
