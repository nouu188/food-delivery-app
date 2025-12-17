import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Restaurant } from './restaurant.entity';

@Entity('operating_hours')
@Unique(['restaurant_id', 'day_of_week'])
@Index(['restaurant_id'])
export class OperatingHours extends BaseEntity {
  @Column({ type: 'uuid' })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @Column({ type: 'int' })
  day_of_week!: number;

  @Column({ type: 'time' })
  open_time!: string;

  @Column({ type: 'time' })
  close_time!: string;

  @Column({ type: 'boolean', default: false })
  is_closed!: boolean;
}
