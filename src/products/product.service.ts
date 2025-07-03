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
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { JwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";
import { Request } from "express";
import {
  FullPaginationDto,
  LinkPaginationDto,
  MetaPaginationDto,
} from "src/common/pagination/pagination.dto";

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

  async getAll({
    title,
    minPrice,
    maxPrice,
    page,
    limit,
    req,
  }: {
    title?: string;
    minPrice?: string;
    maxPrice?: string;
    page: number;
    limit: number;
    req: Request;
  }) {
    const queryString =
      await this.productRepository.createQueryBuilder("product");

    if (title) {
      queryString.andWhere("product.title ILIKE :title", {
        title: `%${title}%`,
      });
    }

    if (minPrice) {
      queryString.andWhere("product.price >= :minPrice", {
        minPrice: Number(minPrice),
      });
    }

    if (maxPrice) {
      queryString.andWhere("product.price <= :maxPrice", {
        maxPrice: Number(maxPrice),
      });
    }
    const [results, count] = await queryString
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new FullPaginationDto(page, count, limit, req, results);
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
