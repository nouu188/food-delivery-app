import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantCategory } from './restaurant-category.entity';

@Entity('restaurant_category_mappings')
export class RestaurantCategoryMapping {
  @PrimaryColumn({ type: 'uuid' })
  restaurant_id!: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant;

  @PrimaryColumn({ type: 'uuid' })
  category_id!: string;

  @ManyToOne(() => RestaurantCategory)
  @JoinColumn({ name: 'category_id' })
  category!: RestaurantCategory;
}
