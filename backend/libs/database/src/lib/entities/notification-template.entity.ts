import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NotificationType } from '@backend/shared';

@Entity('notification_templates')
@Index(['name'], { unique: true })
export class NotificationTemplate extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ type: 'varchar', length: 500 })
  title_template!: string;

  @Column({ type: 'text' })
  body_template!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
