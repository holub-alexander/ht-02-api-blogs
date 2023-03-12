import { constants } from "http2";
import { Request, Response } from "express";
import { BlogsWriteRepository } from "../../data-layer/repositories/blogs/blogs-write-repository";
import { PostsWriteRepository } from "../../data-layer/repositories/posts/posts-write-repository";
import { UsersWriteRepository } from "../../data-layer/repositories/users/users-write-repository";

export class TestingController {
  constructor(
    private blogsWriteRepository: BlogsWriteRepository,
    private postsWriteRepository: PostsWriteRepository,
    private usersWriteRepository: UsersWriteRepository
  ) {}

  async deleteAllHandler(_: Request, res: Response) {
    await this.blogsWriteRepository.deleteAllBlogs();
    await this.postsWriteRepository.deleteAllPosts();
    await this.usersWriteRepository.deleteAllUsers();

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }
}
