import { JwtPayload } from "jsonwebtoken";
import { UserInputModel } from "../service-layer/request/requestTypes";

export enum SortDirections {
  ASC = "asc",
  DESC = "desc",
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
};

export type PaginationAndSortQueryParams = Partial<PaginationQueryParams & SortQueryParams>;

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type User = JwtPayload & { loginOrEmail: string };

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type ErrorMessage = {
  type: string;
  message: string;
};

export type UserAccountDBType = {
  accountData: UserInputModel & { createdAt: string };
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
};

export enum ErrorTypes {
  USER_EXISTS = "USER_EXISTS",
}
