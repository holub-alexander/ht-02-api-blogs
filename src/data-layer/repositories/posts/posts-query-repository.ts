import { PaginationAndSortQueryParams, Paginator, PostDBType, SortDirections } from "../../../@types";
import { ObjectId, WithId } from "mongodb";
import { getObjectToSort } from "../../../utils/common/get-object-to-sort";
import { postsCollection } from "../../adapters/mongo-db";
import { PostViewModel } from "../../../service-layer/response/response-types";
import { PostModel } from "../../models/post-model";
import { HydratedDocument } from "mongoose";

export class PostsQueryRepository {
  async getAllPosts({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
  }): Promise<Paginator<PostDBType[]>> {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;

    const totalCount = await PostModel.countDocuments({});
    const res = await PostModel.find<PostDBType>()
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res,
    };
  }

  async getAllPostsByBlogId({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    id,
  }: PaginationAndSortQueryParams & { id: string }): Promise<Paginator<PostDBType[]>> {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const totalCount = await PostModel.find({ "blog.id": id }).countDocuments({});
    const res = await PostModel.find<PostDBType>({ "blog.id": id })
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res,
    };
  }

  async getPostById(postId: string): Promise<PostDBType | null> {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const data: PostDBType | null = await PostModel.findById(new ObjectId(postId));

      if (data) {
        return data;
      }
    }

    return null;
  }
}
