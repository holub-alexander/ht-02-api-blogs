import { Paginator, SortDirections } from "../../@types";
import { UserViewModel } from "../response/responseTypes";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import { usersMapper } from "../../business-layer/mappers/users.mapper";
import { UserInputModel } from "../request/requestTypes";
import { usersWriteRepository } from "../../data-layer/repositories/users/users.write.repository";

export const usersService = {
  getAllUsers: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    searchEmailTerm = "",
    searchLoginTerm = "",
  }): Promise<Paginator<UserViewModel[]>> => {
    const res = await usersQueryRepository.getAllUsers<UserViewModel>({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    return {
      ...res,
      items: usersMapper.mapUsersViewModel(res.items),
    };
  },

  createUser: async (body: UserInputModel): Promise<UserViewModel | null> => {
    const newUser = await usersWriteRepository.createUser(body);

    return newUser ? usersMapper.mapCreatedUserViewModel(newUser) : null;
  },
};
