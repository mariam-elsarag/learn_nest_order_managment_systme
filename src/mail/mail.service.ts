import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

type activateAccountContext = {
  full_name: string;
  email: string;
  otp: string;
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async activateAccountEmail(email: string, full_name: string, otp: string) {
    console.log(email, full_name, otp);
    await this.send(email, "Activate Account", "activation", {
      full_name,
      email,
      otp,
    });
  }
  async forgetPasswordEmail(email: string, full_name: string, otp: string) {
    console.log(email, full_name, otp);
    await this.send(email, "Reset Your Password", "forget-password", {
      full_name,
      email,
      otp,
    });
  }

  private async send(
    email: string,
    subject: string,
    template: string,
    context: activateAccountContext,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `"My App" <no-reply@myapp.com>`,
        subject: subject,
        template,
        context,
      });
    } catch (err) {
      console.error("Email send error:", err);
      throw new RequestTimeoutException("Failed to send activation email.");
    }
  }
}
