import { useState, useCallback } from "react";

const useNotificationsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggleModal,
    closeModal,
  }
};

export default useNotificationsModal;
