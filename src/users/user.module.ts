import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthProvider } from "./auth.provider";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthProvider, UserService],
  controllers: [UserController],
})
export class UserModule {}
