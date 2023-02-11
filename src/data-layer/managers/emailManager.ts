import { emailAdapter } from "../adapters/emailAdapter";

export const emailManager = {
  async sendConfirmationCodeEmail(email: string, confirmationCode: string) {
    return emailAdapter.sendEmail(
      email,
      "Registration in the system",
      `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href=https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
      </p>`
    );
  },
};
