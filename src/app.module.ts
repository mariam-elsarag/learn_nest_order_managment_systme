import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/product.module";
import { OrderModule } from "./orders/order.module";

@Module({
  imports: [UserModule, ProductModule, OrderModule],
})
export class AppModule {}
