import React, { useRef } from "react";
import { useCallback } from "react";

const useLastMessagDetection = ({
  onScroll,
  setIsAtBottom,
}: {
  onScroll: () => void;
  setIsAtBottom: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              onScroll(); // Run onScroll when last message becomes visible
              setIsAtBottom(true);
            }
          },
          {
            threshold: 0.5,
            rootMargin: "0px 0px -50px 0px", // Adjust this if needed
          }
        );

        observerRef.current.observe(node);
      }
    },
    [onScroll]
  );
  return lastMessageRef;
};

export default useLastMessagDetection;
