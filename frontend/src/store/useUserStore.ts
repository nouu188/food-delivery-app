import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userService from "@/services/api/user.service";
import { UserProfile, UpdateProfileRequest } from "@/types/api/user";

interface UserState {
    profile: UserProfile | null;
    isHydrated: boolean;
    isLoading: boolean;
    error: string | null;

    fetchProfile: () => Promise<void>;
    setProfile: (profile: UserProfile | null) => void;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: null,
            isHydrated: false,
            isLoading: false,
            error: null,

            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const profile = await userService.getProfile();
                    set({ profile, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            setProfile: (profile) => set({ profile }),

            updateProfile: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedProfile = await userService.updateProfile(data);
                    set({ profile: updatedProfile, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            clearProfile: () => set({ profile: null, error: null }),
        }),
        {
            name: "user_profile_data",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;
                }
            },
        }
    )
);
