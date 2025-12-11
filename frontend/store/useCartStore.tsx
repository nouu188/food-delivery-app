import { create } from 'zustand';

export type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
    image: any;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQty: (id: number, qty: number) => void;
    clearCart: () => void;
    getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const exist = state.items.find((i) => i.id === item.id);
            if (exist) {
                return {
                    items: state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)),
                };
            }
            return { items: [...state.items, { ...item, qty: 1 }] };
        }),
    removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    updateQty: (id, qty) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
    clearCart: () => set({ items: [] }),
    getTotal: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        return subtotal + 5 + 3; // tax + delivery
    },
}));
