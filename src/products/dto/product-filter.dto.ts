import { IsOptional, IsString, IsNumberString } from "class-validator";

export class ProductFilterQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
