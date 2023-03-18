import { CommentInputModel } from "../../../service-layer/request/request-types";
import { ObjectId } from "mongodb";
import { CommentsQueryRepository } from "./comments-query-repository";
import { CommentDBType } from "../../../@types";
import { CommentModel } from "../../models/comment-model";
import { HydratedDocument } from "mongoose";

export class CommentsWriteRepository {
  constructor(protected commentsQueryRepository: CommentsQueryRepository) {}

  async createCommentByCurrentPost(
    postId: string,
    newComment: HydratedDocument<CommentDBType>
  ): Promise<CommentDBType | null> {
    const isValidId = ObjectId.isValid(postId);

    if (!isValidId) {
      return null;
    }

    await newComment.save();

    return await this.commentsQueryRepository.getCommentById(newComment._id.toString());
  }

  async deleteCommentById(id: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return false;
    }

    const res = await CommentModel.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount > 0;
  }

  async updateCommentById(id: string, body: CommentInputModel): Promise<boolean> {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return false;
    }

    const res = await CommentModel.updateOne({ _id: new ObjectId(id) }, { $set: body });
    return res.modifiedCount > 0;
  }
}
