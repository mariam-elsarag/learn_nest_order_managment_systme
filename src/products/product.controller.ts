import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProduct, UpdateProduct } from "./dto/product.dto";

@Controller("/api/product")
export class ProductController {
  constructor(private readonly productSerivice: ProductService) {}

  @Post()
  createNewProduct(@Body() body: CreateProduct) {
    return this.productSerivice.create(body);
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
  deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productSerivice.delete(id);
  }
}
