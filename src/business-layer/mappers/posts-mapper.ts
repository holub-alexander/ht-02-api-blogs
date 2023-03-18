import { WithId } from "mongodb";
import { PostViewModel } from "../../service-layer/response/response-types";
import { PostDBType } from "../../@types";

export class PostsMapper {
  public static mapPostsViewModel(data: WithId<PostDBType>[]): PostViewModel[] {
    return data.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog.id.toString(),
      blogName: post.blog.name,
      createdAt: post.createdAt,
    }));
  }

  public static mapPostViewModel(data: WithId<PostDBType>): PostViewModel {
    return {
      id: data._id.toString(),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blog.id.toString(),
      blogName: data.blog.name,
      createdAt: data.createdAt,
    };
  }
}
