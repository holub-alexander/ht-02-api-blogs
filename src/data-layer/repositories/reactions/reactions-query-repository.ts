import { ObjectId } from "mongodb";
import { ReactionModel } from "../../models/reaction-model";
import { ReactionDBType } from "../../../@types";
import { HydratedDocument } from "mongoose";

export class ReactionsQueryRepository {
  public async getReactionByCommentId(commentId: ObjectId, userId: ObjectId): Promise<ReactionDBType | null> {
    return ReactionModel.findOne<ReactionDBType>({ commentId, "user.id": userId });
  }

  public async getReactionByPostId(postId: ObjectId, userId: ObjectId): Promise<ReactionDBType | null> {
    return ReactionModel.findOne<ReactionDBType>({ postId, "user.id": userId });
  }

  public async getReactionCommentsByIds(commentsIds: ObjectId[], userId: ObjectId): Promise<ReactionDBType[]> {
    return ReactionModel.find<ReactionDBType>({ "user.id": userId, "comment.id": { $in: commentsIds } });
  }

  public async getReactionPostsByIds(postsIds: ObjectId[], userId: ObjectId): Promise<ReactionDBType[]> {
    return ReactionModel.find<ReactionDBType>({ "user.id": userId, postId: { $in: postsIds } });
  }

  public async getLatestReactionsForPost(
    postId: ObjectId,
    limit: number,
    userId: ObjectId | null
  ): Promise<HydratedDocument<ReactionDBType>[]> {
    return ReactionModel.find({ postId, "user.id": { $ne: userId } })
      .sort({ createdAt: "desc" })
      .limit(limit);
  }
}
