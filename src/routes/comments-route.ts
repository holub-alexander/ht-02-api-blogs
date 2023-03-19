import express from "express";
import { verifyJwtToken, verifyJwtTokenOptional } from "../middleware/custom/jwt-auth";
import { commentCreateSchema, commentLikeUnlikeSchema } from "../business-layer/validators/schemas/comment-schema";
import { validate } from "../middleware/custom/validate";
import { commentsController } from "../data-layer/composition-root";

export const commentsRouter = express.Router();

commentsRouter.put(
  "/:id",
  verifyJwtToken,
  commentCreateSchema,
  validate,
  commentsController.updateCommentByIdHandler.bind(commentsController)
);
commentsRouter.delete("/:id", verifyJwtToken, commentsController.deleteCommentByIdHandler.bind(commentsController));
commentsRouter.get("/:id", verifyJwtTokenOptional, commentsController.getCommentByIdHandler.bind(commentsController));
commentsRouter.put(
  "/:id/like-status",
  verifyJwtToken,
  commentLikeUnlikeSchema,
  validate,
  commentsController.setLikeUnlikeForCommentHandler.bind(commentsController)
);
