import { MeViewModel } from "../../service-layer/response/responseTypes";
import { WithId } from "mongodb";
import { UserAccountDBType } from "../../@types";

export const authMapper = {
  mapMeViewModel: (data: WithId<UserAccountDBType>): MeViewModel => ({
    email: data.accountData.email,
    login: data.accountData.login,
    userId: data._id.toString(),
  }),
};
