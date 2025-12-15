import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Voucher } from './voucher.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('voucher_usages')
@Unique(['voucher_id', 'order_id'])
@Index(['voucher_id'])
@Index(['user_id'])
@Index(['order_id'])
export class VoucherUsage extends BaseEntity {
  @Column({ type: 'uuid' })
  voucher_id: string;

  @ManyToOne(() => Voucher)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_applied: number;
}
