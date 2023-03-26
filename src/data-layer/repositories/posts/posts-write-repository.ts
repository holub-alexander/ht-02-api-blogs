import { PostInputModel } from "../../../service-layer/request/request-types";
import { BlogsService } from "../../../service-layer/services/blogs-service";
import { BlogsQueryRepository } from "../blogs/blogs-query-repository";
import { PostsQueryRepository } from "./posts-query-repository";
import { HydratedDocument } from "mongoose";
import { PostDBType } from "../../../@types";
import { PostModel } from "../../models/post-model";
import { ObjectId } from "mongodb";

export class PostsWriteRepository {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsService: BlogsService
  ) {}

  async createPost(body: PostInputModel): Promise<PostDBType | null> {
    const findBlog = await this.blogsQueryRepository.getBlogById(body.blogId);

    if (findBlog) {
      const doc: HydratedDocument<PostDBType> = new PostModel<Omit<PostDBType, "_id">>({
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        createdAt: new Date().toISOString(),
        blog: {
          id: new ObjectId(findBlog._id),
          name: findBlog.name,
        },
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
        },
      });

      return await doc.save();
    }

    return null;
  }

  async deletePost(postId: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const res = await PostModel.deleteOne({ _id: new ObjectId(postId) });
      return res.deletedCount > 0;
    }

    return false;
  }

  async updatePostById(postId: string, data: PostInputModel): Promise<boolean> {
    const isValidId = ObjectId.isValid(postId);
    const findBlog = await this.blogsService.getBlogById(data.blogId);

    if (isValidId && findBlog) {
      const res = await PostModel.updateOne({ _id: postId }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  }

  async deleteAllPosts(): Promise<boolean> {
    const res = await PostModel.deleteMany({});
    return res.deletedCount > 0;
  }

  async likePostById(_id: ObjectId, isInc: boolean) {
    return PostModel.updateOne({ _id }, { $inc: { "likesInfo.likesCount": isInc ? 1 : -1 } });
  }

  async dislikePostById(_id: ObjectId, isInc: boolean) {
    return PostModel.updateOne({ _id }, { $inc: { "likesInfo.dislikesCount": isInc ? 1 : -1 } });
  }
}
