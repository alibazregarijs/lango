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