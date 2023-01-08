export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = BlogInputModel & {
  id: string;
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
};

export type FieldError = Partial<{
  message: string;
  field: string;
}>;

export type APIErrorResult = {
  errorsMessages: FieldError[];
};
