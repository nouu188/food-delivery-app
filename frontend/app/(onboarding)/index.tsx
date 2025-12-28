import { OnboardingSlide, StepIndicator } from "@/components/onboarding";
import { ONBOARDING_SLIDES } from "@/features/onboarding/constants/onboarding-data";
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";
import React, { useRef } from "react";
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);

    const {
        currentStep,
        totalSteps,
        isLastStep,
        nextStep,
        skipOnboarding,
        completeOnboarding,
        setCurrentStep,
        isLoading,
    } = useOnboarding();

    const handleNext = () => {
        if (isLastStep) {
            completeOnboarding();
        } else {
            const nextIndex = currentStep + 1;
            scrollViewRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true,
            });
            nextStep();
        }
    };

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const stepIndex = Math.round(offsetX / width);
        if (stepIndex !== currentStep && stepIndex >= 0 && stepIndex < totalSteps) {
            setCurrentStep(stepIndex);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary-base">
            <View className="px-6 pt-4 items-end">
                <TouchableOpacity onPress={skipOnboarding} disabled={isLoading} className="py-2 px-4">
                    <Text className="text-SecondaryBase font-semibold text-base">Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
                className="flex-1"
            >
                {ONBOARDING_SLIDES.map((slide) => (
                    <OnboardingSlide key={slide.id} slide={slide} />
                ))}
            </ScrollView>

            <View className="px-6 pb-8 gap-y-8">
                <StepIndicator
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    activeColor="#E95322"
                    inactiveColor="#FDE9A8"
                />

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={isLoading}
                    className="h-14 rounded-full items-center justify-center active:opacity-90"
                    style={{ backgroundColor: "#E95322" }}
                >
                    <Text className="text-white font-bold text-lg">{isLastStep ? "Get Started" : "Next"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
