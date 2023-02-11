import { Paginator, SortDirections, UserAccountDBType } from "../../@types";
import { UserViewModel } from "../response/responseTypes";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import { usersMapper } from "../../business-layer/mappers/users.mapper";
import { UserInputModel } from "../request/requestTypes";
import { usersWriteRepository } from "../../data-layer/repositories/users/users.write.repository";
import bcrypt from "bcrypt";
import { generateHash } from "../../business-layer/security/generate-hash";

export const usersService = {
  getAllUsers: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    searchEmailTerm = "",
    searchLoginTerm = "",
  }): Promise<Paginator<UserViewModel[]>> => {
    const res = await usersQueryRepository.getAllUsers<UserAccountDBType>({
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
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await generateHash(body.password, passwordSalt);

    const userData = {
      accountData: { ...body, password: passwordHash, createdAt: new Date().toISOString() },
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
    };

    const newUser = await usersWriteRepository.createUser(userData);

    return newUser ? usersMapper.mapCreatedUserViewModel(newUser) : null;
  },
};
