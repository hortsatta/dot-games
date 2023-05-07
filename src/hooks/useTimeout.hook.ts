import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

type Result = {
  timeoutFn: (params: any) => Promise<boolean>;
};

export const useTimeout = (
  callback: (params?: any) => any,
  delay = 500,
): Result => {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const timeoutFn = useCallback(
    (params: any) =>
      new Promise<boolean>((resolve) => {
        const id = setTimeout(async () => {
          const result =
            savedCallback.current instanceof Promise
              ? await savedCallback.current(params)
              : savedCallback.current(params);

          clearTimeout(id);
          resolve(result);
        }, delay);
      }),
    [delay],
  );

  return { timeoutFn };
};
