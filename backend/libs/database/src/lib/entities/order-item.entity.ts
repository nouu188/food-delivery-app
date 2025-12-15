import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Order } from './order.entity';
import { MenuItem } from './menu-item.entity';

@Entity('order_items')
@Index(['order_id'])
@Index(['menu_item_id'])
export class OrderItem extends BaseEntity {
  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid' })
  menu_item_id: string;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menu_item: MenuItem;

  @Column({ type: 'varchar', length: 255 })
  item_name: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'jsonb', nullable: true })
  selected_options: any;

  @Column({ type: 'text', nullable: true })
  special_instructions: string;
}
