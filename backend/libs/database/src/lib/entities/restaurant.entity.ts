import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { RestaurantStatus } from '@backend/shared';

@Entity('restaurants')
@Index(['owner_id'])
export class Restaurant extends BaseEntity {
  @Column({ type: 'uuid' })
  owner_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_image_url: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: number;

  @Column({ type: 'int', default: 0 })
  total_reviews: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee: number;

  @Column({ type: 'int', default: 30 })
  estimated_prep_time: number;

  @Column({ type: 'boolean', default: true })
  is_open: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'enum', enum: RestaurantStatus, default: RestaurantStatus.PENDING })
  status: RestaurantStatus;
}
