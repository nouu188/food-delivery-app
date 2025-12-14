import React, { ReactNode } from 'react';
import { UtensilsCrossed, Truck, CreditCard } from '@tamagui/lucide-icons';
import { YStack } from 'tamagui';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  illustration: ReactNode;
}

interface OnboardingConfig {
  totalSteps: number;
  storageKey: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'step-1',
    title: 'Discover Delicious Food',
    description: 'Explore thousands of restaurants and dishes from around your city.',
    illustration: (
      <YStack justifyContent="center" alignItems="center" width={240} height={240}>
        <UtensilsCrossed size={180} color="#E95322" strokeWidth={1.5} />
      </YStack>
    ),
  },
  {
    id: 'step-2',
    title: 'Fast Delivery',
    description: 'Get your favorite meals delivered to your doorstep in minutes.',
    illustration: (
      <YStack justifyContent="center" alignItems="center" width={240} height={240}>
        <Truck size={180} color="#E95322" strokeWidth={1.5} />
      </YStack>
    ),
  },
  {
    id: 'step-3',
    title: 'Easy Payment',
    description: 'Pay securely with cash or card.',
    illustration: (
      <YStack justifyContent="center" alignItems="center" width={240} height={240}>
        <CreditCard size={180} color="#E95322" strokeWidth={1.5} />
      </YStack>
    ),
  },
];

/**
 * Onboarding configuration
 * Centralized config for onboarding flow
 */
export const ONBOARDING_CONFIG: OnboardingConfig = {
  totalSteps: ONBOARDING_SLIDES.length,
  storageKey: '@food_delivery_app:onboarding_completed',
};
