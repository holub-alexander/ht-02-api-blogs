import { BlogInputModel, PostInputModel, UserInputModel } from "../request/requestTypes";
import { CommentatorInfo } from "../../@types";

export type BlogViewModel = BlogInputModel & {
  id: string;
  createdAt: string;
  isMembership: boolean;
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

export type LoginSuccessViewModel = {
  accessToken: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
