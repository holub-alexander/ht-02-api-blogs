import { LikeStatuses, ReactionDBType } from "../../../@types";
import { ReactionModel } from "../../models/reaction-model";
import { ObjectId } from "mongodb";

export class ReactionsWriteRepository {
  async createReactionForComment(reaction: ReactionDBType) {
    return ReactionModel.insertMany(reaction);
  }

  async updateLikeStatusForComment(reactionId: ObjectId, likeStatus: LikeStatuses): Promise<boolean> {
    const res = await ReactionModel.updateOne({ _id: reactionId }, { likeStatus });

    return true;
  }
}
