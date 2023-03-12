import { WithId } from "mongodb";
import { PostViewModel } from "../../service-layer/response/response-types";

export const postsMapper = {
  mapPostsViewModel: (data: WithId<PostViewModel>[]): PostViewModel[] =>
    data.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    })),

  mapPostViewModel: (data: WithId<PostViewModel>): PostViewModel => ({
    id: data._id.toString(),
    title: data.title,
    shortDescription: data.shortDescription,
    content: data.content,
    blogId: data.blogId,
    blogName: data.blogName,
    createdAt: data.createdAt,
  }),
};
