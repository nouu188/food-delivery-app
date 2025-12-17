import { Entity, Column, OneToOne, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
@Index(['user_id'], { unique: true })
@Index(['restaurant_id'])
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @OneToMany(() => CartItem, item => item.cart, {
    cascade: true,
    eager: false,
  })
  items!: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'timestamp', nullable: true })
  expires_at!: Date;
}
