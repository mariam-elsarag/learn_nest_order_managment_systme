import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
