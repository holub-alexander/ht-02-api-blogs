import mongoose from "mongoose";
import { PostDBType } from "../../@types";

const postSchema = new mongoose.Schema<PostDBType>({
  title: {
    required: true,
    trim: true,
    type: String,
    min: 1,
    max: 30,
  },
  shortDescription: {
    required: true,
    trim: true,
    type: String,
    min: 1,
    max: 100,
  },
  content: {
    required: true,
    trim: true,
    type: String,
    min: 1,
    max: 1000,
  },
  blog: {
    id: mongoose.Types.ObjectId,
    name: {
      required: true,
      trim: true,
      type: String,
    },
  },
  createdAt: Date,
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
  },
});

export const PostModel = mongoose.model<PostDBType>("Post", postSchema);
