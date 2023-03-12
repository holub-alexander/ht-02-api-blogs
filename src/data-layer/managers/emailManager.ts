import { emailAdapter } from "../adapters/email-adapter";

export const emailManager = {
  async sendConfirmationCodeEmail(email: string, confirmationCode: string) {
    return emailAdapter.sendEmail(
      email,
      "Registration in the system",
      `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href=https://somesite.com/confirm-email?code=${confirmationCode}>complete registration</a>
      </p>`
    );
  },

  async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
    return emailAdapter.sendEmail(
      email,
      "Password recovery",
      `
       <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
       </p>
    `
    );
  },
};
