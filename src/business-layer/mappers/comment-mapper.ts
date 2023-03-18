import { CommentViewModel } from "../../service-layer/response/response-types";
import { CommentDBType, LikeStatuses } from "../../@types";

export class CommentMapper {
  public static mapCommentsViewModel(data: CommentDBType[]): CommentViewModel[] {
    return data.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.id.toString(),
        userLogin: comment.commentatorInfo.login,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: LikeStatuses.NONE,
      },
    }));
  }

  public static mapCommentViewModel(comment: CommentDBType): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.id.toString(),
        userLogin: comment.commentatorInfo.login,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: LikeStatuses.NONE,
      },
    };
  }
}
