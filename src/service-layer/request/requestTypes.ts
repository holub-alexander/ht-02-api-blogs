export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type BlogPostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type CommentInputModel = {
  content: string;
};

export type RegistrationConfirmationCodeModel = {
  code: string;
};

export type RegistrationEmailResending = {
  email: string;
};
