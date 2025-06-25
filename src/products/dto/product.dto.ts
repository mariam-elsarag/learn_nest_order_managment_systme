import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProduct {
  @IsString()
  @IsNotEmpty()
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
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity?: number;
}
