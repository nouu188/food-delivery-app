import { create } from "zustand";

type OverlayState = {
    isProfileSidebarOpen: boolean;
    isNotificationSidebarOpen: boolean;

    openProfileSidebar: () => void;
    closeProfileSidebar: () => void;

    openNotificationSidebar: () => void;
    closeNotificationSidebar: () => void;

    closeAllOverlays: () => void;
};

export const useOverlayStore = create<OverlayState>((set) => ({
    isProfileSidebarOpen: false,
    isNotificationSidebarOpen: false,

    openProfileSidebar: () => set({ isProfileSidebarOpen: true }),
    closeProfileSidebar: () => set({ isProfileSidebarOpen: false }),

    openNotificationSidebar: () => set({ isNotificationSidebarOpen: true }),
    closeNotificationSidebar: () => set({ isNotificationSidebarOpen: false }),

    closeAllOverlays: () => set({ isProfileSidebarOpen: false, isNotificationSidebarOpen: false }),
}));
