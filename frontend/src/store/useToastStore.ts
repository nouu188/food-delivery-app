import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

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

const DEFAULT_DURATIONS: Record<ToastType, number> = {
    success: 2800,
    error: 4000,
    info: 3000,
    warning: 3500,
};

export const useToastStore = create<ToastState>((set, get) => ({
    isVisible: false,
    current: null,
    show: (payload) => {
        const durationMs = payload.durationMs ?? DEFAULT_DURATIONS[payload.type];
        set({ isVisible: true, current: { ...payload, durationMs } });
    },
    hide: () => {
        // Avoid redundant renders
        if (!get().isVisible && !get().current) return;
        set({ isVisible: false, current: null });
    },
}));
