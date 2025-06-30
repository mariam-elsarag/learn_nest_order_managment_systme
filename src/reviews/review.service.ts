import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UserService } from "src/users/user.service";
import { ProductService } from "src/products/product.service";
import { ReviewResponse } from "./dtos/review-response.dto";
import { JwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly userServcie: UserService,
    private readonly productService: ProductService,
  ) {}
  /**
   * =================================
   * Create review
   * =================================
   */
  /**
   * Create new Review
   * @param body (rate,comment)
   * @param userId
   * @param productId
   * @returns
   */
  async create(body: CreateReviewDto, userId: number, productId: number) {
    const product = await this.productService.getOne(productId);
    const user = await this.userServcie.userDetails(userId);
    const hasPrevReview = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (hasPrevReview) {
      throw new BadRequestException("You already review this product");
    }
    const review = this.reviewRepository.create({ ...body, product, user });
    const newReview = await this.reviewRepository.save(review);
    return {
      id: newReview.id,
      ratting: newReview.rating,
      comment: newReview.comment,
    };
  }
  /**
   * =================================
   * Review details
   * =================================
   */
  /**
   * Review details
   * @param id
   * @returns (id,ratting,comment)
   */
  async getOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException("Review not found");
    }
    return new ReviewResponse(review);
  }

  /**
   * =================================
   * All reviews
   * =================================
   */
  /**
   * All reviews
   * @returns (id,ratting,comment)
   */
  async getAll() {
    const review = await this.reviewRepository.find({
      order: { createdAt: "DESC" },
    });
    return review ? review.map((item) => new ReviewResponse(item)) : [];
  }

  /**
   * =================================
   * Update
   * =================================
   */

  /**
   *Update review
   * @param reviewId review id
   * @param userId
   * @param body _{rate,comment}
   * @description Only who write review can update it
   * @returns (id,ratting,comment)
   */
  async update(
    reviewId: number,
    userId: number,
    body: Partial<CreateReviewDto>,
  ) {
    const review = await this.getOne(reviewId);
    if (review.user.id !== userId) {
      throw new ForbiddenException("Review not found");
    }
    Object.entries(body).forEach(([key, value]) => {
      if (value && value !== undefined) {
        review[key] = value;
      }
    });
    const updatedReview = await this.reviewRepository.save(review);
    return new ReviewResponse(updatedReview);
  }
  /**
   * =================================
   * delete review
   * =================================
   */

  /**
   * Delete review
   * @param id
   * @param payload
   */
  async delete(id: number, payload: JwtTypePayload): Promise<void> {
    const review = await this.getOne(id);
    console.log(review, "re");
    if (review.user.id === payload.id || payload.role === Role.ADMIN) {
      await this.reviewRepository.delete(id);
    } else {
      throw new ForbiddenException(
        "Access denied,you are not allow to preform this action",
      );
    }
  }
}
