import mongoose from "mongoose";
import { WEBSITE_URL } from "../../utils/constants/regex";
import { BlogDBType } from "../../@types";

const blogSchema = new mongoose.Schema<BlogDBType>({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  description: {
    required: true,
    type: String,
    trim: true,
  },
  websiteUrl: {
    required: true,
    type: String,
    trim: true,
    regexp: WEBSITE_URL,
  },
  createdAt: Date,
  isMembership: {
    type: Boolean,
    default: false,
  },
});

export const BlogModel = mongoose.model<BlogDBType>("Blog", blogSchema);
