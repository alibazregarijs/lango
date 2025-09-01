import { useEffect, useCallback, RefObject, useState } from "react";
import { useChatState } from "@/context/ChatStateContext";

export const useAutoScrollOnMount = (
  isMount: boolean,
  scrollToBottom: () => void
) => {
  useEffect(() => {
    if (isMount) {
      scrollToBottom();
    }
  }, [isMount, scrollToBottom]);
};

export const useScrollToBottom = () => {
  const { messagesEndRef } = useChatState()
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messagesEndRef]);

  return { scrollToBottom };
};

export const useScrollDetection = () => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null
  );

  const checkScrollPosition = useCallback(() => {
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Consider user at bottom if within 50px of the bottom
    setIsAtBottom(distanceFromBottom-10 < 150);
  }, [scrollContainer]);

  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  // Set up the scroll container and event listener
  useEffect(() => {
    const container = document.querySelector(".detect_scroll");
    if (container) {
      setScrollContainer(container as HTMLDivElement);
      container.addEventListener("scroll", handleScroll);

      // Initial check
      checkScrollPosition();

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll, checkScrollPosition]);

  return { isAtBottom, checkScrollPosition , setIsAtBottom };
};
