import { useCallback } from "react";

const useSpeek = ({ text , slideIndex }: { text: string; slideIndex?: number }) => {
  const speak = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }, [text, slideIndex]);

  return { speak };
};

export default useSpeek;
 