import { Product } from "src/products/product.entity";
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

@Entity({ name: "reviews" })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => CURENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURENT_TIMESTAMP,
    onUpdate: CURENT_TIMESTAMP,
  })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, {
    eager: true,
    onDelete: "CASCADE",
  })
  user: User;
}
