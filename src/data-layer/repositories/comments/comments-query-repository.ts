import { ObjectId } from "mongodb";
import { CommentDBType, PaginationAndSortQueryParams, Paginator, SortDirections } from "../../../@types";
import { getObjectToSort } from "../../../utils/common/get-object-to-sort";
import { CommentModel } from "../../models/comment-model";
import mongoose from "mongoose";

export class CommentsQueryRepository {
  async getCommentById(commentId: string): Promise<CommentDBType | null> {
    const isValidId = ObjectId.isValid(commentId);

    if (isValidId) {
      return CommentModel.findById<CommentDBType>(new ObjectId(commentId));
    }

    return null;
  }

  async getAllCommentsForPost({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    postId,
  }: PaginationAndSortQueryParams & { postId: string }): Promise<Paginator<CommentDBType[]>> {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = { postId: new mongoose.Types.ObjectId(postId) };

    const totalCount = await CommentModel.countDocuments(filter);
    const res = await CommentModel.find<CommentDBType>(filter)
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
}
