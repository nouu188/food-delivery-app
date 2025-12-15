import { IsUUID, IsNumber, IsString, IsOptional, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SelectedOptionDto {
  @IsString()
  option_group!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price_modifier!: number;
}

export class AddToCartDto {
  @IsUUID()
  menu_item_id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  @IsOptional()
  selected_options?: SelectedOptionDto[];

  @IsString()
  @IsOptional()
  special_instructions?: string;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  @IsOptional()
  selected_options?: SelectedOptionDto[];

  @IsString()
  @IsOptional()
  special_instructions?: string;
}

export class CartItemResponseDto {
  id!: string;
  menu_item_id!: string;
  menu_item_name!: string;
  menu_item_image!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  selected_options!: SelectedOptionDto[];
  special_instructions!: string;
}

export class CartResponseDto {
  id!: string;
  restaurant_id!: string;
  restaurant_name!: string;
  items!: CartItemResponseDto[];
  subtotal!: number;
  delivery_fee!: number;
  total!: number;
  expires_at!: Date;
}
