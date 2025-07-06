import { config } from "dotenv";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { User } from "src/users/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

config({ path: ".env" });
export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.DB_URL,
  entities: [User, Product, Review],
  migrations: ["dist/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
