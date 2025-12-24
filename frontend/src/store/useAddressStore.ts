import { create } from 'zustand';
import userService from '@/services/api/user.service';
import { UserAddress, CreateAddressRequest, UpdateAddressRequest } from '@/types/api/user';

interface AddressState {
  addresses: UserAddress[];
  selectedAddressId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: CreateAddressRequest) => Promise<void>;
  updateAddress: (id: string, data: UpdateAddressRequest) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setSelectedAddress: (id: string) => void;

  get selectedAddress(): UserAddress | null;
  get defaultAddress(): UserAddress | null;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await userService.getAddresses();
      set({ addresses, isLoading: false });

      const defaultAddr = addresses.find((a) => a.is_default);
      if (defaultAddr && !get().selectedAddressId) {
        set({ selectedAddressId: defaultAddr.id });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAddress: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newAddress = await userService.createAddress(data);
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAddress: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAddress = await userService.updateAddress(id, data);
      set((state) => ({
        addresses: state.addresses.map((a) => (a.id === id ? updatedAddress : a)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteAddress(id);
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
        selectedAddressId: state.selectedAddressId === id ? null : state.selectedAddressId,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setSelectedAddress: (id) => set({ selectedAddressId: id }),

  get selectedAddress() {
    const id = get().selectedAddressId;
    return get().addresses.find((a) => a.id === id) || null;
  },

  get defaultAddress() {
    return get().addresses.find((a) => a.is_default) || null;
  },
}));
