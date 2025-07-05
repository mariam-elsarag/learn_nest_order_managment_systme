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
  passwordChangedAt: Date | null;

  @Expose()
  avatar: string | null;

  @Expose()
  createdAt: Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
