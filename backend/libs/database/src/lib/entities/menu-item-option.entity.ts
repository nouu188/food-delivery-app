import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_item_options')
@Index(['menu_item_id'])
export class MenuItemOption extends BaseEntity {
  @Column({ type: 'uuid' })
  menu_item_id!: string;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menu_item!: MenuItem;

  @Column({ type: 'varchar', length: 255 })
  option_group!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_modifier!: number;

  @Column({ type: 'boolean', default: false })
  is_required!: boolean;

  @Column({ type: 'int', default: 1 })
  max_selections!: number;

  @Column({ type: 'boolean', default: true })
  is_available!: boolean;

  @Column({ type: 'boolean', default: false })
  is_default!: boolean;
}
