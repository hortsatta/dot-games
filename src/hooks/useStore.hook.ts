import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  isDarkMode: boolean;
  currentUserId?: string | null;
  setIsDarkMode: (by: boolean) => void;
  setCurrentUserId: (by: string | null) => void;
};

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: true,
        currentUserId: undefined,
        setIsDarkMode: (by: boolean) => set({ isDarkMode: by }),
        setCurrentUserId: (by: string | null) => set({ currentUserId: by }),
      }),
      {
        name: 'main-storage',
        partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      },
    ),
  ),
);
