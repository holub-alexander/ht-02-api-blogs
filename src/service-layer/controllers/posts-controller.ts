import { Request, Response } from "express";
import { constants } from "http2";
import { PostsService } from "../services/posts-service";
import { PaginationAndSortQueryParams } from "../../@types";
import { CommentInputModel, PostInputModel } from "../request/request-types";
import { PostViewModel } from "../response/response-types";
import { PostsWriteRepository } from "../../data-layer/repositories/posts/posts-write-repository";

export class PostsController {
  constructor(protected postsService: PostsService, protected postsWriteRepository: PostsWriteRepository) {}

  async getPostsHandler(req: Request<{}, {}, {}, PaginationAndSortQueryParams>, res: Response) {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const data = await this.postsService.getAllPosts({ sortBy, sortDirection, pageNumber, pageSize });

    res.status(constants.HTTP_STATUS_OK).send(data);
  }

  async getPostByIdHandler(req: Request<{ id: string }>, res: Response) {
    const data = await this.postsService.getPostById(req.params.id);

    if (data) {
      return res.status(constants.HTTP_STATUS_OK).send(data);
    }

    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  async createPostHandler(req: Request<{}, {}, PostViewModel>, res: Response) {
    const data = await this.postsService.createPost(req.body);

    if (!data) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.status(constants.HTTP_STATUS_CREATED).send(data);
  }

  async updatePostByIdHandler(req: Request<{ id: string }, {}, PostInputModel>, res: Response) {
    const isUpdated = await this.postsWriteRepository.updatePostById(req.params.id, req.body);

    res.sendStatus(isUpdated ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }

  async deletePostHandler(req: Request<{ id: string }>, res: Response) {
    const isDeleted = await this.postsWriteRepository.deletePost(req.params.id);

    res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }

  async createCommentByCurrentPost(req: Request<{ id: string }, {}, CommentInputModel>, res: Response) {
    const data = await this.postsService.createCommentByCurrentPost(req.params.id, req.body, req.user.loginOrEmail);

    if (!data) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.status(constants.HTTP_STATUS_CREATED).send(data);
  }

  async getAllCommentsForPostHandler(
    req: Request<{ id: string }, {}, {}, PaginationAndSortQueryParams>,
    res: Response
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const data = await this.postsService.getAllCommentsForPost({
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      postId: req.params.id,
    });

    if (!data) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.status(constants.HTTP_STATUS_OK).send(data);
  }
}
