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
    res.status(constants.HTTP_STATUS_OK).send(data);
    return;
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const createBlogHandler = (req: Request<{}, {}, BlogInputModel>, res: Response) => {
  const data = blogsRepository.createBlog(req.body);

  if (!data) {
    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    return;
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};
