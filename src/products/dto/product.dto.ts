import { Exclude, Expose, Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from "class-validator";
import { Review } from "src/reviews/review.entity";
import { User } from "src/users/user.entity";

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

@Exclude()
export class ProductResposeDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  createdAt: Date;
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.user) return null;
    return {
      id: obj.user.id,
      full_name: obj.user.full_name,
    };
  })
  user: User;

  @Expose()
  reviews: Review[];

  constructor(partial: Partial<ProductResposeDto>) {
    Object.assign(this, partial);
  }
}
