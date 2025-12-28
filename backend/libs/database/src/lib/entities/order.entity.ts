import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';
import { UserAddress } from './user-address.entity';
import { Voucher } from './voucher.entity';
import { OrderStatus, PaymentMethod, CancelledBy } from '@backend/shared';
import { OrderItem } from './order-item.entity';
import { Delivery } from './delivery.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { VoucherUsage } from './voucher-usage.entity';

@Entity('orders')
@Index(['order_number'], { unique: true })
@Index(['user_id'])
@Index(['restaurant_id'])
@Index(['delivery_address_id'])
export class Order extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  order_number!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @Column({ type: 'uuid' })
  delivery_address_id!: string;

  @ManyToOne(() => UserAddress)
  @JoinColumn({ name: 'delivery_address_id' })
  delivery_address!: UserAddress;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount!: number;

  @Column({ type: 'uuid', nullable: true })
  voucher_id!: string;

  @ManyToOne(() => Voucher, { nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucher!: Voucher;

  @OneToMany(() => OrderItem, item => item.order, {
    cascade: true,
  })
  items!: OrderItem[];

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method!: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  special_instructions!: string;

  @Column({ type: 'timestamp', nullable: true })
  estimated_delivery!: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_delivery!: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at!: Date;

  @Column({ type: 'text', nullable: true })
  cancellation_reason!: string;

  @Column({ type: 'enum', enum: CancelledBy, nullable: true })
  cancelled_by!: CancelledBy;

  @OneToOne(() => Delivery, delivery => delivery.order, {
    cascade: false,
    eager: false,
  })
  delivery!: Delivery;

  @OneToOne(() => Payment, payment => payment.order, {
    cascade: false,
    eager: false,
  })
  payment!: Payment;

  @OneToOne(() => Review, review => review.order, {
    cascade: false,
    eager: false,
  })
  review!: Review;

  @OneToMany(() => OrderStatusHistory, history => history.order)
  statusHistory!: OrderStatusHistory[];

  @OneToMany(() => VoucherUsage, usage => usage.order)
  voucherUsages!: VoucherUsage[];
}
