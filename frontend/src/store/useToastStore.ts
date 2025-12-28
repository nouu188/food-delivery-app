import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastPayload = {
    type: ToastType;
    title?: string;
    message: string;
    durationMs?: number;
};

type ToastState = {
    isVisible: boolean;
    current: ToastPayload | null;
    show: (payload: ToastPayload) => void;
    hide: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
    isVisible: false,
    current: null,
    show: (payload) => {
        set({ isVisible: true, current: { durationMs: 2800, ...payload } });
    },
    hide: () => {
        // Avoid redundant renders
        if (!get().isVisible && !get().current) return;
        set({ isVisible: false, current: null });
    },
}));
