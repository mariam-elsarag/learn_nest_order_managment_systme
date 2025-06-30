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
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { currentUser } from "src/users/decorators/user.decorators";
import { JwtTypePayload } from "src/utils/types";
import { AuthGuard } from "src/users/guards/auth.guard";

@Controller("/api/rate")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * =================================
   * Create review
   * =================================
   */
  @Post(":productId")
  @UseGuards(AuthGuard)
  createNewReview(
    @Body() body: CreateReviewDto,
    @currentUser() payload: JwtTypePayload,
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    return this.reviewService.create(body, payload.id, productId);
  }

  /**
   * =================================
   * update review
   * =================================
   */
  @Patch(":reviewId")
  @UseGuards(AuthGuard)
  upateReview(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Body() body: Partial<CreateReviewDto>,
    @currentUser() payload: JwtTypePayload,
  ) {
    return this.reviewService.update(reviewId, payload.id, body);
  }

  /**
   * =================================
   * delete review
   * =================================
   */
  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  deleteReview(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @currentUser() payload: JwtTypePayload,
  ) {
    return this.reviewService.delete(reviewId, payload);
  }

  /**
   * =================================
   * all reviews
   * =================================
   */
  @Get()
  getAllReviews() {
    return this.reviewService.getAll();
  }

  /**
   * =================================
   * Review details
   * =================================
   */
  @Get(":reviewId")
  @UseGuards(AuthGuard)
  getReviewDetails(@Param("reviewId", ParseIntPipe) reviewId: number) {
    return this.reviewService.getOne(reviewId);
  }
}
