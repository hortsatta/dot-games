import { useCallback } from 'react';

type Result = {
  debounce: (delay?: number) => Promise<boolean>;
};

export const useDebounce = (): Result => {
  const debounce = useCallback(
    (delay = 500) =>
      new Promise<boolean>((resolve) => {
        const id = setTimeout(() => {
          clearTimeout(id);
          resolve(true);
        }, delay);
      }),
    [],
  );

  return { debounce };
};
