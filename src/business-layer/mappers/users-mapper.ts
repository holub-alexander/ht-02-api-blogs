import { WithId } from "mongodb";
import { UserViewModel } from "../../service-layer/response/response-types";
import { UserAccountDBType } from "../../@types";

export class UsersMapper {
  public static mapUsersViewModel(data: WithId<UserAccountDBType>[]): UserViewModel[] {
    return data.map((user) => ({
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    }));
  }

  public static mapCreatedUserViewModel(user: WithId<UserAccountDBType>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }
}
