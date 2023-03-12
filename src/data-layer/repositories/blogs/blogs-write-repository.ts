import { BlogInputModel } from "../../../service-layer/request/request-types";
import { BlogViewModel } from "../../../service-layer/response/response-types";
import { blogsCollection } from "../../adapters/mongo-db";
import { ObjectId, WithId } from "mongodb";
import { BlogsQueryRepository } from "./blogs-query-repository";

export class BlogsWriteRepository {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

  public async createBlog(body: BlogInputModel): Promise<WithId<BlogViewModel> | null> {
    const data = await blogsCollection.insertOne(
      { ...body, createdAt: new Date().toISOString(), isMembership: false },
      {}
    );

    if (data.acknowledged) {
      return this.blogsQueryRepository.getBlogById<BlogViewModel>(data.insertedId.toString());
    }

    return null;
  }

  public async deleteBlog(blogId: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      return res.deletedCount > 0;
    }

    return false;
  }

  public async updateBlogById(blogId: string, data: BlogInputModel): Promise<boolean> {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  }

  public async deleteAllBlogs(): Promise<boolean> {
    const res = await blogsCollection.deleteMany({});
    return res.deletedCount > 0;
  }
}
