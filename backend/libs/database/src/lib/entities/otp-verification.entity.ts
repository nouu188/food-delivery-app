import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { OtpType } from '@backend/shared';

@Entity('otp_verifications')
@Index(['identifier', 'type'])
export class OtpVerification extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  identifier: string;

  @Column({ type: 'varchar', length: 500 })
  otp_hash: string;

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'boolean', default: false })
  is_used: boolean;
}
