import { create } from "zustand";

interface FavoritesState {
    favoriteRestaurantIds: string[];

    setFavoriteRestaurantIds: (ids: string[]) => void;
    addFavoriteRestaurantId: (id: string) => void;
    removeFavoriteRestaurantId: (id: string) => void;
    clearFavorites: () => void;

    isFavoriteRestaurant: (id: string) => boolean;
}

const uniq = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favoriteRestaurantIds: [],

    setFavoriteRestaurantIds: (ids) => set({ favoriteRestaurantIds: uniq(ids) }),

    addFavoriteRestaurantId: (id) =>
        set((state) => {
            if (!id) return state;
            if (state.favoriteRestaurantIds.includes(id)) return state;
            return { favoriteRestaurantIds: [...state.favoriteRestaurantIds, id] };
        }),

    removeFavoriteRestaurantId: (id) =>
        set((state) => ({
            favoriteRestaurantIds: state.favoriteRestaurantIds.filter((existingId) => existingId !== id),
        })),

    clearFavorites: () => set({ favoriteRestaurantIds: [] }),

    isFavoriteRestaurant: (id) => get().favoriteRestaurantIds.includes(id),
}));
