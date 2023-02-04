import { WithId } from "mongodb";
import { BlogViewModel } from "../../service-layer/response/responseTypes";

export const blogsMapper = {
  mapBlogsViewModel: (data: WithId<BlogViewModel>[]): BlogViewModel[] =>
    data.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),

  mapBlogViewModel: (blog: WithId<BlogViewModel>): BlogViewModel => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }),
};
