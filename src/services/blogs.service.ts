import { BlogInputModel, BlogViewModel } from "../@types";
import { blogsCollection } from "../utils/common/connectDB";
import { ObjectId, WithId } from "mongodb";

export const blogsService = {
  getAllBlogs: async (): Promise<BlogViewModel[]> => {
    const res = await blogsCollection.find<WithId<BlogViewModel>>({}).toArray();
    return res.map((blog) => {
      blog.id = blog._id.toString();
      /* @ts-ignore */
      delete blog._id;

      return blog;
    });
  },

  getBlogById: async (blogId: string): Promise<BlogViewModel | null> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const data = await blogsCollection.findOne<BlogViewModel & { _id: string }>({ _id: new ObjectId(blogId) });

      if (data) {
        data.id = data._id.toString();
        /* @ts-ignore */
        delete data?._id;

        return data;
      }
    }

    return null;
  },

  createBlog: async (body: BlogInputModel): Promise<BlogViewModel | null> => {
    const data = await blogsCollection.insertOne({ ...body, createdAt: new Date().toISOString() }, {});

    if (data.acknowledged) {
      return blogsService.getBlogById(data.insertedId.toString());
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
