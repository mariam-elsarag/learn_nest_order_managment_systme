import { BadRequestException, Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
  controllers: [UploadController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./mediaFiles",
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
          cb(new BadRequestException("Unsupported file format"), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 30 }, //30mb
    }),
  ],
})
export class UploadModule {}
