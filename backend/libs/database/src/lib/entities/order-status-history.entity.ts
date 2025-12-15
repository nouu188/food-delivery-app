import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { OrderStatus } from '@backend/shared';

@Entity('order_status_history')
@Index(['order_id'])
@Index(['changed_by'])
export class OrderStatusHistory extends BaseEntity {
  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'enum', enum: OrderStatus, nullable: true })
  previous_status: OrderStatus;

  @Column({ type: 'enum', enum: OrderStatus })
  new_status: OrderStatus;

  @Column({ type: 'uuid' })
  changed_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by' })
  user: User;

  @Column({ type: 'text', nullable: true })
  note: string;
}
