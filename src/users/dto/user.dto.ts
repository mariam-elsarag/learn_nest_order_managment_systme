import { Exclude, Expose } from "class-transformer";
import { Role } from "src/utils/enum";

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  password: string;
  passwordChangedAt: Date;

  @Expose()
  createdAt: Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
