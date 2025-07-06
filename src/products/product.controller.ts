import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProduct, UpdateProduct } from "./dto/product.dto";
import { AuthGuard } from "src/users/guards/auth.guard";
import { currentUser } from "src/users/decorators/user.decorators";

import { User } from "src/users/user.entity";
import { JwtTypePayload } from "src/utils/types";
import { PaginationQueryDto } from "src/common/pagination/pagination-query.dto";
import { ProductFilterQueryDto } from "./dto/product-filter.dto";
import { Request } from "express";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

// @SkipThrottle() // if we added her mean this route won't have rate limit
@Controller("/api/product")
export class ProductController {
  constructor(private readonly productSerivice: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  createNewProduct(@currentUser() payload: User, @Body() body: CreateProduct) {
    return this.productSerivice.create(body, payload);
  }

  @Patch(":id")
  // @Throttle({ default: { limit: 1, ttl: 10000 } }) //if i wanna change defult for limti and time in route
  @UseGuards(AuthGuard)
  updateProduct(
    @Body() body: UpdateProduct,
    @Param("id", ParseIntPipe) id: number,
    @currentUser() payload: JwtTypePayload,
  ) {
    return this.productSerivice.update(body, id, payload);
  }
  @Get()
  getAllProducts(@Query() query: ProductFilterQueryDto, @Req() req: Request) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 2;

    return this.productSerivice.getAll({
      title: query.title,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      page,
      limit,
      req,
    });
  }

  @Get(":id")
  @SkipThrottle() //this only for one route
  getSinglePorduct(@Param("id", ParseIntPipe) id: number) {
    return this.productSerivice.getOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(
    @Param("id", ParseIntPipe) id: number,
    @currentUser() payload: JwtTypePayload,
  ) {
    return this.productSerivice.delete(id, payload);
  }
}
