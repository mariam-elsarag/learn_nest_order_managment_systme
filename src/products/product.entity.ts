import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

const CURENT_TIMESTAMP = "CURRENT_TIMESTAMP(6)";
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
}
