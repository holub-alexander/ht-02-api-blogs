import { BlogInputModel, PostInputModel } from "../request/requestTypes";

export type BlogViewModel = BlogInputModel & {
  id: string;
  createdAt: string;
};

export type PostViewModel = PostInputModel & {
  id: string;
  blogName: string;
  createdAt: string;
};
