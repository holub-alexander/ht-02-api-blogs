import { Paginator, SortDirections, UserAccountDBType } from "../../@types";
import { UserViewModel } from "../response/response-types";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";
import { usersMapper } from "../../business-layer/mappers/users-mapper";
import { UserInputModel } from "../request/request-types";
import { UsersWriteRepository } from "../../data-layer/repositories/users/users-write-repository";
import bcrypt from "bcrypt";
import { generateHash } from "../../business-layer/security/generate-hash";

export class UsersService {
  constructor(private usersQueryRepository: UsersQueryRepository, private usersWriteRepository: UsersWriteRepository) {}

  async getAllUsers({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    searchEmailTerm = "",
    searchLoginTerm = "",
  }): Promise<Paginator<UserViewModel[]>> {
    const res = await this.usersQueryRepository.getAllUsers<UserAccountDBType>({
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
  }

  async createUser(body: UserInputModel): Promise<UserViewModel | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await generateHash(body.password, passwordSalt);

    const userData = {
      accountData: { ...body, password: passwordHash, createdAt: new Date().toISOString() },
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
      passwordRecovery: {
        recoveryCode: null,
      },
      refreshTokensMeta: [],
    } as UserAccountDBType;

    const newUser = await this.usersWriteRepository.createUser(userData);

    return newUser ? usersMapper.mapCreatedUserViewModel(newUser) : null;
  }
}
