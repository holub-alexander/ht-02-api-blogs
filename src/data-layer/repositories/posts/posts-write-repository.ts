import { PostInputModel } from "../../../service-layer/request/request-types";
import { BlogViewModel, PostViewModel } from "../../../service-layer/response/response-types";
import { BlogsService } from "../../../service-layer/services/blogs-service";
import { postsCollection } from "../../adapters/mongo-db";
import { BlogsQueryRepository } from "../blogs/blogs-query-repository";
import { PostsQueryRepository } from "./posts-query-repository";
import { ObjectId, WithId } from "mongodb";

export class PostsWriteRepository {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsService: BlogsService
  ) {}

  async createPost(body: PostInputModel): Promise<WithId<PostViewModel> | null> {
    const findBlog = await this.blogsQueryRepository.getBlogById<BlogViewModel>(body.blogId);

    if (findBlog) {
      const data = await postsCollection.insertOne({
        ...body,
        blogName: findBlog.name,
        createdAt: new Date().toISOString(),
      });

      if (data.acknowledged) {
        return this.postsQueryRepository.getPostById<PostViewModel>(data.insertedId.toString());
      }
    }

    return null;
  }

  async deletePost(postId: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const res = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
      return res.deletedCount > 0;
    }

    return false;
  }

  async updatePostById(postId: string, data: PostInputModel): Promise<boolean> {
    const isValidId = ObjectId.isValid(postId);
    const findBlog = await this.blogsService.getBlogById(data.blogId);

    if (isValidId && findBlog) {
      const res = await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  }

  async deleteAllPosts(): Promise<boolean> {
    const res = await postsCollection.deleteMany({});
    return res.deletedCount > 0;
  }
}
