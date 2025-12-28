import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RestaurantCategoryMapping } from './restaurant-category-mapping.entity';

@Entity('restaurant_categories')
@Index(['name'], { unique: true })
@Index(['slug'], { unique: true })
export class RestaurantCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon_url!: string;

  @Column({ type: 'int', default: 0 })
  display_order!: number;

  @OneToMany(() => RestaurantCategoryMapping, mapping => mapping.category)
  restaurantMappings!: RestaurantCategoryMapping[];
}
