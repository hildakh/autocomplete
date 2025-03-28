export interface Suggestion {
  word: string;
  score: number
}

export interface Option {
  id: string;
  label: string;
}

export type DebouncedFunction = {
  (query: string): void;
  cancel: () => void;
}