import React, { useEffect, useState } from "react";
import { useChatData } from "./useChatData";
import { useChatMutations } from "@/app/(root)/chat/hooks/useChatMutations";

const useUserTyping = ({
  message,
}: {
  message: string;
}) => {
  const { userId, userSenderId, userTakerId } = useChatData();
  const { setTypingMutation } = useChatMutations();
  const [isTyping, setTyping] = useState(false);
  const userSenderTyping = userId === userSenderId;

  useEffect(() => {
    if (message) {
      setTyping(true);
    }

    const timer = setTimeout(() => {
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer); // cancel old timer when message changes
  }, [message]);

  const handleSetUserTyping = async ({ isTyping }: { isTyping: boolean }) => {
    await setTypingMutation({
      takerId: userTakerId!,
      giverId: userSenderId!,
      userSenderTyping: userSenderTyping && isTyping ? true : false,
      userTakerTyping: !userSenderTyping && isTyping ? true : false,
    });
  };

  useEffect(() => {
    handleSetUserTyping({ isTyping });
  }, [isTyping]);

  return {};
};

export default useUserTyping;
