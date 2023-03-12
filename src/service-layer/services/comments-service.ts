import { commentMapper } from "../../business-layer/mappers/comment-mapper";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";

export class CommentsService {
  constructor(protected commentsQueryRepository: CommentsQueryRepository) {}

  async getCommentById(commentId: string) {
    const data = await this.commentsQueryRepository.getCommentById(commentId);

    return data ? commentMapper.mapCommentViewModel(data) : null;
  }
}
