import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRole, UserStatus } from '@backend/shared';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  phone_verified_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;
}
