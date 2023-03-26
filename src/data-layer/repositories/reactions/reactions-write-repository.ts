import { LikeStatuses, ReactionDBType } from "../../../@types";
import { ReactionModel } from "../../models/reaction-model";
import { ObjectId } from "mongodb";

export class ReactionsWriteRepository {
  async createReaction(reaction: ReactionDBType) {
    return ReactionModel.insertMany(reaction);
  }

  async updateLikeStatus(reactionId: ObjectId, likeStatus: LikeStatuses): Promise<boolean> {
    await ReactionModel.updateOne({ _id: reactionId }, { likeStatus });
    return true;
  }
}
