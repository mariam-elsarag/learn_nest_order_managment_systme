import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/user.entity";

@Exclude()
export class ReviewResponse {
  @Expose()
  id: number;

  @Expose()
  rating: number;
  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  user: User;

  constructor(partial: Partial<ReviewResponse>) {
    Object.assign(this, partial);
  }
}
