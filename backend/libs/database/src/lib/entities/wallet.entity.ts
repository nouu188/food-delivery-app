import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';

@Entity('wallets')
@Index(['user_id'], { unique: true })
@Check(`"balance" >= 0`)
export class Wallet extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
