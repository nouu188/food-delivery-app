import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRestaurantCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  @IsOptional()
  icon_url?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class UpdateRestaurantCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  icon_url?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class RestaurantCategoryResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  icon_url!: string;
  display_order!: number;
}
