import { constants } from "http2";
import { Request, Response } from "express";
import { blogsService } from "../services/blogs.service";
import { postsService } from "../services/posts.service";

export const deleteAllHandler = async (_: Request, res: Response) => {
  await blogsService.deleteAllBlogs();
  await postsService.deleteAllPosts();

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
