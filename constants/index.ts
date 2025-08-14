export const sidebarItems = [
  {
    name: "Words",
    href: "/words",
  },

  {
    name: "Quiz",
    href: "/quiz",
  },
  {
    name: "Essay",
    href: "/essay",
  },
];

export const quizItems = [
  {
    name: "Listening",
    href: "quiz/listening",
  },

  {
    name: "Words",
    href: "/quiz/words",
  },
];

export const LEVELS: Record<string, string> = {
  pre_school: "Pre-school",
  elementary: "Elementary",
  middle_school: "Middle School",
  high_school: "High School",
  college: "College",
};

export const MAX_RETRIES = 3; // Prevent infinite retries
export const MAX_RESPONSE_RETRY = 2;
export const GRADE = 5
export const MAX_WORDS_OPTION = 4