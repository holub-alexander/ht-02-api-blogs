import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { constants } from "http2";
import { BlogInputModel } from "../@types";

export const getBlogsHandler = (_: Request, res: Response) => {
  const data = blogsRepository.getAllBlogs();

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const getBlogByIdHandler = (req: Request<{ id: string }>, res: Response) => {
  const data = blogsRepository.getBlogById(req.params.id);
  console.log(req.query.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const createBlogHandler = (req: Request<{}, {}, BlogInputModel>, res: Response) => {
  const data = blogsRepository.createBlog(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const updateBlogByIdHandler = (req: Request<{ id: string }, {}, BlogInputModel>, res: Response) => {
  const data = blogsRepository.updateBlogById(req.params.id, req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};

export const deleteBlogHandler = (req: Request<{ id: string }>, res: Response) => {
  const data = blogsRepository.deleteBlog(req.params.id);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
