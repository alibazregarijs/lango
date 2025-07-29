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