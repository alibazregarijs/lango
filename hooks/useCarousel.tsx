// hooks/useCarousel.ts
import { useRef, useState } from "react";

export function useCarousel<T>(initialItems: T[] = []) {
  const slideIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const handleNext = (fetchMore?: () => Promise<void>) => {
    slideIndexRef.current += 1;

    if (slideIndexRef.current === items.length && fetchMore) {
      setLoading(true);
      fetchMore().finally(() => setLoading(false));
    } else {
      forceUpdate((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (slideIndexRef.current > 0) {
      slideIndexRef.current -= 1;
      forceUpdate((prev) => prev + 1);
    }
  };

  return {
    slideIndex: slideIndexRef.current,
    items,
    setItems,
    loading,
    setLoading,
    handleNext,
    handlePrev,
    canGoPrev: slideIndexRef.current > 0,
    canGoNext: !loading,
    slideIndexRef: slideIndexRef,
  };
}
