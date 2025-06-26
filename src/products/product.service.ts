import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProduct, UpdateProduct } from "./dto/product.dto";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";

type productType = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProduct) {
    const newProduct = this.productRepository.create(dto);
    return await this.productRepository.save(newProduct);
  }

  getAll() {
    return this.productRepository.find();
  }
  async getOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found", {
        description: "this is description",
      });
    }
    return product;
  }

  async update(dto: UpdateProduct, id: number) {
    const product = await this.getOne(id);

    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    product.quantity = dto.quantity ?? product.quantity;

    return this.productRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.getOne(id);
    await this.productRepository.remove(product);
    return;
  }
}
