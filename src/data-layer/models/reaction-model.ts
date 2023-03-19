import mongoose from "mongoose";
import { CommentDBType, ReactionDBType } from "../../@types";

const reactionSchema = new mongoose.Schema<ReactionDBType>({
  comment: {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
  },
  createdAt: Date,
  likeStatus: {
    type: String,
    required: true,
  },
});

export const ReactionModel = mongoose.model<ReactionDBType>("Reaction", reactionSchema);
