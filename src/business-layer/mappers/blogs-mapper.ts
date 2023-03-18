import { BlogViewModel } from "../../service-layer/response/response-types";
import { BlogDBType } from "../../@types";

export class BlogsMapper {
  public static mapBlogsViewModel(data: BlogDBType[]): BlogViewModel[] {
    return data.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }));
  }

  public static mapBlogViewModel(blog: BlogDBType): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
