import { create } from "zustand";
import orderService from "@/services/api/order.service";
import { Cart, AddToCartRequest } from "@/types/api/order";

interface CartState {
    cart: Cart | null;
    isDrawerOpen: boolean;
    isLoading: boolean;
    error: string | null;

    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    setDrawerOpen: (open: boolean) => void;

    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartRequest) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;

    get subtotal(): number;
    get itemCount(): number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isDrawerOpen: false,
    isLoading: false,
    error: null,

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const cart = await orderService.getCart();
            set({ cart, isLoading: false });
        } catch (error: any) {
            if (error.response?.status === 404) {
                set({ cart: null, isLoading: false });
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
            set({ cart: null, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    get subtotal() {
        return get().cart?.subtotal || 0;
    },

    get itemCount() {
        const cart = get().cart;
        if (!cart?.items || !Array.isArray(cart.items)) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },
}));
