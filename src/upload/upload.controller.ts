import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { diskStorage } from "multer";

@Controller("/api/upload")
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
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
  )
  uploadFiles(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file provide");
    console.log("file uploaded", file);
    return {
      image: file,
    };
  }
  @Get(":image")
  showUploadedImages(@Param("image") image: string, @Res() res: Response) {
    return res.sendFile(image, { root: "mediaFiles" });
  }
}
