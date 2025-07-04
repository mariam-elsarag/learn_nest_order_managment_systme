import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({ controllers: [UploadController], imports: [MulterModule.register()] })
export class UploadModule {}
