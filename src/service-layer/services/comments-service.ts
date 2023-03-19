import { CommentMapper } from "../../business-layer/mappers/comment-mapper";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";
import { CommentViewModel } from "../response/response-types";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";
import { ReactionsQueryRepository } from "../../data-layer/repositories/reactions/reactions-query-repository";
import { ObjectId } from "mongodb";
import { ReactionsWriteRepository } from "../../data-layer/repositories/reactions/reactions-write-repository";
import { LikeStatuses, ReactionDBType, UserAccountDBType } from "../../@types";
import { ReactionModel } from "../../data-layer/models/reaction-model";
import { CommentsWriteRepository } from "../../data-layer/repositories/comments/comments-write-repository";

export class CommentsService {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsWriteRepository: CommentsWriteRepository,
    private usersQueryRepository: UsersQueryRepository,
    private reactionsQueryRepository: ReactionsQueryRepository,
    private reactionsWriteRepository: ReactionsWriteRepository
  ) {}

  async getCommentById(commentId: string, userLogin: string | null): Promise<CommentViewModel | null> {
    const comment = await this.commentsQueryRepository.getCommentById(commentId);

    if (!comment) {
      return null;
    }

    if (userLogin) {
      const user = await this.usersQueryRepository.getUserByLogin(userLogin);
      const reaction = await this.reactionsQueryRepository.getReactionByCommentId(comment._id, user!._id);

      return CommentMapper.mapCommentViewModel(comment, reaction);
    }

    return CommentMapper.mapCommentViewModel(comment, null);
  }

  async incrementDecrementLikeCounter(
    commentId: ObjectId,
    userReactionType: LikeStatuses | null,
    likeStatus: LikeStatuses
  ) {
    if (likeStatus === LikeStatuses.NONE && userReactionType !== LikeStatuses.NONE) {
      if (userReactionType === LikeStatuses.LIKE) {
        return this.commentsWriteRepository.likeCommentById(commentId, false);
      }

      return this.commentsWriteRepository.dislikeCommentById(commentId, false);
    }

    if (userReactionType === likeStatus) {
      return;
    }

    if (likeStatus === LikeStatuses.LIKE && userReactionType === LikeStatuses.DISLIKE) {
      await this.commentsWriteRepository.dislikeCommentById(commentId, false);
      return this.commentsWriteRepository.likeCommentById(commentId, true);
    }

    if (likeStatus === LikeStatuses.DISLIKE && userReactionType === LikeStatuses.LIKE) {
      await this.commentsWriteRepository.likeCommentById(commentId, false);
      return this.commentsWriteRepository.dislikeCommentById(commentId, true);
    }

    if (likeStatus === LikeStatuses.LIKE) {
      return this.commentsWriteRepository.likeCommentById(commentId, true);
    }

    if (likeStatus === LikeStatuses.DISLIKE) {
      return this.commentsWriteRepository.dislikeCommentById(commentId, true);
    }
  }

  async setLikeUnlikeForComment(
    commentId: string,
    login: string,
    likeStatus: LikeStatuses
  ): Promise<ReactionDBType | null> {
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    const user = await this.usersQueryRepository.getUserByLogin(login);

    if (!comment || !user) {
      return null;
    }

    const reaction = await this.reactionsQueryRepository.getReactionByCommentId(comment._id, user._id);

    if (!reaction && likeStatus === LikeStatuses.NONE) {
      return null;
    }

    if (reaction) {
      await this.incrementDecrementLikeCounter(comment._id, reaction.likeStatus, likeStatus);
      const res = await this.reactionsWriteRepository.updateLikeStatusForComment(reaction._id, likeStatus);

      if (res) {
        return reaction;
      }

      return null;
    }

    const reactionDTO = new ReactionModel({
      _id: new ObjectId(),
      user: {
        id: user._id,
      },
      comment: {
        id: comment._id,
      },
      likeStatus,
    });

    await this.incrementDecrementLikeCounter(comment._id, null, likeStatus);
    await this.reactionsWriteRepository.createReactionForComment(reactionDTO);

    return reactionDTO;
  }
}
