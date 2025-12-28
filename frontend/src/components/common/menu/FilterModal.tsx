import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { X, Star, DollarSign } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  minRating?: number;
  priceRange?: { min: number; max: number };
  isOpenOnly?: boolean;
  isFeaturedOnly?: boolean;
  deliveryFee?: { min: number; max: number };
}

export default function FilterModal({ visible, onClose, onApply, currentFilters }: FilterModalProps) {
  const [minRating, setMinRating] = useState(currentFilters.minRating || 0);
  const [priceMin, setPriceMin] = useState(currentFilters.priceRange?.min || 0);
  const [priceMax, setPriceMax] = useState(currentFilters.priceRange?.max || 500000);
  const [deliveryMin, setDeliveryMin] = useState(currentFilters.deliveryFee?.min || 0);
  const [deliveryMax, setDeliveryMax] = useState(currentFilters.deliveryFee?.max || 50000);
  const [isOpenOnly, setIsOpenOnly] = useState(currentFilters.isOpenOnly || false);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(currentFilters.isFeaturedOnly || false);

  const handleApply = () => {
    onApply({
      minRating: minRating > 0 ? minRating : undefined,
      priceRange: priceMin > 0 || priceMax < 500000 ? { min: priceMin, max: priceMax } : undefined,
      deliveryFee: deliveryMin > 0 || deliveryMax < 50000 ? { min: deliveryMin, max: deliveryMax } : undefined,
      isOpenOnly: isOpenOnly || undefined,
      isFeaturedOnly: isFeaturedOnly || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setMinRating(0);
    setPriceMin(0);
    setPriceMax(500000);
    setDeliveryMin(0);
    setDeliveryMax(50000);
    setIsOpenOnly(false);
    setIsFeaturedOnly(false);
  };

  const RatingOption = ({ rating }: { rating: number }) => {
    const isSelected = minRating === rating;
    return (
      <TouchableOpacity
        onPress={() => setMinRating(isSelected ? 0 : rating)}
        className={`flex-row items-center px-4 py-3 rounded-full mr-2 mb-2 ${
          isSelected ? 'bg-[#E95322]' : 'bg-gray-100'
        }`}
        activeOpacity={0.7}
      >
        <Star size={16} color={isSelected ? '#FFFFFF' : '#E95322'} fill={isSelected ? '#FFFFFF' : '#E95322'} />
        <Text className={`ml-1.5 font-semibold ${isSelected ? 'text-white' : 'text-[#070707]'}`}>
          {rating}+ Stars
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#070707]">Filters</Text>
            <TouchableOpacity onPress={onClose} className="p-2" activeOpacity={0.7}>
              <X size={24} color="#070707" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* Quick Toggles */}
            <View className="mb-6">
              <Text className="text-base font-bold text-[#070707] mb-3">Quick Filters</Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity
                  onPress={() => setIsOpenOnly(!isOpenOnly)}
                  className={`flex-row items-center px-4 py-3 rounded-full mr-2 mb-2 ${
                    isOpenOnly ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className={`w-3 h-3 rounded-full ${isOpenOnly ? 'bg-white' : 'bg-green-500'}`} />
                  <Text className={`ml-2 font-semibold ${isOpenOnly ? 'text-white' : 'text-[#070707]'}`}>
                    Open Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsFeaturedOnly(!isFeaturedOnly)}
                  className={`flex-row items-center px-4 py-3 rounded-full mr-2 mb-2 ${
                    isFeaturedOnly ? 'bg-[#F4BA1B]' : 'bg-gray-100'
                  }`}
                  activeOpacity={0.7}
                >
                  <Star size={16} color={isFeaturedOnly ? '#FFFFFF' : '#F4BA1B'} fill={isFeaturedOnly ? '#FFFFFF' : '#F4BA1B'} />
                  <Text className={`ml-1.5 font-semibold ${isFeaturedOnly ? 'text-white' : 'text-[#070707]'}`}>
                    Featured
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating Filter */}
            <View className="mb-6">
              <Text className="text-base font-bold text-[#070707] mb-3">Minimum Rating</Text>
              <View className="flex-row flex-wrap">
                <RatingOption rating={3} />
                <RatingOption rating={4} />
                <RatingOption rating={4.5} />
              </View>
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-base font-bold text-[#070707] mb-2">Price Range (Min Order)</Text>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-[#6B7280]">
                  ${(priceMin / 1000).toFixed(0)}k - ${(priceMax / 1000).toFixed(0)}k
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1 mr-4">
                  <Text className="text-xs text-[#6B7280] mb-1">Min</Text>
                  <Slider
                    value={priceMin}
                    onValueChange={setPriceMin}
                    minimumValue={0}
                    maximumValue={500000}
                    step={10000}
                    minimumTrackTintColor="#E95322"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#E95322"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-[#6B7280] mb-1">Max</Text>
                  <Slider
                    value={priceMax}
                    onValueChange={setPriceMax}
                    minimumValue={0}
                    maximumValue={500000}
                    step={10000}
                    minimumTrackTintColor="#E95322"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#E95322"
                  />
                </View>
              </View>
            </View>

            {/* Delivery Fee */}
            <View className="mb-6">
              <Text className="text-base font-bold text-[#070707] mb-2">Delivery Fee</Text>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-[#6B7280]">
                  ${(deliveryMin / 1000).toFixed(0)}k - ${(deliveryMax / 1000).toFixed(0)}k
                </Text>
              </View>
              <Slider
                value={deliveryMax}
                onValueChange={setDeliveryMax}
                minimumValue={0}
                maximumValue={50000}
                step={5000}
                minimumTrackTintColor="#E95322"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#E95322"
              />
            </View>

            <View className="h-24" />
          </ScrollView>

          {/* Footer */}
          <View className="flex-row px-6 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 py-4 rounded-full border-2 border-[#E95322] mr-3"
              activeOpacity={0.9}
            >
              <Text className="text-[#E95322] text-center font-bold text-base">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 py-4 rounded-full bg-[#E95322]"
              activeOpacity={0.9}
            >
              <Text className="text-white text-center font-bold text-base">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
