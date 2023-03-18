import { CommentMapper } from "../../business-layer/mappers/comment-mapper";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";
import { CommentViewModel } from "../response/response-types";

export class CommentsService {
  constructor(protected commentsQueryRepository: CommentsQueryRepository) {}

  async getCommentById(commentId: string): Promise<CommentViewModel | null> {
    const data = await this.commentsQueryRepository.getCommentById(commentId);

    return data ? CommentMapper.mapCommentViewModel(data) : null;
  }
}
