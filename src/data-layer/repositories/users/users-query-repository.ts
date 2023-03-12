import { Paginator, SortDirections, UserAccountDBType } from "../../../@types";
import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../adapters/mongo-db";
import { getObjectToSort } from "../../../utils/common/get-object-to-sort";

export class UsersQueryRepository {
  async getAllUsers<T>({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    searchLoginTerm = "",
    searchEmailTerm = "",
  }): Promise<Paginator<WithId<T>[]>> {
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
  }

  async getUserById<T>(userId: string): Promise<WithId<T> | null> {
    const isValidId = ObjectId.isValid(userId);

    if (isValidId) {
      const findUser = await usersCollection.findOne<WithId<T>>({ _id: new ObjectId(userId) });

      if (findUser) {
        return findUser;
      }
    }

    return null;
  }

  async getUserByLoginOrEmailOnly(loginOrEmail: string): Promise<WithId<UserAccountDBType> | null> {
    const filter = {
      $or: [{ "accountData.login": { $regex: loginOrEmail } }, { "accountData.email": { $regex: loginOrEmail } }],
    };

    return await usersCollection.findOne<WithId<UserAccountDBType>>(filter);
  }

  async getUserByLogin(login: string): Promise<WithId<UserAccountDBType> | null> {
    return usersCollection.findOne<WithId<UserAccountDBType>>({ "accountData.login": login });
  }

  async getUserByEmail(email: string): Promise<WithId<UserAccountDBType> | null> {
    return usersCollection.findOne<WithId<UserAccountDBType>>({ "accountData.email": email });
  }

  async getUserByConfirmationCode(code: string): Promise<WithId<UserAccountDBType> | null> {
    return usersCollection.findOne<WithId<UserAccountDBType>>({ "emailConfirmation.confirmationCode": code });
  }

  async getUserByDeviceIdAndLogin(login: string, deviceId: string): Promise<WithId<UserAccountDBType> | null> {
    return usersCollection.findOne<WithId<UserAccountDBType>>({
      "accountData.login": login,
      "refreshTokensMeta.deviceId": deviceId,
    });
  }
}
