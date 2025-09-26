import { create } from "zustand";

type OnboardingState = {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  reset: () => set({ currentStep: 1 }),
}));
