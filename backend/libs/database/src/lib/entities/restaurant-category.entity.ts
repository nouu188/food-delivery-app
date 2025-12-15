import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('restaurant_categories')
@Index(['name'], { unique: true })
@Index(['slug'], { unique: true })
export class RestaurantCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon_url: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;
}
