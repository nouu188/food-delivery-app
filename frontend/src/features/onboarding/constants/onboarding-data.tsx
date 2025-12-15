import React, { ReactNode } from "react";
import { UtensilsCrossed, Truck, CreditCard } from "@tamagui/lucide-icons";
import { View } from "react-native";

export interface OnboardingSlide {
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
        id: "step-1",
        title: "Discover Delicious Food",
        description: "Explore thousands of restaurants and dishes from around your city.",
        illustration: (
            <View style={{ width: 240, height: 240, alignItems: "center", justifyContent: "center" }}>
                <UtensilsCrossed size={180} color="#E95322" strokeWidth={1.5} />
            </View>
        ),
    },
    {
        id: "step-2",
        title: "Fast Delivery",
        description: "Get your favorite meals delivered to your doorstep in minutes.",
        illustration: (
            <View style={{ width: 240, height: 240, alignItems: "center", justifyContent: "center" }}>
                <Truck size={180} color="#E95322" strokeWidth={1.5} />
            </View>
        ),
    },
    {
        id: "step-3",
        title: "Easy Payment",
        description: "Pay securely with cash or card.",
        illustration: (
            <View style={{ width: 240, height: 240, alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={180} color="#E95322" strokeWidth={1.5} />
            </View>
        ),
    },
];

/**
 * Onboarding configuration
 * Centralized config for onboarding flow
 */
export const ONBOARDING_CONFIG: OnboardingConfig = {
    totalSteps: ONBOARDING_SLIDES.length,
    storageKey: "@food_delivery_app:onboarding_completed",
};
