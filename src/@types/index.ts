import { JwtPayload } from "jsonwebtoken";
import { UserInputModel } from "../service-layer/request/request-types";

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

export type User = JwtPayload & { loginOrEmail: string; login: string };

export type PasswordRecoveryPayload = JwtPayload & { email: string };

export type UserRefreshTokenPayload = { login: string; deviceId: string; iat: number; exp: number };

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type ErrorMessage = {
  type: string;
  message: string;
};

export type RefreshTokenMeta = {
  ip: string;
  title: string;
  deviceId: string;
  issuedAt: Date;
  expirationDate: Date;
};

export type UserAccountDBType = {
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
};

export enum ErrorTypes {
  USER_EXISTS = "USER_EXISTS",
}
