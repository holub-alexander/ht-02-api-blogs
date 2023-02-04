import { commentsCollection } from "../../adapters/mongoDB";
import { ObjectId, WithId } from "mongodb";
import { CommentViewModel } from "../../../service-layer/response/responseTypes";
import { PaginationAndSortQueryParams, Paginator, SortDirections } from "../../../@types";
import { getObjectToSort } from "../../../utils/common/getObjectToSort";

export const commentsQueryRepository = {
  getCommentById: async (commentId: string) => {
    const isValidId = ObjectId.isValid(commentId);

    if (isValidId) {
      return await commentsCollection.findOne<WithId<CommentViewModel>>({ _id: new ObjectId(commentId) });
    }

    return null;
  },

  getAllCommentsForPost: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    postId,
  }: PaginationAndSortQueryParams & { postId: string }): Promise<Paginator<WithId<CommentViewModel>[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = { postId: new ObjectId(postId) };

    const totalCount = await commentsCollection.countDocuments(filter);
    const res = await commentsCollection
      .find<WithId<CommentViewModel>>(filter)
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
};
