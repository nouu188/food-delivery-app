import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    avatar: string;
}

interface UserState {
    profile: UserProfile;
    isHydrated: boolean;
    setProfile: (newProfile: Partial<UserProfile>) => void;
    resetProfile: () => void;
}

const defaultProfile: UserProfile = {
    fullName: "John Smith",
    dateOfBirth: "09/10/1991",
    email: "johnsmith@example.com",
    phoneNumber: "+123 567 89000",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: defaultProfile,
            isHydrated: false,

            setProfile: (newProfile) => {
                set((state) => ({
                    profile: { ...state.profile, ...newProfile },
                }));
            },

            resetProfile: () => set({ profile: defaultProfile }),
        }),
        {
            name: "user_profile_data", // key trong AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Được gọi sau khi hydrate thành công
                    state.isHydrated = true;
                }
            },
        }
    )
);
