import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { VehicleType, DriverStatus } from '@backend/shared';

@Entity('drivers')
@Index(['user_id'], { unique: true })
export class Driver extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: VehicleType })
  vehicle_type: VehicleType;

  @Column({ type: 'varchar', length: 50 })
  vehicle_plate: string;

  @Column({ type: 'varchar', length: 100 })
  license_number: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  license_image_url: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: number;

  @Column({ type: 'int', default: 0 })
  total_deliveries: number;

  @Column({ type: 'boolean', default: false })
  is_online: boolean;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.PENDING })
  status: DriverStatus;
}
