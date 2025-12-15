import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  address_line!: string;

  @IsString()
  ward!: string;

  @IsString()
  district!: string;

  @IsString()
  city!: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  delivery_note?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}

export class AddressDto {
  id!: string;
  label!: string;
  address_line!: string;
  ward!: string;
  district!: string;
  city!: string;
  latitude!: number;
  longitude!: number;
  delivery_note!: string;
  is_default!: boolean;
}
