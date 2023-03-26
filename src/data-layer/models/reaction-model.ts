import mongoose from "mongoose";
import { CommentDBType, ReactionDBType } from "../../@types";

const reactionSchema = new mongoose.Schema<ReactionDBType>({
  commentId: {
    type: mongoose.Types.ObjectId,
  },
  postId: {
    type: mongoose.Types.ObjectId,
  },
  user: {
    id: { type: mongoose.Types.ObjectId },
    login: { type: String, required: true },
  },
  createdAt: Date,
  likeStatus: {
    type: String,
    required: true,
  },
});

export const ReactionModel = mongoose.model<ReactionDBType>("Reaction", reactionSchema);
