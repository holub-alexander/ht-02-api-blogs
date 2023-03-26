import { JwtPayload } from "jsonwebtoken";
import { UserInputModel } from "../service-layer/request/request-types";
import { ObjectId, WithId } from "mongodb";

export enum SortDirections {
  ASC = "asc",
  DESC = "desc",
}

export enum LikeStatuses {
  NONE = "None",
  LIKE = "Like",
  DISLIKE = "Dislike",
}

export type FieldError = Partial<{
  message: string;
  field: string;
}>;

export type APIErrorResult = {
  errorsMessages: FieldError[];
};

export type PaginationQueryParams = {
  pageNumber: number;
  pageSize: number;
};

export type SortQueryParams = {
  sortBy: string;
  sortDirection: SortDirections;
  field?: string;
};

export type PaginationAndSortQueryParams = Partial<PaginationQueryParams & SortQueryParams>;

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type User = JwtPayload & { loginOrEmail: string; login: string };

export type UserRefreshTokenPayload = { login: string; deviceId: string; iat: number; exp: number };

export type RefreshTokenMeta = {
  ip: string;
  title: string;
  deviceId: string;
  issuedAt: Date;
  expirationDate: Date;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
};

/**
 * DB Types
 */

export type UserAccountDBType = WithId<{
  accountData: UserInputModel & { createdAt: string };
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string | null;
  };
  refreshTokensMeta: RefreshTokenMeta[] | [];
  comments: {
    likeComments: ObjectId[];
    dislikeComments: ObjectId[];
  };
}>;

export type BlogDBType = WithId<{
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}>;

export type CommentDBType = WithId<{
  content: string;
  commentatorInfo: {
    id: ObjectId;
    login: string;
  };
  postId: ObjectId;
  createdAt: string;
  likesInfo: LikesInfo;
}>;

export type PostDBType = WithId<{
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  blog: {
    id: ObjectId;
    name: string;
  };
  likesInfo: LikesInfo;
}>;

export type ReactionDBType = WithId<{
  commentId: ObjectId | null;
  postId: ObjectId | null;
  user: {
    id: ObjectId;
    login: string;
  };
  createdAt: string;
  likeStatus: LikeStatuses;
}>;
