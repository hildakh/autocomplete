export interface Suggestion {
  word: string;
  score: number
}

export interface Option {
  id: string;
  label: string;
}

export type DebouncedFunction = {
  // Function type signature
  (searchQuery: string): void;
  cancel: () => void;
}