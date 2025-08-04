import React from 'react'
import { useEffect } from 'react'

const useFetchItems = ({setLoading , slideIndexRef , handleFetchItems , level , hasMount}:{setLoading: React.Dispatch<React.SetStateAction<boolean>>, slideIndexRef: React.MutableRefObject<number>, handleFetchItems: () => Promise<void>,level:string,hasMount:React.MutableRefObject<boolean>}) => {

  useEffect(() => {
      if (hasMount.current) {
        const run = async () => {
          setLoading(true);
          slideIndexRef.current += 1;
          await handleFetchItems();
          setLoading(false);
        };
  
        run();
      } else {
        hasMount.current = true;
      }
    }, [level]); // for getting new question and word items if user change level
  
    useEffect(() => {
      hasMount.current = true;
      handleFetchItems();
    }, []); // fetch question and word items on first mount up
}

export default useFetchItems