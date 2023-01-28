import { constants } from "http2";
import { Request, Response } from "express";
import { blogsWriteRepository } from "../../data-layer/repositories/blogs/blogs.write.repository";
import { postsWriteRepository } from "../../data-layer/repositories/posts/posts.write.repository";
import { usersWriteRepository } from "../../data-layer/repositories/users/users.write.repository";

export const deleteAllHandler = async (_: Request, res: Response) => {
  await blogsWriteRepository.deleteAllBlogs();
  await postsWriteRepository.deleteAllPosts();
  await usersWriteRepository.deleteAllUsers();

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
