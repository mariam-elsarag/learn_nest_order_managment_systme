import { BadRequestException, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthProvider } from "./auth.provider";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: "./mediaFiles/user",
        filename: (req, file, cb) => {
          const prefex = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const fileName = `${prefex}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Unsuported file type"), false);
        }
      },
      limits: { fieldSize: 1024 * 1024 * 30 },
    }),
  ],
  providers: [AuthProvider, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
