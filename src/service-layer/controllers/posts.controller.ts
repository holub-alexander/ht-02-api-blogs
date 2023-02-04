import { Request, Response } from "express";
import { constants } from "http2";
import { postsService } from "../services/posts.service";
import { PaginationAndSortQueryParams } from "../../@types";
import { CommentInputModel, PostInputModel } from "../request/requestTypes";
import { PostViewModel } from "../response/responseTypes";
import { postsWriteRepository } from "../../data-layer/repositories/posts/posts.write.repository";

export const getPostsHandler = async (req: Request<{}, {}, {}, PaginationAndSortQueryParams>, res: Response) => {
  const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
  const data = await postsService.getAllPosts({ sortBy, sortDirection, pageNumber, pageSize });

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const getPostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const data = await postsService.getPostById(req.params.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const createPostHandler = async (req: Request<{}, {}, PostViewModel>, res: Response) => {
  const data = await postsService.createPost(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const updatePostByIdHandler = async (req: Request<{ id: string }, {}, PostInputModel>, res: Response) => {
  const isUpdated = await postsWriteRepository.updatePostById(req.params.id, req.body);

  res.sendStatus(isUpdated ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
};

export const deletePostHandler = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await postsWriteRepository.deletePost(req.params.id);

  res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
};

export const createCommentByCurrentPost = async (
  req: Request<{ id: string }, {}, CommentInputModel>,
  res: Response
) => {
  const data = await postsService.createCommentByCurrentPost(req.params.id, req.body, req.user.loginOrEmail);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const getAllCommentsForPostHandler = async (
  req: Request<{ id: string }, {}, {}, PaginationAndSortQueryParams>,
  res: Response
) => {
  const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
  const data = await postsService.getAllCommentsForPost({
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
};
