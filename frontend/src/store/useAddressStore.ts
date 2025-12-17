import { create } from "zustand";

export type Address = {
    id: string;
    label: string;
    address: string;
};

interface AddressState {
    addresses: Address[];
    selectedAddressId: string;

    addAddress: (address: Omit<Address, "id">) => void;
    selectAddress: (id: string) => void;
}

const initial: Address[] = [
    { id: "a1", label: "My home", address: "778 Locust View Drive Oakland, CA" },
    { id: "a2", label: "My Office", address: "778 Locust View Drive Oakland, CA" },
    { id: "a3", label: "Parent's House", address: "778 Locust View Drive Oakland, CA" },
];

export const useAddressStore = create<AddressState>((set) => ({
    addresses: initial,
    selectedAddressId: initial[0].id,

    addAddress: (address) =>
        set((state) => {
            const id = `a_${Date.now()}`;
            return {
                addresses: [...state.addresses, { ...address, id }],
                selectedAddressId: id,
            };
        }),

    selectAddress: (id) => set({ selectedAddressId: id }),
}));
