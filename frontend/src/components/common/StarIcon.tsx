import React from 'react';
import { Star } from '@tamagui/lucide-icons';

interface StarIconProps {
  /**
   * Size of the star icon
   * @default 16
   */
  size?: number;

  /**
   * Color of the star
   * @default '#F4BA1B'
   */
  color?: string;

  /**
   * Whether the star is filled or outlined
   * @default true
   */
  filled?: boolean;
}

/**
 * Star icon component
 * Can be used for ratings and favorites
 */
const StarIcon: React.FC<StarIconProps> = ({
  size = 16,
  color = '#F4BA1B',
  filled = true
}) => {
  return (
    <Star
      size={size}
      fill={filled ? color : 'none'}
      strokeWidth={filled ? 0 : 2}
    />
  );
};

export default StarIcon;
