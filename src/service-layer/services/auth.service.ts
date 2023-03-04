import {
  LoginInputModel,
  NewPasswordRecoveryInputModel,
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
import { UserAccountDBType, UserRefreshTokenPayload } from "../../@types";
import { WithId } from "mongodb";
import { CustomError } from "../../utils/classes/CustomError";
import { jwtToken } from "../../business-layer/security/jwt-token";
import { securityService } from "./security.service";
import { securityWriteRepository } from "../../data-layer/repositories/security/security-write.repository";
import { getPasswordHash } from "../../utils/common/getPasswordHash";

export const authService = {
  checkCredentials: async ({ loginOrEmail, password }: LoginInputModel): Promise<boolean> => {
    const user = await usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);

    if (!user) return false;

    return await bcrypt.compare(password, user.accountData.password);
  },

  getInformationAboutUser: async (loginOrEmail = "") => {
    const user = await usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);

    if (!user) return false;

    return authMapper.mapMeViewModel(user);
  },

  loginUser: async ({
    loginOrEmail,
    password,
    ip,
    userAgent,
  }: {
    loginOrEmail: string;
    password: string;
    ip: string;
    userAgent?: string;
  }): Promise<{ refreshToken: string; accessToken: string } | null> => {
    const user = await usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);
    const isCorrectCredentials = await authService.checkCredentials({
      loginOrEmail: loginOrEmail,
      password: password,
    });

    if (!isCorrectCredentials || !user) {
      return null;
    }

    const addedSecurityDevice = await securityService.addSecurityDeviceForUser({
      userId: user._id,
      userAgent,
      ip,
    });

    if (!addedSecurityDevice) {
      return null;
    }

    const accessToken = await jwtToken(
      { login: user.accountData.login },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      "10s"
    );

    const refreshToken = await jwtToken(
      {
        login: user.accountData.login,
        deviceId: addedSecurityDevice.deviceId,
        iat: Math.round(addedSecurityDevice.issuedAt.valueOf() / 1000),
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
      "20s"
    );

    return { refreshToken, accessToken };
  },

  registrationUser: async (body: UserInputModel): Promise<WithId<UserAccountDBType> | null> => {
    const findUserByLogin = await usersQueryRepository.getUserByLogin(body.login);
    const findUserByEmail = await usersQueryRepository.getUserByEmail(body.email);

    if (findUserByLogin) {
      throw new CustomError("User with this login already exists", "login");
    }

    if (findUserByEmail) {
      throw new CustomError("User with this email already exists", "email");
    }

    const passwordHash = await getPasswordHash(body.password);
    const userData = {
      accountData: { ...body, password: passwordHash, createdAt: new Date().toISOString() },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: null,
      },
      refreshTokensMeta: [],
    } as UserAccountDBType;

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
    const user = await usersQueryRepository.getUserByLoginOrEmailOnly(body.email);

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

  updateTokens: async (
    refreshTokenPayload: UserRefreshTokenPayload
  ): Promise<null | { accessToken: string; refreshToken: string }> => {
    const user = await usersQueryRepository.getUserByDeviceIdAndLogin(
      refreshTokenPayload.login,
      refreshTokenPayload.deviceId
    );

    if (!user) {
      return null;
    }

    const newRefreshToken = await securityService.updateDeviceRefreshToken({
      login: user.accountData.login,
      iat: refreshTokenPayload.iat,
      deviceId: refreshTokenPayload.deviceId,
    });

    if (!newRefreshToken) {
      return null;
    }

    const accessToken = await jwtToken(
      { login: user.accountData.login },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      "10s"
    );

    return { accessToken, refreshToken: newRefreshToken };
  },

  logout: async (refreshTokenPayload: UserRefreshTokenPayload): Promise<boolean> => {
    return securityWriteRepository.deleteDeviceSessionById(refreshTokenPayload.login, refreshTokenPayload.deviceId);
  },

  passwordRecovery: async (email: string): Promise<boolean> => {
    const recoveryCode = await jwtToken({ email }, process.env.PASSWORD_RECOVERY_PRIVATE_KEY as string, "1h");
    const user = await usersQueryRepository.getUserByEmail(email);

    await emailManager.sendPasswordRecoveryEmail(email, recoveryCode);

    if (!user) {
      return true;
    }

    await usersWriteRepository.addPasswordRecoveryData(user._id, recoveryCode);

    return true;
  },

  confirmPasswordRecovery: async ({ newPassword, recoveryCode }: NewPasswordRecoveryInputModel): Promise<boolean> => {
    const passwordHash = await getPasswordHash(newPassword);

    return usersWriteRepository.confirmPasswordRecovery({ passwordHash, recoveryCode });
  },
};
