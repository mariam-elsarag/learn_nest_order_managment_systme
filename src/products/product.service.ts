import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateProduct,
  ProductResposeDto,
  UpdateProduct,
} from "./dto/product.dto";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { JwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";

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

  async create(dto: CreateProduct, user: User) {
    const newProduct = this.productRepository.create({ ...dto, user: user });
    await this.productRepository.save(newProduct);
    return new ProductResposeDto(newProduct);
  }

  async getAll() {
    const products = await this.productRepository.find({
      relations: {
        user: true,
      },
    });
    return products?.map((item) => new ProductResposeDto(item)) ?? [];
  }
  async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return new ProductResposeDto(product);
  }

  async update(dto: UpdateProduct, id: number, payload: JwtTypePayload) {
    const product = await this.getOne(id);
    let updatedProduct = product;
    if (product.user.id === payload.id || payload.role === Role.ADMIN) {
      if (dto) {
        Object.entries(dto).forEach(([key, value]) => {
          if (value !== undefined) {
            product[key] = value;
          }
        });
        updatedProduct = await this.productRepository.save(product);
      }
      return new ProductResposeDto(updatedProduct);
    } else {
      throw new ForbiddenException(
        "Access denied, you are not allow to perform this action",
      );
    }
  }

  async delete(id: number, payload: JwtTypePayload): Promise<void> {
    const product = await this.getOne(id);
    if (product.user.id === payload.id || payload.role === Role.ADMIN) {
      await this.productRepository.delete(product.id);
    } else {
      throw new ForbiddenException(
        "Access denied, you are not allow to perform this action",
      );
    }
  }
}
