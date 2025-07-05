import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";
import { join } from "path";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: "Gmail",
          secure: false,
          auth: {
            user: config.get<string>("EMAIL_USER"),
            pass: config.get<string>("EMAIL_PASSWORD"),
          },
        },
        defaults: {
          from: '"My App" <no-reply@myapp.com>',
        },
        template: {
          dir: join(process.cwd(), "src", "mail", "templates"),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
