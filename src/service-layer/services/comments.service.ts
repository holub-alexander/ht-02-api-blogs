import { commentsQueryRepository } from "../../data-layer/repositories/comments/comments.query.repository";
import { commentMapper } from "../../business-layer/mappers/comment.mapper";

export const commentsService = {
  getCommentById: async (commentId: string) => {
    const data = await commentsQueryRepository.getCommentById(commentId);

    return data ? commentMapper.mapCommentViewModel(data) : null;
  },
};
