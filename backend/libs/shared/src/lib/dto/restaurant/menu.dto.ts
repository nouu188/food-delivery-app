import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMenuCategoryDto {
  @IsUUID()
  restaurant_id!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class UpdateMenuCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class MenuItemOptionDto {
  @IsString()
  option_group!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price_modifier!: number;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;

  @IsNumber()
  @IsOptional()
  max_selections?: number;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class CreateMenuItemDto {
  @IsUUID()
  restaurant_id!: string;

  @IsUUID()
  category_id!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  original_price?: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsOptional()
  preparation_time?: number;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class UpdateMenuItemDto {
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  original_price?: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @IsNumber()
  @IsOptional()
  preparation_time?: number;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class CreateMenuItemOptionDto {
  @IsUUID()
  menu_item_id!: string;

  @IsString()
  option_group!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price_modifier!: number;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;

  @IsNumber()
  @IsOptional()
  max_selections?: number;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class UpdateMenuItemOptionDto {
  @IsString()
  @IsOptional()
  option_group?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price_modifier?: number;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;

  @IsNumber()
  @IsOptional()
  max_selections?: number;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class MenuItemResponseDto {
  id!: string;
  restaurant_id!: string;
  category_id!: string;
  name!: string;
  description!: string;
  price!: number;
  original_price!: number;
  image_url!: string;
  is_available!: boolean;
  is_featured!: boolean;
  preparation_time!: number;
  display_order!: number;
  options!: MenuItemOptionDto[];
}

export class MenuCategoryWithItemsDto {
  id!: string;
  name!: string;
  description!: string;
  display_order!: number;
  items!: MenuItemResponseDto[];
}
