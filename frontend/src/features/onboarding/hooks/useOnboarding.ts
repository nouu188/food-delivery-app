import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ONBOARDING_CONFIG } from '../constants/onboarding-data';

export const useOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = ONBOARDING_CONFIG.totalSteps;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep]);

  const previousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const skipOnboarding = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(ONBOARDING_CONFIG.storageKey, 'true');
      router.replace('/launch/welcome');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const completeOnboarding = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(ONBOARDING_CONFIG.storageKey, 'true');
      router.replace('/launch/welcome');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const checkOnboardingStatus = useCallback(async (): Promise<boolean> => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(
        ONBOARDING_CONFIG.storageKey
      );
      return hasSeenOnboarding === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_CONFIG.storageKey);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, []);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    isLoading,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    checkOnboardingStatus,
    resetOnboarding,
    setCurrentStep,
  };
};
