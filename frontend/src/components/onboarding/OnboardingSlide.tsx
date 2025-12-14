import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { OnboardingSlide as SlideData } from '@/features/onboarding/constants/onboarding-data';

interface OnboardingSlideProps {
  slide: SlideData;
}

/**
 * Individual onboarding slide component
 * Displays illustration, title, and description
 */
export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Illustration */}
      <View className="mb-12 items-center justify-center">
        {slide.illustration}
      </View>

      {/* Title */}
      <Text className="text-neutral-black text-3xl font-extrabold text-center mb-4">
        {slide.title}
      </Text>

      {/* Description */}
      <Text className="text-neutral-gray-600 text-base text-center leading-6 px-4">
        {slide.description}
      </Text>
    </View>
  );
};
