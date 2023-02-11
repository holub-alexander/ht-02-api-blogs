import { Paginator, SortDirections, UserAccountDBType } from "../../../@types";
import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../adapters/mongoDB";
import { getObjectToSort } from "../../../utils/common/getObjectToSort";
import { UserInputModel } from "../../../service-layer/request/requestTypes";
import { UserViewModel } from "../../../service-layer/response/responseTypes";

export const usersQueryRepository = {
  getAllUsers: async <T>({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    searchLoginTerm = "",
    searchEmailTerm = "",
  }): Promise<Paginator<WithId<T>[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = {
      $or: [
        { "accountData.login": { $regex: searchLoginTerm, $options: "i" } },
        { "accountData.email": { $regex: searchEmailTerm, $options: "i" } },
      ],
    };

    const totalCount = await usersCollection.countDocuments(filter);
    const res = await usersCollection
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

  getUserById: async <T>(userId: string): Promise<WithId<T> | null> => {
    const isValidId = ObjectId.isValid(userId);

    if (isValidId) {
      const findUser = await usersCollection.findOne<WithId<T>>({ _id: new ObjectId(userId) });

      if (findUser) {
        return findUser;
      }
    }

    return null;
  },

  getUserByLoginOrEmail: async (loginOrEmail: string): Promise<WithId<UserAccountDBType> | null> => {
    const filter = {
      $or: [{ "accountData.login": { $regex: loginOrEmail } }, { "accountData.email": { $regex: loginOrEmail } }],
    };

    return await usersCollection.findOne<WithId<UserAccountDBType>>(filter);
  },

  getUserByConfirmationCode: async (code: string): Promise<WithId<UserAccountDBType> | null> => {
    return await usersCollection.findOne<WithId<UserAccountDBType>>({ "emailConfirmation.confirmationCode": code });
  },
};
