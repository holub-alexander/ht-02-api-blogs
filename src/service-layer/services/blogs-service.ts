import { Paginator, SortDirections } from "../../@types";
import { BlogsQueryParams } from "../controllers/blogs-controller";
import { BlogViewModel } from "../response/response-types";
import { BlogsQueryRepository } from "../../data-layer/repositories/blogs/blogs-query-repository";
import { blogsMapper } from "../../business-layer/mappers/blogs-mapper";
import { BlogInputModel } from "../request/request-types";
import { BlogsWriteRepository } from "../../data-layer/repositories/blogs/blogs-write-repository";

export class BlogsService {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsWriteRepository: BlogsWriteRepository
  ) {}

  public async getAllBlogs({
    sortBy = "createdAt",
    sortDirection = SortDirections.DESC,
    searchNameTerm = "",
    pageSize = 10,
    pageNumber = 1,
  }: BlogsQueryParams): Promise<Paginator<BlogViewModel[]>> {
    const res = await this.blogsQueryRepository.getAllBlogs<BlogViewModel>({
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchNameTerm,
    });

    return {
      ...res,
      items: blogsMapper.mapBlogsViewModel(res.items),
    };
  }

  public async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.blogsQueryRepository.getBlogById<BlogViewModel>(blogId);

    return blog ? blogsMapper.mapBlogViewModel(blog) : null;
  }

  public async createBlog(body: BlogInputModel): Promise<BlogViewModel | null> {
    const newBlog = await this.blogsWriteRepository.createBlog(body);

    return newBlog ? blogsMapper.mapBlogViewModel(newBlog) : null;
  }
}
