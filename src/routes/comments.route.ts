import express from "express";
import {
  deleteCommentByIdHandler,
  getCommentByIdHandler,
  updateCommentByIdHandler,
} from "../service-layer/controllers/comments.controller";
import { verifyJwtToken } from "../middleware/custom/jwt-auth";
import { commentCreateSchema } from "../business-layer/validators/schemas/comment-schema";
import { validate } from "../middleware/custom/validate";

export const commentsRouter = express.Router();

commentsRouter.put("/:id", verifyJwtToken, commentCreateSchema, validate, updateCommentByIdHandler);
commentsRouter.delete("/:id", verifyJwtToken, deleteCommentByIdHandler);
commentsRouter.get("/:id", getCommentByIdHandler);
