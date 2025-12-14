import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { XStack, YStack } from 'tamagui';
import {
  LayoutGrid,
  Pizza,
  Beef,
  IceCream,
  Coffee,
  Salad,
  Dessert,
  type LucideIcon,
} from '@tamagui/lucide-icons';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'pizza', name: 'Pizza', icon: Pizza },
  { id: 'burger', name: 'Burger', icon: Beef },
  { id: 'dessert', name: 'Dessert', icon: IceCream },
  { id: 'drinks', name: 'Drinks', icon: Coffee },
  { id: 'salad', name: 'Salad', icon: Salad },
  { id: 'snacks', name: 'Snacks', icon: Dessert },
];

interface CategoriesProps {
  /**
   * Currently selected category ID
   */
  selectedCategory?: string;

  /**
   * Callback when category is selected
   */
  onSelectCategory?: (categoryId: string) => void;

  /**
   * Custom categories array
   */
  categories?: Category[];
}

/**
 * Horizontal scrollable categories component
 * Displays category buttons with icons
 */
const Categories: React.FC<CategoriesProps> = ({
  selectedCategory = 'all',
  onSelectCategory,
  categories = CATEGORIES
}) => {
  const [selected, setSelected] = React.useState(selectedCategory);

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    onSelectCategory?.(categoryId);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
    >
      <XStack gap="$3">
        {categories.map((category) => {
          const isActive = selected === category.id;
          const IconComponent = category.icon;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleSelect(category.id)}
              activeOpacity={0.7}
            >
              <YStack
                backgroundColor={isActive ? '#E95322' : 'white'}
                borderRadius={20}
                paddingHorizontal="$4"
                paddingVertical="$2.5"
                alignItems="center"
                justifyContent="center"
                minWidth={80}
                gap="$1"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
              >
                <IconComponent
                  size={24}
                  color={isActive ? 'white' : '#E95322'}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isActive ? 'white' : '#151312',
                  }}
                >
                  {category.name}
                </Text>
              </YStack>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </ScrollView>
  );
};

export default Categories;
