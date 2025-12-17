import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Review } from './review.entity';

@Entity('review_images')
@Index(['review_id'])
export class ReviewImage extends BaseEntity {
  @Column({ type: 'uuid' })
  review_id!: string;

  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id' })
  review!: Review;

  @Column({ type: 'varchar', length: 500 })
  image_url!: string;

  @Column({ type: 'int', default: 0 })
  display_order!: number;
}
