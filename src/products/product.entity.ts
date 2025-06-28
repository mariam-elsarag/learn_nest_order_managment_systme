import { Review } from "src/reviews/review.entity";
import { User } from "src/users/user.entity";
import { CURENT_TIMESTAMP } from "src/utils/constant";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: 255 })
  title: string;
  @Column()
  description: string;
  @Column({ type: "float" })
  price: number;
  @Column()
  quantity: number;
  @CreateDateColumn({ type: "timestamp", default: () => CURENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURENT_TIMESTAMP,
    onUpdate: CURENT_TIMESTAMP,
  })
  updateAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: "CASCADE",
  })
  user: User;
}
