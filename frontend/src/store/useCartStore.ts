import { create } from "zustand";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    qty: number;
    image?: any;
    imageUri?: string;
};

interface CartState {
    items: CartItem[];
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;

    addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    removeItem: (id: string) => void;
    clear: () => void;

    subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isDrawerOpen: false,

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

    addItem: (item, qty = 1) =>
        set((state) => {
            const existing = state.items.find((x) => x.id === item.id);
            if (existing) {
                return {
                    items: state.items.map((x) => (x.id === item.id ? { ...x, qty: x.qty + qty } : x)),
                } as Partial<CartState>;
            }
            return { items: [{ ...item, qty }, ...state.items] } as Partial<CartState>;
        }),

    increment: (id) =>
        set((state) => ({ items: state.items.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) })),

    decrement: (id) =>
        set((state) => ({
            items: state.items.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)).filter(Boolean),
        })),

    removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

    clear: () => set({ items: [] }),

    subtotal: () => get().items.reduce((sum, x) => sum + x.price * x.qty, 0),
}));
