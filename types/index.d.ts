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
  isProcessing: boolean;
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
  children?: React.ReactNode;
  title: string;
  loading?: boolean;
};

export type DialogBodyProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export type TopPlayerProps = {
  userId: string;
  gmail: string;
  username: string;
  imageUrl: string;
  totalScore: number;
};

export type ListeningQuizProps = {
  _id: Id<"ListeningQuiz">;
  _creationTime: number;
  grade?: string;
  answer?: string;
  disabled?: boolean;
  sentence: string;
  level: string;
  userId: string;
};

export type WordQuizProps = {
  _id: Id<"WordsQuiz">;
  _creationTime: number;
  grade?: string;
  isCorrect?: boolean;
  correctWord?: string;
  question?: string;
  userId: string;
  level: string;
};

export type allUsersProps = {
  _id: Id<"users">;
  _creationTime: number;
  name?: string | undefined;
  email: string;
  imageUrl: string;
  clerkId: string;
  lastSeen: number;
  online: boolean;
};

export type Message = {
  _id: Id<"messages">;
  _creationTime: number;
  replyToId?: string | undefined;
  read: boolean;
  roomId: string;
  senderId: string;
  content: string;
  userSenderImageUrl?: string;
  userSenderName?: string;
  accept?: boolean;
  routeUrl?: string;
  userTakerId?: string;
  userSenderId?: string;
  text?: string;
};

export type UseUserSelectionOptionsProps = {
  onReset: () => void;
  onModalClose?: () => void;
};

export type NavigateChatResultProps =
  | {
      success: boolean;
      routeUrl: string;
      message: string;
    }
  | {
      success: boolean;
      routeUrl?: undefined;
      message?: undefined;
    };

export type EditMessageModalProps = {
  open: boolean;
  editMessage: string;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onEditMessageChange: (message: string) => void;
  onSave: () => void;
};

export type MessageListProps = {
  onActionSelect: (value: string, messageId: string) => void;
};

export type MessageItemProps = {
  message: any;
  userId: string;
  userImageUrl: string;
  imageUrl: string | null;
  onActionSelect: (value: string, messageId: string) => void;
}

export type MessageInputProps = {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export type Suggestion = string | { username: string; imageUrl: string };

export type MessagesQuery = Message[] | undefined;

export type selectedWordProps = selectedWordProps[] | undefined;
