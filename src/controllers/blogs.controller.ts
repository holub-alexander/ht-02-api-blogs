import { Request, Response } from "express";
import { constants } from "http2";
import { BlogInputModel, BlogPostInputModel, PaginationAndSortQueryParams } from "../@types";
import { blogsService } from "../services/blogs.service";
import { postsService } from "../services/posts.service";

export type BlogsQueryParams = PaginationAndSortQueryParams & { searchNameTerm?: string };

export const getBlogsHandler = async (req: Request<{}, {}, {}, BlogsQueryParams>, res: Response) => {
  const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } = req.query;
  const data = await blogsService.getAllBlogs({ sortBy, sortDirection, pageNumber, pageSize, searchNameTerm });

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const getBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const data = await blogsService.getBlogById(req.params.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const getAllPostsByBlogId = async (
  req: Request<{ id: string }, {}, {}, PaginationAndSortQueryParams>,
  res: Response
) => {
  const findBlog = await blogsService.getBlogById(req.params.id);

  if (!findBlog) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
  const paginatorPosts = await postsService.getAllPostsByBlogId({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    id: req.params.id,
  });

  res.status(constants.HTTP_STATUS_OK).send(paginatorPosts);
};

export const createBlogHandler = async (req: Request<{}, {}, BlogInputModel>, res: Response) => {
  const data = await blogsService.createBlog(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const createPostForCurrentBlog = async (req: Request<{ id: string }, {}, BlogPostInputModel>, res: Response) => {
  const findBlog = await blogsService.getBlogById(req.params.id);

  if (!findBlog) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  const createdPost = await postsService.createPost({ ...req.body, blogId: findBlog.id });

  res.status(constants.HTTP_STATUS_OK).send(createdPost);
};

export const updateBlogByIdHandler = async (req: Request<{ id: string }, {}, BlogInputModel>, res: Response) => {
  const isUpdated = await blogsService.updateBlogById(req.params.id, req.body);

  if (!isUpdated) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};

export const deleteBlogHandler = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await blogsService.deleteBlog(req.params.id);

  res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
};
