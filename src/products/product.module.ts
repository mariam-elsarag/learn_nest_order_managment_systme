import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { UserModule } from "src/users/user.module";
import { User } from "src/users/user.entity";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, User]), UserModule],
  exports: [ProductService],
})
export class ProductModule {}
