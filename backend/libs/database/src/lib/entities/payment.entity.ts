import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { PaymentMethod, PaymentStatus } from '@backend/shared';

@Entity('payments')
@Index(['order_id'], { unique: true })
@Index(['user_id'])
export class Payment extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  order_id!: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method!: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  gateway_response!: any;

  @Column({ type: 'timestamp', nullable: true })
  paid_at!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refund_amount!: number;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at!: Date;

  @Column({ type: 'text', nullable: true })
  refund_reason!: string;
}
