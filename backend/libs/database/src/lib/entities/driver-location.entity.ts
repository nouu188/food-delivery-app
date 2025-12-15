import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Driver } from './driver.entity';

@Entity('driver_locations')
@Index(['driver_id'])
@Index(['recorded_at'])
export class DriverLocation extends BaseEntity {
  @Column({ type: 'uuid' })
  driver_id: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number;

  @Column({ type: 'timestamp' })
  recorded_at: Date;
}
