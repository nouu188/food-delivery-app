import { Entity, Column, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRole, UserStatus } from '@backend/shared';
import { Restaurant } from './restaurant.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { UserAddress } from './user-address.entity';
import { UserDevice } from './user-device.entity';
import { UserFavorite } from './user-favorite.entity';
import { RefreshToken } from './refresh-token.entity';
import { Notification } from './notification.entity';
import { Wallet } from './wallet.entity';
import { Cart } from './cart.entity';
import { Driver } from './driver.entity';
import { Payment } from './payment.entity';
import { VoucherUsage } from './voucher-usage.entity';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 255 })
  full_name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status!: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  phone_verified_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at!: Date;

  @OneToMany(() => Restaurant, restaurant => restaurant.owner)
  restaurants!: Restaurant[];

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => Review, review => review.user)
  reviews!: Review[];

  @OneToMany(() => UserAddress, address => address.user)
  addresses!: UserAddress[];

  @OneToMany(() => UserDevice, device => device.user)
  devices!: UserDevice[];

  @OneToMany(() => UserFavorite, favorite => favorite.user)
  favoriteRestaurants!: UserFavorite[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications!: Notification[];

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet!: Wallet;

  @OneToOne(() => Cart, cart => cart.user)
  cart!: Cart;

  @OneToOne(() => Driver, driver => driver.user)
  driver!: Driver;

  @OneToMany(() => Payment, payment => payment.user)
  payments!: Payment[];

  @OneToMany(() => VoucherUsage, usage => usage.user)
  voucherUsages!: VoucherUsage[];

  @OneToMany(() => OrderStatusHistory, history => history.user)
  orderStatusChanges!: OrderStatusHistory[];
}
