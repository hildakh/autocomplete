import React, { } from 'react';
import { Option } from '../../helpers/types';
import { SuggestionItem } from '../suggestionItem/SuggestionItem';
import './Autocomplete.scss'

interface Props {
  error: string;
  handleClear: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSelect: (item: Option) => void;
  highlightedItemIndex: number;
  isLoading: boolean;
  options: Option[];
  query: string;
}

export const Autocomplete: React.FC<Props> = ({
  error,
  handleClear,
  handleInputChange,
  handleKeyDown,
  handleSelect,
  highlightedItemIndex,
  isLoading,
  options,
  query,
}: Props) => {
  return (
    <div className='autocomplete'>
      <div className='autocomplete__wrapper'>
        {error && <h3 className='autocomplete__error'>{error}</h3>}
        <div className="autocomplete__input-group">
          <input
            aria-label='Search'
            type='text'
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Type to search...'
            className='autocomplete__input'
            data-testid='autocomplete-input'
          />
          {query && (
            <button
              className='autocomplete__clear-button'
              onClick={handleClear}
            >&#x2716;</button>
          )}
        </div>
        {isLoading && <div className='autocomplete__loader'>Loading...</div>}
        {!isLoading && (
          <ul
            className='autocomplete__suggestions'
            data-testid='suggestions-list'
          >
            {
              options?.map((item: Option, index) => (
                <SuggestionItem
                  key={item.id}
                  item={item}
                  isHighlighted={index === highlightedItemIndex}
                  searchQuery={query}
                  handleSelect={handleSelect}
                />
              ))
            }
          </ul>
        )}
      </div>
    </div>
  );
};
