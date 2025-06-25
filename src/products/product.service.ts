import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProduct, UpdateProduct } from "./dto/product.dto";

type productType = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
};

@Injectable()
export class ProductService {
  private products: productType[] = [
    { id: 1, title: "Pen", description: "test", price: 5, quantity: 10 },
    { id: 2, title: "Book", description: "test", price: 100, quantity: 100 },
  ];
  create({ title, description, price, quantity }: CreateProduct) {
    const newProduct = {
      id: this.products?.length + 1,
      title,
      description,
      price,
      quantity,
    };
    this.products.push(newProduct);
    return newProduct;
  }
  update({ title, description, price, quantity }: UpdateProduct, id: number) {
    return { message: "Successfully update product" };
  }
  getAll() {
    return this.products;
  }
  getOne(id: number) {
    const product = this.products.find((product) => product.id === +id);
    if (!product) {
      throw new NotFoundException("Product not found", {
        description: "this is description",
      });
    }
    return product || {};
  }
  delete(id: number) {
    const product = this.products.find((product) => product.id === +id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return { message: "Successfully delete product" };
  }
}
