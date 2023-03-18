import mongoose from "mongoose";
import { CommentDBType } from "../../@types";

const commentSchema = new mongoose.Schema<CommentDBType>({
  content: {
    type: String,
    trim: true,
    required: true,
  },
  commentatorInfo: {
    id: mongoose.Types.ObjectId,
    login: {
      type: String,
      required: true,
    },
  },
  createdAt: Date,
  postId: mongoose.Types.ObjectId,
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
  },
});

export const CommentModel = mongoose.model<CommentDBType>("Comment", commentSchema);
