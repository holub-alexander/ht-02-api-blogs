export enum SortDirections {
  ASC = "asc",
  DESC = "desc",
}

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = BlogInputModel & {
  id: string;
  createdAt: string;
};

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostViewModel = PostInputModel & {
  id: string;
  blogName: string;
  createdAt: string;
};

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

export type BlogPostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};
