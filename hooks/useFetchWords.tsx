import { useCallback, startTransition } from "react";
import { fetchRandomWord } from "@/index";
import { type WordObject } from "@/types";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type UseFetchWordsProps = {
  userId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setWords: React.Dispatch<React.SetStateAction<WordObject[]>>;
};

const useFetchWords = ({ setLoading, setWords, userId }: UseFetchWordsProps) => { 
  const createWordsMutation = useMutation(api.words.createWordMutation);

  const handleCreateWords = useCallback(
    async ({ word }: { word: WordObject }) => {
      if (!userId) return;
      try {
        await createWordsMutation({
          ...word,
          userId,
        });
      } catch (error) {
        console.error("Failed to save word:", error);
      }
    },
    [userId, createWordsMutation]
  );

  const fetchWord = useCallback(async () => {
    startTransition(() => {
      setLoading(true);
    }); 

    try {
      const newWord = await fetchRandomWord({ setWords, setLoading });
      if (newWord) {
        await handleCreateWords({ word: newWord });
      }
    } catch (error) {
      console.error("Failed to fetch word:", error);
      setLoading(false);
    }
  }, [setWords, setLoading, handleCreateWords]);

  return { fetchWord };
};

export default useFetchWords;
