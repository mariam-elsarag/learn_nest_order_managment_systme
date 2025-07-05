import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { diskStorage } from "multer";

@Controller("/api/upload")
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file provide");
    console.log("file uploaded", file);
    return {
      image: file,
    };
  }
  // multiple images
  @Post("/multi")
  @UseInterceptors(FilesInterceptor("images"))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (files.length === 0) throw new BadRequestException("No file provide");
    console.log("file uploaded", files);
    return {
      image: files,
    };
  }
  @Get(":image")
  showUploadedImages(@Param("image") image: string, @Res() res: Response) {
    return res.sendFile(image, { root: "mediaFiles" });
  }
}
