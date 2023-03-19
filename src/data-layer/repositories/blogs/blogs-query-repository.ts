import { ObjectId } from "mongodb";
import { BlogsQueryParams } from "../../../service-layer/controllers/blogs-controller";
import { BlogDBType, Paginator, SortDirections } from "../../../@types";
import { getObjectToSort } from "../../../utils/common/get-object-to-sort";
import { BlogModel } from "../../models/blog-model";

export class BlogsQueryRepository {
  public async getAllBlogs({
    sortBy = "createdAt",
    sortDirection = SortDirections.DESC,
    searchNameTerm = "",
    pageSize = 10,
    pageNumber = 1,
  }: // @ts-ignore
  BlogsQueryParams): Promise<Paginator<BlogDBType[]>> {
    console.log("=== START REPO ===");
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = { name: { $regex: searchNameTerm, $options: "i" } };

    try {
      const totalCount = await BlogModel.countDocuments(filter);
      console.log("=== START REPO 2 ===");
      const res = await BlogModel.find<BlogDBType>(filter)
        .skip((+pageNumber - 1) * +pageSizeValue)
        .limit(+pageSizeValue)
        .sort(sorting);

      console.log("=== FINISH REPO ===");

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount,
        items: res,
      };
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  public async getBlogById(blogId: string): Promise<BlogDBType | null> {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const blog = await BlogModel.findById<BlogDBType>(new ObjectId(blogId));

      if (blog) {
        return blog;
      }
    }

    return null;
  }
}
