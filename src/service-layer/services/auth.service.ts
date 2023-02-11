import {
  LoginInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
  UserInputModel,
} from "../request/requestTypes";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import bcrypt from "bcrypt";
import { authMapper } from "../../business-layer/mappers/auth.mapper";
import { emailManager } from "../../data-layer/managers/emailManager";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { generateHash } from "../../business-layer/security/generate-hash";
import { usersWriteRepository } from "../../data-layer/repositories/users/users.write.repository";
import { ErrorMessage, UserAccountDBType } from "../../@types";
import { WithId } from "mongodb";

export const authService = {
  checkCredentials: async ({ loginOrEmail, password }: LoginInputModel): Promise<boolean> => {
    const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) return false;

    return await bcrypt.compare(password, user.accountData.password);
  },

  getInformationAboutUser: async (loginOrEmail = "") => {
    const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) return false;

    return authMapper.mapMeViewModel(user);
  },

  registrationUser: async (body: UserInputModel): Promise<ErrorMessage | WithId<UserAccountDBType> | null> => {
    const user = await usersQueryRepository.getUserByLoginOrEmail(body.email);

    if (user) {
      return null;
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await generateHash(body.password, passwordSalt);

    const userData = {
      accountData: { ...body, password: passwordHash, createdAt: new Date().toISOString() },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    const createdUser = await usersWriteRepository.createUser(userData);

    if (createdUser) {
      await emailManager.sendConfirmationCodeEmail(
        createdUser.accountData.email,
        createdUser.emailConfirmation.confirmationCode ?? ""
      );
    }

    return createdUser;
  },

  confirmRegistration: async (body: RegistrationConfirmationCodeModel): Promise<boolean> => {
    const findUser = await usersQueryRepository.getUserByConfirmationCode(body.code);

    console.log(findUser);

    if (!findUser) return false;
    if (findUser.emailConfirmation.isConfirmed) return false;
    if (findUser.emailConfirmation.confirmationCode !== body.code) return false;
    if (findUser.emailConfirmation.expirationDate && findUser.emailConfirmation.expirationDate <= new Date())
      return false;

    return await usersWriteRepository.userConfirmRegistration(findUser._id);
  },

  registrationEmailResending: async (body: RegistrationEmailResending) => {
    const user = await usersQueryRepository.getUserByLoginOrEmail(body.email);

    console.log(user);

    if (!user || user.emailConfirmation.isConfirmed) {
      return false;
    }

    const newConfirmationCode = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
      }),
    };

    const isUpdateConfirmationCode = await usersWriteRepository.updateConfirmationCode(user._id, newConfirmationCode);

    if (isUpdateConfirmationCode) {
      await emailManager.sendConfirmationCodeEmail(user.accountData.email, newConfirmationCode.confirmationCode);

      return true;
    }
  },
};
