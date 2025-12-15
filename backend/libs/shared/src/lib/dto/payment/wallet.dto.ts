import { IsNumber, IsString, IsOptional, Min, Max, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { WalletTransactionType } from '../../enums';

export class TopUpWalletDto {
  @IsNumber()
  @Min(10000)
  @Max(50000000)
  amount!: number;

  @IsString()
  @IsOptional()
  payment_method?: string;
}

export class WalletResponseDto {
  id!: string;
  user_id!: string;
  balance!: number;
  currency!: string;
  is_active!: boolean;
  created_at!: Date;
  updated_at!: Date;
}

export class WalletTransactionResponseDto {
  id!: string;
  wallet_id!: string;
  type!: WalletTransactionType;
  amount!: number;
  balance_before!: number;
  balance_after!: number;
  reference_type!: string;
  reference_id!: string;
  description!: string;
  created_at!: Date;
}

export class WalletTransactionQueryDto {
  @IsOptional()
  @IsEnum(WalletTransactionType)
  type?: WalletTransactionType;

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

export class WalletTransactionListResponseDto {
  data!: WalletTransactionResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  total_pages!: number;
}
