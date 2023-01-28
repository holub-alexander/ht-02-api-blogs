import { PostInputModel } from "../../../service-layer/request/requestTypes";
import { BlogViewModel, PostViewModel } from "../../../service-layer/response/responseTypes";
import { blogsService } from "../../../service-layer/services/blogs.service";
import { postsCollection } from "../../adapters/mongoDB";
import { blogsQueryRepository } from "../blogs/blogs.query.repository";
import { postsQueryRepository } from "./posts.query.repository";
import { ObjectId, WithId } from "mongodb";

export const postsWriteRepository = {
  createPost: async (body: PostInputModel): Promise<WithId<PostViewModel> | null> => {
    const findBlog = await blogsQueryRepository.getBlogById<BlogViewModel>(body.blogId);

    if (findBlog) {
      const data = await postsCollection.insertOne({
        ...body,
        blogName: findBlog.name,
        createdAt: new Date().toISOString(),
      });

      if (data.acknowledged) {
        return postsQueryRepository.getPostById<PostViewModel>(data.insertedId.toString());
      }
    }

    return null;
  },

  deletePost: async (postId: string): Promise<boolean> => {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const res = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
      return res.deletedCount > 0;
    }

    return false;
  },

  updatePostById: async (postId: string, data: PostInputModel): Promise<boolean> => {
    const isValidId = ObjectId.isValid(postId);
    const findBlog = await blogsService.getBlogById(data.blogId);

    if (isValidId && findBlog) {
      const res = await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  },

  deleteAllPosts: async (): Promise<boolean> => {
    const res = await postsCollection.deleteMany({});
    return res.deletedCount > 0;
  },
};
