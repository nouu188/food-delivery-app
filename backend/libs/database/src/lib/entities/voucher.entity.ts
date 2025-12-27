import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Restaurant } from './restaurant.entity';
import { DiscountType } from '@backend/shared';
import { VoucherUsage } from './voucher-usage.entity';
import { Order } from './order.entity';

@Entity('vouchers')
@Index(['code'], { unique: true })
@Index(['restaurant_id'])
export class Voucher extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'enum', enum: DiscountType })
  discount_type!: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_discount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_amount!: number;

  @Column({ type: 'int', nullable: true })
  usage_limit!: number;

  @Column({ type: 'int', default: 0 })
  usage_count!: number;

  @Column({ type: 'int', default: 1 })
  per_user_limit!: number;

  @Column({ type: 'timestamp' })
  valid_from!: Date;

  @Column({ type: 'timestamp' })
  valid_until!: Date;

  @Column({ type: 'uuid', nullable: true })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant, { nullable: true })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @OneToMany(() => VoucherUsage, usage => usage.voucher)
  usages!: VoucherUsage[];

  @OneToMany(() => Order, order => order.voucher)
  orders!: Order[];
}
