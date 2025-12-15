import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Wallet } from './wallet.entity';
import { WalletTransactionType } from '@backend/shared';

@Entity('wallet_transactions')
@Index(['wallet_id'])
export class WalletTransaction extends BaseEntity {
  @Column({ type: 'uuid' })
  wallet_id: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  balance_before: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  balance_after: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference_id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;
}
