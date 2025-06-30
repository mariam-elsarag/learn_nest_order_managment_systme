import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { User } from "src/users/user.entity";
import { ProductModule } from "src/products/product.module";
import { UserModule } from "src/users/user.module";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    TypeOrmModule.forFeature([Review, User]),
    ProductModule,
    UserModule,
  ],
})
export class ReviewModule {}
