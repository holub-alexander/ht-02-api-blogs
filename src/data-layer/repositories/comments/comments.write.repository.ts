import { CommentInputModel, UserInputModel } from "../../../service-layer/request/requestTypes";
import { ObjectId, WithId } from "mongodb";
import { CommentViewModel, UserViewModel } from "../../../service-layer/response/responseTypes";
import { commentsCollection, postsCollection } from "../../adapters/mongoDB";
import { commentsQueryRepository } from "./comments.query.repository";

export const commentsWriteRepository = {
  createComment: async (body: CommentInputModel, user: WithId<UserInputModel>, postId: ObjectId) => {
    const data = await commentsCollection.insertOne({
      postId,
      content: body.content,
      commentatorInfo: { userId: user._id.toString(), userLogin: user.login },
      createdAt: new Date().toISOString(),
    });

    return data.acknowledged ? data : null;
  },

  createCommentByCurrentPost: async (
    postId: string,
    body: CommentInputModel,
    user: WithId<UserInputModel>
  ): Promise<WithId<CommentViewModel> | null> => {
    const isValidId = ObjectId.isValid(postId);

    if (!isValidId) {
      return null;
    }

    const createdComment = await commentsWriteRepository.createComment(body, user, new ObjectId(postId));
    const addCommentToCurrentPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: createdComment?.insertedId } }
    );

    if (createdComment && addCommentToCurrentPost.modifiedCount > 0) {
      return await commentsQueryRepository.getCommentById(createdComment.insertedId.toString());
    }

    return null;
  },

  deleteCommentById: async (id: string) => {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return null;
    }

    const res = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount > 0 ? res : null;
  },

  updateCommentById: async (id: string, body: CommentInputModel) => {
    const isValidId = ObjectId.isValid(id);

    if (!isValidId) {
      return null;
    }

    console.log(isValidId, id);

    const res = await commentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });
    return res.modifiedCount > 0;
  },
};
