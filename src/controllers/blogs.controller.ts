import { Request, Response } from "express";
import { constants } from "http2";
import { BlogInputModel } from "../@types";
import { blogsService } from "../services/blogs.service";

export const getBlogsHandler = async (_: Request, res: Response) => {
  const data = await blogsService.getAllBlogs();

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const getBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const data = await blogsService.getBlogById(req.params.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const createBlogHandler = async (req: Request<{}, {}, BlogInputModel>, res: Response) => {
  const data = await blogsService.createBlog(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
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
