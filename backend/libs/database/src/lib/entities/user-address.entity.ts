import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';

@Entity('user_addresses')
@Index(['user_id'])
export class UserAddress extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label: string;

  @Column({ type: 'varchar', length: 500 })
  address_line: string;

  @Column({ type: 'varchar', length: 255 })
  ward: string;

  @Column({ type: 'varchar', length: 255 })
  district: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  delivery_note: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;
}
