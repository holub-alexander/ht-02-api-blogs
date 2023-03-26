import { CommentViewModel } from "../../service-layer/response/response-types";
import { CommentDBType, LikeStatuses, ReactionDBType } from "../../@types";

export class CommentMapper {
  public static mapCommentsViewModel(
    comments: CommentDBType[],
    reactions: ReactionDBType[] | null
  ): CommentViewModel[] {
    const getResult = (comment: CommentDBType, likeStatus: LikeStatuses | null) => {
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
          myStatus: likeStatus || LikeStatuses.NONE,
        },
      };
    };

    return comments.map((comment) => {
      if (!reactions) {
        return getResult(comment, null);
      }

      const foundReactionIndex = reactions.findIndex(
        (reaction) => reaction.commentId!.toString() === comment._id.toString()
      );

      if (foundReactionIndex > -1) {
        return getResult(comment, reactions[foundReactionIndex].likeStatus);
      }

      return getResult(comment, null);
    });
  }

  public static mapCommentViewModel(comment: CommentDBType, reaction: ReactionDBType | null): CommentViewModel {
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
        myStatus: reaction ? reaction.likeStatus : LikeStatuses.NONE,
      },
    };
  }
}
