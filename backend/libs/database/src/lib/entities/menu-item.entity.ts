import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Restaurant } from './restaurant.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuItemOption } from './menu-item-option.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';

@Entity('menu_items')
@Index(['restaurant_id'])
@Index(['category_id'])
export class MenuItem extends BaseEntity {
  @Column({ type: 'uuid' })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @Column({ type: 'uuid' })
  category_id!: string;

  @ManyToOne(() => MenuCategory)
  @JoinColumn({ name: 'category_id' })
  category!: MenuCategory;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  original_price!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url!: string;

  @Column({ type: 'boolean', default: true })
  is_available!: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured!: boolean;

  @Column({ type: 'int', default: 15 })
  preparation_time!: number;

  @Column({ type: 'int', default: 0 })
  display_order!: number;

  @OneToMany(() => MenuItemOption, option => option.menu_item)
  options!: MenuItemOption[];

  @OneToMany(() => CartItem, cartItem => cartItem.menu_item)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.menu_item)
  orderItems!: OrderItem[];
}
