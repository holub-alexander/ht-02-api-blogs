import express from "express";
import { validate } from "../middleware/custom/validate";
import { postLikeUnlikeSchema, postSchema, postsQuerySchema } from "../business-layer/validators/schemas/post-schema";
import { basicAuth } from "../middleware/custom/basic-auth";
import { verifyJwtToken, verifyJwtTokenOptional } from "../middleware/custom/jwt-auth";
import { commentCreateSchema } from "../business-layer/validators/schemas/comment-schema";
import { postsController } from "../data-layer/composition-root";

const postsRouter = express.Router();

postsRouter.get(
  "/",
  ...postsQuerySchema,
  verifyJwtTokenOptional,
  postsController.getPostsHandler.bind(postsController)
);
postsRouter.get("/:id", verifyJwtTokenOptional, postsController.getPostByIdHandler.bind(postsController));
postsRouter.post("/", basicAuth, postSchema, validate, postsController.createPostHandler.bind(postsController));
postsRouter.put("/:id", basicAuth, postSchema, validate, postsController.updatePostByIdHandler.bind(postsController));
postsRouter.delete("/:id", basicAuth, postsController.deletePostHandler.bind(postsController));
postsRouter.post(
  "/:id/comments",
  verifyJwtToken,
  commentCreateSchema,
  validate,
  postsController.createCommentByCurrentPost.bind(postsController)
);
postsRouter.get(
  "/:id/comments",
  verifyJwtTokenOptional,
  postsController.getAllCommentsForPostHandler.bind(postsController)
);
postsRouter.put(
  "/:id/like-status",
  verifyJwtToken,
  postLikeUnlikeSchema,
  validate,
  postsController.setLikeUnlikeForPostHandler.bind(postsController)
);

export default postsRouter;
