import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

export class CreateProduct {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
export class UpdateProduct {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity?: number;
}
