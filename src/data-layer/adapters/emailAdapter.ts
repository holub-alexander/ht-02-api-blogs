import { createTransport } from "nodemailer";

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    try {
      const transport = createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const info = await transport.sendMail({
        from: `Alexander <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject,
        html: message,
      });

      console.log("Email sent successfully");

      return info;
    } catch (err) {
      console.log("Email not sent");
      console.log(err);
    }
  },
};
