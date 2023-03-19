import { Request, Response } from "express";
import { constants } from "http2";
import { PaginationAndSortQueryParams } from "../../@types";
import { BlogsService } from "../services/blogs-service";
import { PostsService } from "../services/posts-service";
import { BlogInputModel, BlogPostInputModel } from "../request/request-types";
import { BlogsWriteRepository } from "../../data-layer/repositories/blogs/blogs-write-repository";

export type BlogsQueryParams = PaginationAndSortQueryParams & { searchNameTerm?: string };

export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsWriteRepository: BlogsWriteRepository
  ) {}

  public async getBlogsHandler(req: Request<{}, {}, {}, BlogsQueryParams>, res: Response) {
    try {
      const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } = req.query;
      const data = await this.blogsService.getAllBlogs({ sortBy, sortDirection, pageNumber, pageSize, searchNameTerm });

      res.status(constants.HTTP_STATUS_OK).send(data);
    } catch (err) {
      console.log("blog", err);
    }
  }

  async getBlogByIdHandler(req: Request<{ id: string }>, res: Response) {
    const data = await this.blogsService.getBlogById(req.params.id);

    if (data) {
      return res.status(constants.HTTP_STATUS_OK).send(data);
    }

    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  public async getAllPostsByBlogId(req: Request<{ id: string }, {}, {}, PaginationAndSortQueryParams>, res: Response) {
    const findBlog = await this.blogsService.getBlogById(req.params.id);

    if (!findBlog) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const paginatorPosts = await this.postsService.getAllPostsByBlogId({
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      id: req.params.id,
    });

    res.status(constants.HTTP_STATUS_OK).send(paginatorPosts);
  }

  public async createBlogHandler(req: Request<{}, {}, BlogInputModel>, res: Response) {
    const data = await this.blogsService.createBlog(req.body);

    if (!data) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.status(constants.HTTP_STATUS_CREATED).send(data);
  }

  public async createPostForCurrentBlog(req: Request<{ id: string }, {}, BlogPostInputModel>, res: Response) {
    const findBlog = await this.blogsService.getBlogById(req.params.id);

    if (!findBlog) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    const createdPost = await this.postsService.createPost({ ...req.body, blogId: findBlog.id });

    res.status(constants.HTTP_STATUS_CREATED).send(createdPost);
  }

  public async updateBlogByIdHandler(req: Request<{ id: string }, {}, BlogInputModel>, res: Response) {
    const isUpdated = await this.blogsWriteRepository.updateBlogById(req.params.id, req.body);

    if (!isUpdated) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  public async deleteBlogHandler(req: Request<{ id: string }>, res: Response) {
    const isDeleted = await this.blogsWriteRepository.deleteBlog(req.params.id);

    res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }
}
