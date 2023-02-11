import { WithId } from "mongodb";
import { UserViewModel } from "../../service-layer/response/responseTypes";
import { UserAccountDBType } from "../../@types";

export const usersMapper = {
  mapUsersViewModel: (data: WithId<UserAccountDBType>[]): UserViewModel[] =>
    data.map((user) => ({
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    })),

  mapCreatedUserViewModel: (user: WithId<UserAccountDBType>): UserViewModel => ({
    id: user._id.toString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }),
};
