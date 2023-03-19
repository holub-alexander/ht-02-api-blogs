import { ObjectId } from "mongodb";
import { ReactionModel } from "../../models/reaction-model";
import { ReactionDBType } from "../../../@types";

export class ReactionsQueryRepository {
  async getReactionByCommentId(commentId: ObjectId, userId: ObjectId): Promise<ReactionDBType | null> {
    return ReactionModel.findOne<ReactionDBType>({ "comment.id": commentId, "user.id": userId });
  }

  async getReactionCommentsByIds(commentsIds: ObjectId[], userId: ObjectId): Promise<ReactionDBType[]> {
    return ReactionModel.find<ReactionDBType>({ "user.id": userId, "comment.id": { $in: commentsIds } });
  }
}
