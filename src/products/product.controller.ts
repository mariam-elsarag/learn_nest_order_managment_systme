import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { jwtTypePayload } from "src/utils/types";

@Controller("/api/product")
export class ProductController {
  constructor(private readonly productSerivice: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  createNewProduct(
    @currentUser() payload: jwtTypePayload,
    @Body() body: CreateProduct,
  ) {
    const { id } = payload;
    return this.productSerivice.create(body, id);
  }

  @Patch(":id")
  updateProduct(
    @Body() body: UpdateProduct,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.productSerivice.update(body, id);
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
  @HttpCode(204)
  deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productSerivice.delete(id);
  }
}
