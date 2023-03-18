import { BlogInputModel } from "../../../service-layer/request/request-types";
import { ObjectId } from "mongodb";
import { BlogsQueryRepository } from "./blogs-query-repository";
import { BlogModel } from "../../models/blog-model";
import { HydratedDocument } from "mongoose";
import { BlogDBType } from "../../../@types";

export class BlogsWriteRepository {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

  public async createBlog(body: BlogInputModel): Promise<HydratedDocument<BlogDBType>> {
    const doc: HydratedDocument<BlogDBType> = new BlogModel({
      ...body,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
    const data = await doc.save();

    return data || null;
  }

  public async deleteBlog(blogId: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await BlogModel.deleteOne({ _id: new ObjectId(blogId) });
      return res.deletedCount > 0;
    }

    return false;
  }

  public async updateBlogById(blogId: string, data: BlogInputModel): Promise<boolean> {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await BlogModel.updateOne({ _id: new ObjectId(blogId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  }

  public async deleteAllBlogs(): Promise<boolean> {
    const res = await BlogModel.deleteMany({});
    return res.deletedCount > 0;
  }
}
