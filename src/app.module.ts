import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/product.module";
import { OrderModule } from "./orders/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ReviewModule } from "./reviews/review.module";
import { Review } from "./reviews/review.entity";
import { User } from "./users/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";
import { LoggerMiddleware } from "./utils/middlewares/logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { dataSourceOptions } from "db/data-source";
import { APPController } from "./app.controller";

@Module({
  controllers: [APPController],
  imports: [
    UploadModule,
    UserModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    MailModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: config.get<string>("JWT_EXPIRE_IN") },
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, //1 minute
          limit: 3, //10 request every minute
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard }, //if i wanna to skip to route i will use in controller skipThrottle
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "/api/users", method: RequestMethod.DELETE }) //this if i waana apply it to all methods in path except delete
      .forRoutes(
        {
          // we can add more than middleware in consurem (LoggerMiddleware,AtuthMiddleware)
          path: "users", // if for all route insted of users will be *
          method: RequestMethod.ALL,
        },
        // {
        //   path: "/api/products",
        //   method: RequestMethod.DELETE,
        // },
      );
    // consumer //this to see how to add more than middleware for different methods
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}

//for local db
// TypeOrmModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: "postgres",
//       database: config.get<string>("DB_DATABASE"),
//       username: config.get<string>("DB_USERNAME"),
//       password: config.get<string>("DB_PASSWORD"),
//       port: config.get<number>("DB_PORT"),
//       host: "localhost",
//       synchronize: process.env.NODE_ENV !== "producation" ? true : false, //only in dev(no need for migration ) in porducation will delete data
//       entities: [Product, Review, User],
//     };
//   },
// }),
