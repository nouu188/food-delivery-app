import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { Platform } from '@backend/shared';

@Entity('user_devices')
@Index(['user_id'])
@Index(['device_token'], { unique: true })
export class UserDevice extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500, unique: true })
  device_token: string;

  @Column({ type: 'enum', enum: Platform })
  platform: Platform;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
