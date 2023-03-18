import { MeViewModel } from "../../service-layer/response/response-types";
import { WithId } from "mongodb";
import { UserAccountDBType } from "../../@types";

export class AuthMapper {
  public static mapMeViewModel(data: WithId<UserAccountDBType>): MeViewModel {
    return {
      email: data.accountData.email,
      login: data.accountData.login,
      userId: data._id.toString(),
    };
  }
}
