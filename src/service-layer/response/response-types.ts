import { BlogInputModel, PostInputModel, UserInputModel } from "../request/request-types";
import { LikeStatuses } from "../../@types";

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

export type LikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatuses;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
};

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
};
