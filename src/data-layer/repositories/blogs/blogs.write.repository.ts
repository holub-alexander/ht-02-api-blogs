import { BlogInputModel } from "../../../service-layer/request/requestTypes";
import { BlogViewModel } from "../../../service-layer/response/responseTypes";
import { blogsCollection } from "../../adapters/mongoDB";
import { ObjectId, WithId } from "mongodb";
import { blogsQueryRepository } from "./blogs.query.repository";

export const blogsWriteRepository = {
  createBlog: async (body: BlogInputModel): Promise<WithId<BlogViewModel> | null> => {
    const data = await blogsCollection.insertOne({ ...body, createdAt: new Date().toISOString() }, {});

    if (data.acknowledged) {
      return blogsQueryRepository.getBlogById<BlogViewModel>(data.insertedId.toString());
    }

    return null;
  },

  deleteBlog: async (blogId: string): Promise<boolean> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      return res.deletedCount > 0;
    }

    return false;
  },

  updateBlogById: async (blogId: string, data: BlogInputModel): Promise<boolean> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  },

  deleteAllBlogs: async (): Promise<boolean> => {
    const res = await blogsCollection.deleteMany({});
    return res.deletedCount > 0;
  },
};
