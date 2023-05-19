import type { StateCreator } from 'zustand';
import type { CartSlice } from './cart.store';
import type { WishListSlice } from './wish-list.store';

export type CoreSlice = {
  isDarkMode: boolean;
  showLogin: boolean;
  currentUserId?: string | null;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setShowLogin: (showLogin: boolean) => void;
  setCurrentUserId: (currentUserId: string | null) => void;
};

export const createCoreSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice,
  [],
  [],
  CoreSlice
> = (set) => ({
  isDarkMode: true,
  showLogin: false,
  currentUserId: undefined,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  setShowLogin: (showLogin: boolean) => set({ showLogin }),
  setCurrentUserId: (currentUserId: string | null) => set({ currentUserId }),
});
