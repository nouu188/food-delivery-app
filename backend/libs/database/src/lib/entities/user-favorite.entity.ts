import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';

@Entity('user_favorites')
@Unique(['user_id', 'restaurant_id'])
@Index(['user_id'])
@Index(['restaurant_id'])
export class UserFavorite extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
