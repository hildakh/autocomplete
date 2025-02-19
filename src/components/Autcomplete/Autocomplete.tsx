import React, { useCallback, useEffect, useState } from 'react';
import { Suggestion } from '../../heplers/types';
import './Autocomplete.styles.scss'
import { mockData } from '../../heplers/mockData';
import { findMatches } from '../../heplers/findMatches';

const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setQuery(event.target.value);
  }

  const findSuggestions = useCallback(() => {

    if (query.length > 0) {
      const matchingItems = findMatches(query, mockData);

      setSuggestions(matchingItems)
    } else {
      setSuggestions([])
    }

  }, [query])

  useEffect(() => {
    findSuggestions();
  }, [findSuggestions, query])

  // const handleKeyDown = () => {
  //   // to handle selecting suggestions
  // }

  const displaySuggestions = (text: string) => {
    const textParts = text.split(new RegExp(`(${query})`, 'gi'));
    console.log('parts', textParts)
    return textParts.map((part, index) => (
      <span key={`${part}-${index}`} className={part.toLowerCase() === query.toLowerCase() ? 'highlight' : ''}>
        {part}
      </span>
    ))
  }

  return (
    <div className="autocomplete">
      <div className="autocomplete__wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          // onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className='autocomplete__input'
        />
        <ul className='autocomplete__suggestions'>
          {
            suggestions.map((item: Suggestion) => (
              <li className='autocomplete__suggestion'>
                {
                  displaySuggestions(item.word)
                }
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default Autocomplete;