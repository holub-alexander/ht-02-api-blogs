import { PostInputModel, PostViewModel } from "../@types";
import { postsCollection } from "../utils/common/connectDB";
import { ObjectId, WithId } from "mongodb";
import { blogsService } from "./blogs.service";

export const postsService = {
  getAllPosts: async (): Promise<PostViewModel[]> => {
    const res = await postsCollection.find<WithId<PostViewModel>>({}).toArray();
    return res.map((post) => {
      post.id = post._id.toString();
      /* @ts-ignore */
      delete post._id;

      return post;
    });
  },

  getPostById: async (postId: string): Promise<PostViewModel | null> => {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const data = await postsCollection.findOne<PostViewModel & { _id: string }>({ _id: new ObjectId(postId) });

      if (data) {
        data.id = data._id.toString();
        /* @ts-ignore */
        delete data?._id;

        return data;
      }
    }

    return null;
  },

  createPost: async (body: PostInputModel): Promise<PostViewModel | null> => {
    const findBlog = await blogsService.getBlogById(body.blogId);

    if (findBlog) {
      const data = await postsCollection.insertOne({ ...body, createdAt: new Date().toISOString() }, {});

      if (data.acknowledged) {
        return postsService.getPostById(data.insertedId.toString());
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

  updatePostById: async (postId: string, data: Omit<PostInputModel, "blogId">): Promise<boolean> => {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
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
