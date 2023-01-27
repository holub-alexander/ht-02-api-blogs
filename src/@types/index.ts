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
