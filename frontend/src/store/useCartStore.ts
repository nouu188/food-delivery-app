import { create } from "zustand";
import orderService from "@/services/api/order.service";
import { Cart, AddToCartRequest } from "@/types/api/order";

interface CartState {
    cart: Cart | null;
    isDrawerOpen: boolean;
    isLoading: boolean;
    error: string | null;
    selectedItemIds: Set<string>;

    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    setDrawerOpen: (open: boolean) => void;

    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartRequest) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    removeBulkItems: (itemIds: string[]) => Promise<void>;

    toggleItemSelection: (itemId: string) => void;
    selectAllItems: () => void;
    deselectAllItems: () => void;
    clearSelection: () => void;

    subtotal: () => number;
    total: () => number;
    itemCount: () => number;
    selectedSubtotal: () => number;
    selectedTotal: () => number;
    selectedCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isDrawerOpen: false,
    isLoading: false,
    error: null,
    selectedItemIds: new Set<string>(),

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const cart = await orderService.getCart();

            const itemIds = cart?.items?.map(item => item.id) || [];
            set({ cart, isLoading: false, selectedItemIds: new Set(itemIds) });
        } catch (error: any) {
            if (error.response?.status === 404) {
                set({ cart: null, isLoading: false, selectedItemIds: new Set() });
            } else {
                set({ error: error.message, isLoading: false });
            }
        }
    },

    addToCart: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await orderService.addToCart(data);
            const cart = await orderService.getCart();
            set({ cart, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            if (error.response?.status === 409) {
                throw { isConflict: true, ...error };
            }
            throw error;
        }
    },

    updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            await orderService.updateCartItem(itemId, { quantity });

            const cart = await orderService.getCart();
            set({ cart, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
            await orderService.removeCartItem(itemId);

            try {
                const cart = await orderService.getCart();
                set({ cart, isLoading: false });
            } catch (error: any) {
                if (error.response?.status === 404) {
                    set({ cart: null, isLoading: false });
                } else {
                    throw error;
                }
            }
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
            await orderService.clearCart();
            set({ cart: null, isLoading: false, selectedItemIds: new Set() });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    removeBulkItems: async (itemIds: string[]) => {
        if (itemIds.length === 0) return;

        set({ isLoading: true, error: null });
        try {
            // Remove items sequentially
            for (const itemId of itemIds) {
                await orderService.removeCartItem(itemId);
            }

            // Fetch updated cart
            try {
                const cart = await orderService.getCart();
                // Remove deleted items from selection
                const newSelection = new Set(get().selectedItemIds);
                itemIds.forEach(id => newSelection.delete(id));
                set({ cart, isLoading: false, selectedItemIds: newSelection });
            } catch (error: any) {
                if (error.response?.status === 404) {
                    set({ cart: null, isLoading: false, selectedItemIds: new Set() });
                } else {
                    throw error;
                }
            }
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    toggleItemSelection: (itemId: string) => {
        const selectedItemIds = new Set(get().selectedItemIds);
        if (selectedItemIds.has(itemId)) {
            selectedItemIds.delete(itemId);
        } else {
            selectedItemIds.add(itemId);
        }
        set({ selectedItemIds });
    },

    selectAllItems: () => {
        const cart = get().cart;
        if (!cart?.items) return;
        const allItemIds = new Set(cart.items.map(item => item.id));
        set({ selectedItemIds: allItemIds });
    },

    deselectAllItems: () => {
        set({ selectedItemIds: new Set() });
    },

    clearSelection: () => {
        set({ selectedItemIds: new Set() });
    },

    subtotal: () => {
        return get().cart?.subtotal || 0;
    },

    total: () => {
        return get().cart?.total || 0;
    },

    itemCount: () => {
        const cart = get().cart;
        if (!cart?.items || !Array.isArray(cart.items)) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    selectedSubtotal: () => {
        const cart = get().cart;
        const selectedIds = get().selectedItemIds;
        if (!cart?.items || !Array.isArray(cart.items)) return 0;

        return cart.items
            .filter(item => selectedIds.has(item.id))
            .reduce((sum, item) => sum + (Number(item.unit_price) * item.quantity), 0);
    },

    selectedTotal: () => {
        return get().selectedSubtotal();
    },

    selectedCount: () => {
        const cart = get().cart;
        const selectedIds = get().selectedItemIds;
        if (!cart?.items || !Array.isArray(cart.items)) return 0;

        return cart.items
            .filter(item => selectedIds.has(item.id))
            .reduce((sum, item) => sum + item.quantity, 0);
    },
}));
