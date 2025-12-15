import { IsNumber, IsString, IsBoolean, Min, Max, IsOptional } from 'class-validator';

export class OperatingHoursDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  day_of_week!: number;

  @IsString()
  open_time!: string;

  @IsString()
  close_time!: string;

  @IsBoolean()
  @IsOptional()
  is_closed?: boolean;
}

export class UpdateOperatingHoursDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  day_of_week!: number;

  @IsString()
  @IsOptional()
  open_time?: string;

  @IsString()
  @IsOptional()
  close_time?: string;

  @IsBoolean()
  @IsOptional()
  is_closed?: boolean;
}
