import { BlogInputModel, PostInputModel, UserInputModel } from "../request/requestTypes";

export type BlogViewModel = BlogInputModel & {
  id: string;
  createdAt: string;
};

export type PostViewModel = PostInputModel & {
  id: string;
  blogName: string;
  createdAt: string;
};

export type UserViewModel = Omit<UserInputModel, "password"> & {
  id: string;
  createdAt: string;
};
