import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { constants } from "http2";
import { Request, Response } from "express";

export const deleteAllHandler = (_: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  postsRepository.deleteAllPosts();

  return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
