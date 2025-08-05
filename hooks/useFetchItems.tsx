import React from "react";
import { useEffect } from "react";

const useFetchItems = ({
  setLoading,
  slideIndexRef,
  handleFetchItems,
  level,
  hasMount,
  itemsLength
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  slideIndexRef: React.MutableRefObject<number>;
  handleFetchItems: () => Promise<void>;
  level: string;
  hasMount: React.MutableRefObject<boolean>;
  itemsLength: number;
}) => {
  useEffect(() => {
    if (hasMount.current) {
      const run = async () => {
        try {
          setLoading(true);
     
          if(slideIndexRef.current === itemsLength){
            slideIndexRef.current += 1
          }
          else{
            slideIndexRef.current = itemsLength
          }
          await handleFetchItems();
        } catch (error) {
          console.error("Error fetching items:", error);
          // You might want to add additional error handling here
          // For example: setErrorState(error.message) if you have error state
        } finally {
          setLoading(false);
        }
      };

      run();
    } else {
      hasMount.current = true;
    }
  }, [level]); // for getting new question and word items if user change level

  useEffect(() => {
    const fetchInitialItems = async () => {
      try {
        hasMount.current = true;
        await handleFetchItems();
      } catch (error) {
        console.error("Error fetching initial items:", error);
        // Handle initial fetch error if needed
      }
    };

    fetchInitialItems();
  }, []); // fetch question and word items on first mount up
};

export default useFetchItems;
