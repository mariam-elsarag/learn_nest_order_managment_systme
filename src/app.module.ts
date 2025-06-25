import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/product.module";
import { OrderModule } from "./orders/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";

@Module({
  imports: [
    UserModule,
    ProductModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      database: "oms-app-db",
      username: "postgres",
      password: "01150464958",
      port: 5432,
      host: "localhost",
      synchronize: true, //only in dev(no need for migration ) in porducation will delete data
      entities: [Product],
    }),
  ],
})
export class AppModule {}
