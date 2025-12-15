import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, Min, Max, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType, NotificationSentVia } from '../../enums';

export class CreateNotificationDto {
  @IsUUID()
  user_id!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  data?: any;

  @IsArray()
  @IsEnum(NotificationSentVia, { each: true })
  @IsOptional()
  sent_via?: NotificationSentVia[];
}

export class MarkAsReadDto {
  @IsUUID()
  notification_id!: string;
}

export class NotificationQueryDto {
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_read?: boolean;

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

export class NotificationResponseDto {
  id!: string;
  user_id!: string;
  type!: NotificationType;
  title!: string;
  body!: string;
  data: any;
  is_read!: boolean;
  read_at!: Date;
  sent_via!: NotificationSentVia[];
  created_at!: Date;
}

export class NotificationListResponseDto {
  data!: NotificationResponseDto[];
  total!: number;
  unread_count!: number;
  page!: number;
  limit!: number;
  total_pages!: number;
}
