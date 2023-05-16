import type { StateCreator } from 'zustand';
import type { CartSlice } from './cart.store';

export type CoreSlice = {
  isDarkMode: boolean;
  currentUserId?: string | null;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setCurrentUserId: (currentUserId: string | null) => void;
};

export const createCoreSlice: StateCreator<
  CoreSlice & CartSlice,
  [],
  [],
  CoreSlice
> = (set) => ({
  isDarkMode: true,
  currentUserId: undefined,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  setCurrentUserId: (currentUserId: string | null) => set({ currentUserId }),
});
