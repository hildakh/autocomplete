import { Suggestion } from "./types";

export const findMatches = (query: string, options: Suggestion[]) => {
  const matchingItems = options.filter((item: Suggestion) => {
    const lowerCasedItemText = item.word.toLowerCase();
    return lowerCasedItemText.includes(query.toLowerCase());
  });

  return matchingItems;
}