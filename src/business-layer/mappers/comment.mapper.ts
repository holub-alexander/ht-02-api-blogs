import { WithId } from "mongodb";
import { CommentViewModel } from "../../service-layer/response/responseTypes";

export const commentMapper = {
  mapCommentsViewModel: (data: WithId<CommentViewModel>[]): CommentViewModel[] =>
    data.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    })),

  mapCommentViewModel: (comment: WithId<CommentViewModel>): CommentViewModel => {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    };
  },
};
