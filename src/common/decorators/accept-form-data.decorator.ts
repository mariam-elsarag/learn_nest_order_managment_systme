import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

export function AcceptFormData() {
  return applyDecorators(UseInterceptors(AnyFilesInterceptor()));
}
