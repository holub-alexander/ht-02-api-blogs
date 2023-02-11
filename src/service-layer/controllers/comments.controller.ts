import { commentsService } from "../services/comments.service";
import { Request, Response } from "express";
import { constants } from "http2";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import { commentsQueryRepository } from "../../data-layer/repositories/comments/comments.query.repository";
import { commentsWriteRepository } from "../../data-layer/repositories/comments/comments.write.repository";
import { CommentInputModel } from "../request/requestTypes";

export const getCommentByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const data = await commentsService.getCommentById(req.params.id);

  if (data) {
    return res.status(constants.HTTP_STATUS_OK).send(data);
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const deleteCommentByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const user = await usersQueryRepository.getUserByLoginOrEmail(req.user.loginOrEmail);
  const comment = await commentsQueryRepository.getCommentById(req.params.id);

  if (!user || !comment) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  if (user.accountData.login !== comment.commentatorInfo.userLogin) {
    return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
  }

  const deleteComment = await commentsWriteRepository.deleteCommentById(req.params.id);

  return deleteComment
    ? res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    : res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
};

export const updateCommentByIdHandler = async (req: Request<{ id: string }, {}, CommentInputModel>, res: Response) => {
  const comment = await commentsQueryRepository.getCommentById(req.params.id);
  const user = await usersQueryRepository.getUserByLoginOrEmail(req.user.loginOrEmail);

  console.log(comment, user);

  if (!user || !comment) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  if (user.accountData.login !== comment.commentatorInfo.userLogin) {
    return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
  }

  const isUpdated = await commentsWriteRepository.updateCommentById(req.params.id, req.body);

  return res.sendStatus(isUpdated ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
};
