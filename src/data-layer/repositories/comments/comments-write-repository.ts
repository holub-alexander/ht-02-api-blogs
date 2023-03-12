import { CommentInputModel } from "../../../service-layer/request/request-types";
import { ObjectId, WithId } from "mongodb";
import { CommentViewModel } from "../../../service-layer/response/response-types";
import { commentsCollection, postsCollection } from "../../adapters/mongo-db";
import { CommentsQueryRepository } from "./comments-query-repository";
import { UserAccountDBType } from "../../../@types";

export class CommentsWriteRepository {
  constructor(protected commentsQueryRepository: CommentsQueryRepository) {}

  async createComment(body: CommentInputModel, user: WithId<UserAccountDBType>, postId: ObjectId) {
    const data = await commentsCollection.insertOne({
      postId,
      content: body.content,
      commentatorInfo: { userId: user._id.toString(), userLogin: user.accountData.login },
      createdAt: new Date().toISOString(),
    });

    return data.acknowledged ? data : null;
  }

  async createCommentByCurrentPost(
    postId: string,
    body: CommentInputModel,
    user: WithId<UserAccountDBType>
  ): Promise<WithId<CommentViewModel> | null> {
    const isValidId = ObjectId.isValid(postId);

    if (!isValidId) {
      return null;
    }

    const createdComment = await this.createComment(body, user, new ObjectId(postId));
    const addCommentToCurrentPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: createdComment?.insertedId } }
    );

    if (createdComment && addCommentToCurrentPost.modifiedCount > 0) {
      return await this.commentsQueryRepository.getCommentById(createdComment.insertedId.toString());
    }

    return null;
  }

  async deleteCommentById(id: string) {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return null;
    }

    const res = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount > 0 ? res : null;
  }

  async updateCommentById(id: string, body: CommentInputModel) {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return null;
    }

    console.log(isValidId, id);

    const res = await commentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });
    return res.modifiedCount > 0;
  }
}
