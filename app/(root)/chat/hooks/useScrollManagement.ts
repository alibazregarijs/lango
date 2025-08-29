import { useEffect, useCallback, RefObject } from "react";

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

export const useScrollToBottom = ({messagesEndRef}:{messagesEndRef: RefObject<HTMLDivElement> | null}) => {
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
