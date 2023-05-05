import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  isDarkMode: boolean;
};

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: true,
        setIsDarkMode: (by: boolean) => set(() => ({ isDarkMode: by })),
      }),
      {
        name: 'main-storage',
      },
    ),
  ),
);
