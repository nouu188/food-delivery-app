import { IsNumber, IsString, IsOptional, IsBoolean, Min, Max, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsUUID()
  order_id!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  food_rating!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  delivery_rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  is_anonymous?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  image_urls?: string[];
}

export class ReplyToReviewDto {
  @IsString()
  restaurant_reply!: string;
}

export class ReviewQueryDto {
  @IsOptional()
  @IsUUID()
  restaurant_id?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  min_rating?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  has_images?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ReviewImageDto {
  id!: string;
  image_url!: string;
  display_order!: number;
}

export class ReviewResponseDto {
  id!: string;
  order_id!: string;
  user_id!: string;
  user_name!: string;
  user_avatar!: string;
  restaurant_id!: string;
  restaurant_name!: string;
  driver_id!: string;
  driver_name!: string;
  food_rating!: number;
  delivery_rating!: number;
  comment!: string;
  is_anonymous!: boolean;
  images!: ReviewImageDto[];
  restaurant_reply!: string;
  restaurant_replied_at!: Date;
  created_at!: Date;
  updated_at!: Date;
}

export class ReviewListResponseDto {
  data!: ReviewResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  total_pages!: number;
  average_rating!: number;
}
