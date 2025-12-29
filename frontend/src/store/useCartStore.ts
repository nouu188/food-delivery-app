import { create } from 'zustand';
import orderService from '@/services/api/order.service';
import voucherService from '@/services/api/voucher.service';
import { Cart, AddToCartRequest } from '@/types/api/order';
import { AppliedVoucher, VoucherValidationResponse } from '@/types/api/voucher';

interface CartState {
    cart: Cart | null;
    isDrawerOpen: boolean;
    isLoading: boolean;
    error: string | null;
    selectedItemIds: Set<string>;

    appliedVoucher: AppliedVoucher | null;
    voucherValidating: boolean;
    voucherError: string | null;

    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    setDrawerOpen: (open: boolean) => void;

    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartRequest) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    removeBulkItems: (itemIds: string[], silent?: boolean) => Promise<void>;

    toggleItemSelection: (itemId: string) => void;
    selectAllItems: () => void;
    deselectAllItems: () => void;
    clearSelection: () => void;

    applyVoucher: (code: string, restaurantId: string) => Promise<VoucherValidationResponse>;
    removeVoucher: () => void;
    getDiscountedTotal: () => number;

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

    appliedVoucher: null,
    voucherValidating: false,
    voucherError: null,

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const cart = await orderService.getCart();

            const itemIds = cart?.items?.map((item) => item.id) || [];
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
            set({ isLoading: false });

            const { useToastStore } = await import('@/store/useToastStore');

            // Handle menu item unavailable
            if (error.response?.status === 400) {
                useToastStore.getState().show({
                    type: 'error',
                    title: 'Cannot Add to Cart',
                    message:
                        error.response?.data?.message ||
                        'This menu item is currently unavailable. Please try another item.',
                });
                return;
            }

            // Handle restaurant conflict
            if (error.response?.status === 409) {
                useToastStore.getState().show({
                    type: 'error',
                    title: 'Cannot Add to Cart',
                    message:
                        'You can only add items from one restaurant. Please clear your cart to order from a different restaurant.',
                });
                throw { isConflict: true, ...error };
            }

            // Handle other errors
            useToastStore.getState().show({
                type: 'error',
                title: 'Cannot Add to Cart',
                message: error.response?.data?.message || 'An error occurred. Please try again.',
            });

            set({ error: error.message });
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

    removeBulkItems: async (itemIds: string[], silent: boolean = false) => {
        if (itemIds.length === 0) return;

        set({ isLoading: true, error: null });
        try {
            // Remove items sequentially
            for (const itemId of itemIds) {
                await orderService.removeCartItem(itemId, silent);
            }

            // Fetch updated cart
            try {
                const cart = await orderService.getCart();
                // Remove deleted items from selection
                const newSelection = new Set(get().selectedItemIds);
                itemIds.forEach((id) => newSelection.delete(id));
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
        const allItemIds = new Set(cart.items.map((item) => item.id));
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
            .filter((item) => selectedIds.has(item.id))
            .reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
    },

    selectedTotal: () => {
        return get().selectedSubtotal();
    },

    selectedCount: () => {
        const cart = get().cart;
        const selectedIds = get().selectedItemIds;
        if (!cart?.items || !Array.isArray(cart.items)) return 0;

        return cart.items.filter((item) => selectedIds.has(item.id)).reduce((sum, item) => sum + item.quantity, 0);
    },

    applyVoucher: async (code: string, restaurantId: string) => {
        set({ voucherValidating: true, voucherError: null });
        try {
            const orderAmount = get().total();

            const validation = await voucherService.validateVoucher({
                code,
                restaurant_id: restaurantId,
                order_amount: orderAmount,
            });

            if (
                validation.is_valid &&
                validation.voucher &&
                validation.discount_amount !== undefined &&
                validation.final_amount !== undefined
            ) {
                set({
                    appliedVoucher: {
                        voucher: validation.voucher,
                        discount_amount: validation.discount_amount,
                        final_amount: validation.final_amount,
                    },
                    voucherValidating: false,
                    voucherError: null,
                });
            } else {
                set({
                    appliedVoucher: null,
                    voucherValidating: false,
                    voucherError: validation.message || 'Invalid voucher',
                });
            }

            return validation;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to validate voucher';
            set({
                appliedVoucher: null,
                voucherValidating: false,
                voucherError: errorMessage,
            });
            throw error;
        }
    },

    removeVoucher: () => {
        set({
            appliedVoucher: null,
            voucherError: null,
        });
    },

    getDiscountedTotal: () => {
        const total = get().total();
        const appliedVoucher = get().appliedVoucher;

        if (appliedVoucher) {
            return total - appliedVoucher.discount_amount;
        }

        return total;
    },
}));
