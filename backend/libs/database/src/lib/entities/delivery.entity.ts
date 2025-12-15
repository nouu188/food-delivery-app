import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Order } from './order.entity';
import { Driver } from './driver.entity';
import { DeliveryStatus } from '@backend/shared';

@Entity('deliveries')
@Index(['order_id'], { unique: true })
@Index(['driver_id'])
export class Delivery extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid' })
  driver_id: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.ASSIGNED })
  status: DeliveryStatus;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  pickup_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  pickup_longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  dropoff_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  dropoff_longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_km: number;

  @Column({ type: 'int', nullable: true })
  estimated_duration: number;

  @Column({ type: 'timestamp', nullable: true })
  assigned_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  picked_up_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  delivery_proof_url: string;

  @Column({ type: 'text', nullable: true })
  failure_reason: string;
}
