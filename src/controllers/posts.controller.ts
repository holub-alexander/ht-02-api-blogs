import { Request, Response } from "express";
import { constants } from "http2";
import { postsRepository } from "../repositories/posts-repository";
import { PostInputModel, PostViewModel } from "../@types";

export const getPostsHandler = (_: Request, res: Response) => {
  const data = postsRepository.getAllPosts();

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const getPostByIdHandler = (req: Request<{ id: string }>, res: Response) => {
  console.log(req.params.id);
  const data = postsRepository.getPostById(req.params.id);
  console.log(req.query.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const createPostHandler = (req: Request<{}, {}, PostViewModel>, res: Response) => {
  const data = postsRepository.createPost(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const updatePostByIdHandler = (req: Request<{ id: string }, {}, PostInputModel>, res: Response) => {
  const data = postsRepository.updatePostById(req.params.id, req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};

export const deletePostHandler = (req: Request<{ id: string }>, res: Response) => {
  const data = postsRepository.deletePost(req.params.id);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
