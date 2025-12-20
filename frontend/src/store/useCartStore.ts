import { create } from "zustand";
import orderService from "@/services/api/order.service";
import { Cart, AddToCartRequest } from "@/types/api/order";

interface CartState {
    cart: Cart | null;
    isDrawerOpen: boolean;
    isLoading: boolean;
    error: string | null;

    // Drawer actions
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    setDrawerOpen: (open: boolean) => void;

    // Cart actions
    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartRequest) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;

    // Computed
    get subtotal(): number;
    get itemCount(): number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isDrawerOpen: false,
    isLoading: false,
    error: null,

    // Drawer actions
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),

    // Cart actions
    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const cart = await orderService.getCart();
            set({ cart, isLoading: false });
        } catch (error: any) {
            // If cart doesn't exist (404), that's ok
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
            const updatedCart = await orderService.addToCart(data);
            set({ cart: updatedCart, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            const updatedItem = await orderService.updateCartItem(itemId, { quantity });
            set((state) => {
                if (state.cart) {
                    const items = state.cart.items.map((item) =>
                        item.id === itemId ? updatedItem : item
                    );
                    return {
                        cart: { ...state.cart, items },
                        isLoading: false
                    };
                }
                return { isLoading: false };
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
            await orderService.removeCartItem(itemId);
            set((state) => {
                if (state.cart) {
                    const items = state.cart.items.filter((item) => item.id !== itemId);
                    return {
                        cart: { ...state.cart, items },
                        isLoading: false
                    };
                }
                return { isLoading: false };
            });
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

    // Computed properties
    get subtotal() {
        return get().cart?.subtotal || 0;
    },

    get itemCount() {
        return get().cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    },
}));
