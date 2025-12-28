import { create } from "zustand";

export type ConfirmPayload = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
};

type ConfirmState = {
    isVisible: boolean;
    payload: ConfirmPayload | null;
    open: (payload: ConfirmPayload) => Promise<boolean>;
    confirm: () => void;
    cancel: () => void;
    hide: () => void;
};

let pendingResolve: ((value: boolean) => void) | null = null;

export const useConfirmStore = create<ConfirmState>((set, get) => ({
    isVisible: false,
    payload: null,

    open: (payload) => {
        // If one is already open, close it (resolve false)
        if (pendingResolve) {
            pendingResolve(false);
            pendingResolve = null;
        }

        set({
            isVisible: true,
            payload: {
                title: payload.title ?? "Confirm",
                confirmText: payload.confirmText ?? "Confirm",
                cancelText: payload.cancelText ?? "Cancel",
                destructive: payload.destructive ?? false,
                message: payload.message,
            },
        });

        return new Promise<boolean>((resolve) => {
            pendingResolve = resolve;
        });
    },

    confirm: () => {
        if (pendingResolve) pendingResolve(true);
        pendingResolve = null;
        get().hide();
    },

    cancel: () => {
        if (pendingResolve) pendingResolve(false);
        pendingResolve = null;
        get().hide();
    },

    hide: () => {
        set({ isVisible: false, payload: null });
    },
}));
