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

export type selectedWordProps = {
  _id: Id<"words">;
  _creationTime: number;
  definition?: {
    definition: string;
    example: string;
  }[];
  word: string;
  type?: {
    partOfSpeech: string;
  }[];
  audioWordUrl?: {
    audio: string;
  }[];
  userId: string;
  meaningCount: number;
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
  disabled: boolean;
};

export interface CarouselDemoProps {
  onNextClick: () => void;
  onPrevClick: () => void;
  onStopClick?: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hasSendRequest?: React.MutableRefObject<boolean>;
}

interface ListeningCarouselSlideProps {
  handleIconClick: () => void;
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  answer: string;
  disabled: boolean;
}

export type DialogProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
};

export type CheckboxItemProps = {
  id: string;
  label: string;
  disabled: boolean;
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
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export type selectedWordProps = selectedWordProps[] | undefined;
