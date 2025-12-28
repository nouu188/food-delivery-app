import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { RestaurantStatus } from '@backend/shared';
import { OperatingHours } from './operating-hours.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Voucher } from './voucher.entity';
import { RestaurantCategoryMapping } from './restaurant-category-mapping.entity';
import { Cart } from './cart.entity';
import { UserFavorite } from './user-favorite.entity';

@Entity('restaurants')
@Index(['owner_id'])
export class Restaurant extends BaseEntity {
  @Column({ type: 'uuid' })
  owner_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 500 })
  address!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_image_url!: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating!: number;

  @Column({ type: 'int', default: 0 })
  total_reviews!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee!: number;

  @Column({ type: 'int', default: 30 })
  estimated_prep_time!: number;

  @Column({ type: 'boolean', default: true })
  is_open!: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured!: boolean;

  @Column({ type: 'enum', enum: RestaurantStatus, default: RestaurantStatus.PENDING })
  status!: RestaurantStatus;

  @OneToMany(() => OperatingHours, hours => hours.restaurant, {
    cascade: true,
    eager: false,
  })
  operating_hours!: OperatingHours[];

  @OneToMany(() => MenuCategory, category => category.restaurant)
  menuCategories!: MenuCategory[];

  @OneToMany(() => MenuItem, item => item.restaurant)
  menuItems!: MenuItem[];

  @OneToMany(() => Order, order => order.restaurant)
  orders!: Order[];

  @OneToMany(() => Review, review => review.restaurant)
  reviews!: Review[];

  @OneToMany(() => Voucher, voucher => voucher.restaurant)
  vouchers!: Voucher[];

  @OneToMany(() => RestaurantCategoryMapping, mapping => mapping.restaurant)
  categoryMappings!: RestaurantCategoryMapping[];

  @OneToMany(() => Cart, cart => cart.restaurant)
  carts!: Cart[];

  @OneToMany(() => UserFavorite, favorite => favorite.restaurant)
  userFavorites!: UserFavorite[];
}
