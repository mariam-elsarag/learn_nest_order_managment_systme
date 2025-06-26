import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/product.module";
import { OrderModule } from "./orders/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ReviewModule } from "./reviews/review.module";
import { Review } from "./reviews/review.entity";
import { User } from "./users/user.entity";

@Module({
  imports: [
    UserModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          database: config.get<string>("DB_DATABASE"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          port: config.get<number>("DB_PORT"),
          host: "localhost",
          synchronize: process.env.NODE_ENV !== "producation" ? true : false, //only in dev(no need for migration ) in porducation will delete data
          entities: [Product, Review, User],
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
  ],
})
export class AppModule {}
