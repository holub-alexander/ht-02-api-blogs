import mongoose from "mongoose";
import { PostDBType } from "../../@types";

const postSchema = new mongoose.Schema<PostDBType>({
  title: {
    required: true,
    trim: true,
    type: String,
  },
  shortDescription: {
    required: true,
    trim: true,
    type: String,
  },
  content: {
    required: true,
    trim: true,
    type: String,
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
});

export const PostModel = mongoose.model<PostDBType>("Post", postSchema);
