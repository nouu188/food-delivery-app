import React from 'react';
import { View } from 'react-native';

interface StepIndicatorProps {
  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Current active step (0-indexed)
   */
  currentStep: number;

  /**
   * Active indicator color
   * @default '#E95322'
   */
  activeColor?: string;

  /**
   * Inactive indicator color
   * @default '#FDE9A8'
   */
  inactiveColor?: string;
}

/**
 * Step indicator component for onboarding
 * Shows progress through multiple steps
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  activeColor = '#E95322',
  inactiveColor = '#FDE9A8',
}) => {
  return (
    <View className="flex-row gap-x-2 items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = currentStep === index;

        return (
          <View
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              isActive ? 'w-6' : 'w-3'
            }`}
            style={{
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
};
