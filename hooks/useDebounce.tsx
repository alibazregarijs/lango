import React, { useCallback, useEffect } from "react";

const useDebounce = <T extends unknown[]>({
  callback,
  delay,
}: {
  callback: (...args: T) => void;
  delay: number;
}) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default useDebounce;
 