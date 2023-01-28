import { ObjectId, WithId } from "mongodb";
import { BlogsQueryParams } from "../../../service-layer/controllers/blogs.controller";
import { Paginator, SortDirections } from "../../../@types";
import { getObjectToSort } from "../../../utils/common/getObjectToSort";
import { blogsCollection } from "../../adapters/mongoDB";

export const blogsQueryRepository = {
  getAllBlogs: async <T>({
    sortBy = "createdAt",
    sortDirection = SortDirections.DESC,
    searchNameTerm = "",
    pageSize = 10,
    pageNumber = 1,
  }: BlogsQueryParams): Promise<Paginator<WithId<T>[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = { name: { $regex: searchNameTerm, $options: "i" } };

    const totalCount = await blogsCollection.countDocuments(filter);
    const res = await blogsCollection
      .find<WithId<T>>(filter)
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res,
    };
  },

  getBlogById: async <T>(blogId: string): Promise<WithId<T> | null> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const blog = await blogsCollection.findOne<WithId<T>>({ _id: new ObjectId(blogId) });

      if (blog) {
        return blog;
      }
    }

    return null;
  },
};
