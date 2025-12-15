import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Cart } from './cart.entity';
import { MenuItem } from './menu-item.entity';

@Entity('cart_items')
@Index(['cart_id'])
@Index(['menu_item_id'])
export class CartItem extends BaseEntity {
  @Column({ type: 'uuid' })
  cart_id: string;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ type: 'uuid' })
  menu_item_id: string;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menu_item: MenuItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'jsonb', nullable: true })
  selected_options: any;

  @Column({ type: 'text', nullable: true })
  special_instructions: string;
}
