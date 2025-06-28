import { timeStamp } from "console";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { CURENT_TIMESTAMP } from "src/utils/constant";
import { Role } from "src/utils/enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: "150", nullable: true })
  full_name: string;

  @Column({ type: "varchar", length: "250", unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ type: "boolean", default: false })
  isAccountVerify: boolean;

  @CreateDateColumn({ type: "timestamp", default: null })
  passwordChangedAt: Date;

  @CreateDateColumn({ type: "timestamp", default: () => CURENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURENT_TIMESTAMP,
    onUpdate: CURENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
