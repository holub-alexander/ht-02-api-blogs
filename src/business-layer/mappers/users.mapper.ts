import { WithId } from "mongodb";
import { UserViewModel } from "../../service-layer/response/responseTypes";

export const usersMapper = {
  mapUsersViewModel: (data: WithId<UserViewModel>[]): UserViewModel[] =>
    data.map((user) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    })),

  mapCreatedUserViewModel: (user: WithId<UserViewModel>): UserViewModel => ({
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }),
};
