export type WordObject = {
  definition: {
    definition: string;
    example: string;
  }[];
  word: string;
  type: {
    partOfSpeech: string;
  }[];
  audioWordUrl: {
    audio: string;
  }[];
  meaningCount: number;
};

export type essayProps = {
  essay: string;
  level: string;
  userId: string;
  grade: string;
  grammer: string;
  suggestion: string;
};

export interface WordCarouselSlideProps {
  words: WordObject[];
  slideIndex: number;
  loading: boolean;
  speak: () => void;
  title?: React.ReactNode;
}

export type SentenceObjectProps = {
  userId: string;
  level: string;
  grade: string;
  sentence: string;
  answer: string;
};

export type DialogProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export type DialogContentProps = {
  children: React.ReactNode;
};

export type DialogHeaderProps = {
  children: React.ReactNode;
  title: string;
  loading?: boolean;
};

export type DialogBodyProps = {
  label: string;
  children: React.ReactNode;
};
