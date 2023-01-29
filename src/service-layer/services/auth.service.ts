import { LoginInputModel } from "../request/requestTypes";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import bcrypt from "bcrypt";

export const authService = {
  checkCredentials: async ({ loginOrEmail, password }: LoginInputModel): Promise<boolean> => {
    const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) return false;

    return await bcrypt.compare(password, user.password);
  },
};
