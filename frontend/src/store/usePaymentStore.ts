import { create } from "zustand";

export type PaymentMethod = {
    id: string;
    label: string;
    detail: string;
    type: "card" | "apple" | "paypal" | "google";
};

interface PaymentState {
    methods: PaymentMethod[];
    selectedMethodId: string;

    addCard: (payload: { label: string; last4: string }) => void;
    selectMethod: (id: string) => void;
}

const initial: PaymentMethod[] = [
    { id: "p1", label: "**** **** **** 43", detail: "", type: "card" },
    { id: "p2", label: "Apple Pay", detail: "", type: "apple" },
    { id: "p3", label: "Paypal", detail: "", type: "paypal" },
    { id: "p4", label: "Google Pay", detail: "", type: "google" },
];

export const usePaymentStore = create<PaymentState>((set) => ({
    methods: initial,
    selectedMethodId: initial[0].id,

    addCard: ({ label, last4 }) =>
        set((state) => {
            const id = `p_${Date.now()}`;
            const method: PaymentMethod = { id, label: `${label} **** ${last4}`, detail: "", type: "card" };
            return { methods: [method, ...state.methods], selectedMethodId: id };
        }),

    selectMethod: (id) => set({ selectedMethodId: id }),
}));
