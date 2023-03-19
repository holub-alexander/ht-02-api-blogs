import { CommentsService } from "../services/comments-service";
import { Request, Response } from "express";
import { constants } from "http2";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";
import { CommentsWriteRepository } from "../../data-layer/repositories/comments/comments-write-repository";
import { CommentInputModel, LikeInputModel } from "../request/request-types";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";

export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsWriteRepository: CommentsWriteRepository,
    private commentsService: CommentsService,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  async getCommentByIdHandler(req: Request<{ id: string }>, res: Response) {
    const data = await this.commentsService.getCommentById(req.params.id, req.user?.login ?? null);

    if (data) {
      return res.status(constants.HTTP_STATUS_OK).send(data);
    }

    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  async deleteCommentByIdHandler(req: Request<{ id: string }>, res: Response) {
    const user = await this.usersQueryRepository.getUserByLogin(req.user.login);
    const comment = await this.commentsQueryRepository.getCommentById(req.params.id);

    if (!user || !comment) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    if (user.accountData.login !== comment.commentatorInfo.login) {
      return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
    }

    const deleteComment = await this.commentsWriteRepository.deleteCommentById(req.params.id);

    return deleteComment
      ? res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
      : res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  async updateCommentByIdHandler(req: Request<{ id: string }, {}, CommentInputModel>, res: Response) {
    const comment = await this.commentsQueryRepository.getCommentById(req.params.id);
    const user = await this.usersQueryRepository.getUserByLogin(req.user.login);

    if (!user || !comment) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    if (user.accountData.login !== comment.commentatorInfo.login) {
      return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
    }

    const isUpdated = await this.commentsWriteRepository.updateCommentById(req.params.id, req.body);

    return res.sendStatus(isUpdated ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }

  async setLikeUnlikeForCommentHandler(req: Request<{ id: string }, {}, LikeInputModel>, res: Response) {
    const isUpdated = await this.commentsService.setLikeUnlikeForComment(
      req.params.id,
      req.user.login,
      req.body.likeStatus
    );

    return res.sendStatus(isUpdated ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }
}
