"use client";
import React, { useCallback } from "react";
import { type CheckboxItemProps } from "@/types/index";

const useDisableWordsSlide = ({
  setWordItems,
  slideIndex,
}: {
  setWordItems: React.Dispatch<React.SetStateAction<CheckboxItemProps[][]>>;
  slideIndex: number;
}) => {
  const disableItem = useCallback(() => {
    setWordItems((prev) => {
      // Create a new copy of the previous state
      const newItems = [...prev];

      // Get the current slide's items
      const currentSlideItems = [...newItems[slideIndex]];

      // Modify the last item's `disabled` property
      const lastItemIndex = currentSlideItems.length - 1;

      currentSlideItems[lastItemIndex] = {
        ...currentSlideItems[lastItemIndex],
        disabled: true,
      };

      // Update the slide with the modified items
      newItems[slideIndex] = currentSlideItems;

      return newItems;
    });
  }, [slideIndex]); // Only dependency is slideIndex

  return disableItem;
};

export default useDisableWordsSlide;
