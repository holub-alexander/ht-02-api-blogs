import { MeViewModel } from "../../service-layer/response/responseTypes";
import { WithId } from "mongodb";
import { UserInputModel } from "../../service-layer/request/requestTypes";

export const authMapper = {
  mapMeViewModel: (data: WithId<UserInputModel>): MeViewModel => ({
    email: data.email,
    login: data.login,
    userId: data._id.toString(),
  }),
};
