import React from 'react';
import { Option } from '../../helpers/types';
import './SuggestionItem.scss';

interface Props {
  item: Option;
  isHighlighted: boolean;
  searchQuery: string;
  handleSelect: (item: Option) => void
}

export const SuggestionItem: React.FC<Props> = ({
  item,
  isHighlighted,
  searchQuery,
  handleSelect,
}) => {
  const displaySuggestions = (text: string) => {
    const textParts = text.split(new RegExp(`(${searchQuery})`, 'gi'));

    return textParts.map((part, index) => (
      <span
        key={`${part}-${index}`}
        className={part.toLowerCase() === searchQuery?.toLowerCase() ? 'suggestion__text-highlight' : ''}
      >
        {part}
      </span>
    ));
  }

  return (
    <li
      className={`suggestion ${isHighlighted ? 'suggestion--highlight' : ''}`}
      // To avoid default focus and allow using arrow keys right after clicking an item
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => handleSelect(item)}
      data-testid={`suggestion-item-${item.id}`}
    >
      {displaySuggestions(item.label)}
    </li>
  );
};