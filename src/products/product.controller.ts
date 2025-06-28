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
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProduct, UpdateProduct } from "./dto/product.dto";
import { AuthGuard } from "src/users/guards/auth.guard";
import { currentUser } from "src/users/decorators/user.decorators";

import { User } from "src/users/user.entity";
import { jwtTypePayload } from "src/utils/types";

@Controller("/api/product")
export class ProductController {
  constructor(private readonly productSerivice: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  createNewProduct(@currentUser() payload: User, @Body() body: CreateProduct) {
    return this.productSerivice.create(body, payload);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  updateProduct(
    @Body() body: UpdateProduct,
    @Param("id", ParseIntPipe) id: number,
    @currentUser() payload: jwtTypePayload,
  ) {
    return this.productSerivice.update(body, id, payload);
  }
  @Get()
  getAllProducts() {
    return this.productSerivice.getAll();
  }
  @Get(":id")
  getSinglePorduct(@Param("id", ParseIntPipe) id: number) {
    return this.productSerivice.getOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(
    @Param("id", ParseIntPipe) id: number,
    @currentUser() payload: jwtTypePayload,
  ) {
    return this.productSerivice.delete(id, payload);
  }
}
