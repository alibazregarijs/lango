import React, { useState } from "react";

const useClosingModal = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Modal is closing - trigger re-render
      setRefreshKey((prev) => prev + 1);
    }
  };
  return {
    handleOpenChange,
    refreshKey,
  };
};

export default useClosingModal;
