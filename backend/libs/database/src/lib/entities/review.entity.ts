import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';
import { Driver } from './driver.entity';

@Entity('reviews')
@Index(['order_id'], { unique: true })
@Index(['user_id'])
@Index(['restaurant_id'])
@Index(['driver_id'])
export class Review extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ type: 'uuid', nullable: true })
  driver_id: string;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'int' })
  food_rating: number;

  @Column({ type: 'int', nullable: true })
  delivery_rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'text', nullable: true })
  restaurant_reply: string;

  @Column({ type: 'timestamp', nullable: true })
  restaurant_replied_at: Date;
}
