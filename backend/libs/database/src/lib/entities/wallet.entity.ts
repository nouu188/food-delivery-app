import { Entity, Column, OneToOne, JoinColumn, Index, Check, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('wallets')
@Index(['user_id'], { unique: true })
@Check(`"balance" >= 0`)
export class Wallet extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @OneToMany(() => WalletTransaction, transaction => transaction.wallet)
  transactions!: WalletTransaction[];
}
