import { checkSchema } from "express-validator";
import { LikeStatuses } from "../../../@types";

export const commentCreateSchema = checkSchema(
  {
    content: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 20 to 300 characters",
        options: {
          min: 20,
          max: 300,
        },
      },
    },
  },
  ["body"]
);

export const commentLikeUnlikeSchema = checkSchema(
  {
    likeStatus: {
      isIn: {
        errorMessage: "Invalid status entered",
        options: [[LikeStatuses.NONE, LikeStatuses.LIKE, LikeStatuses.DISLIKE]],
      },
    },
  },
  ["body"]
);
