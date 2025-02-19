import React, { useCallback, useEffect, useState } from 'react';
import { Suggestion } from '../../heplers/types';
import './Autocomplete.styles.scss'
import { mockData } from '../../heplers/mockData';

const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setQuery(event.target.value);
  }

  const findSuggestions = useCallback(() => {

    if (query.length > 0) {
      const matchingItems = mockData.filter((item: Suggestion) => {
        const lowerCasedItemText = item.word.toLowerCase();
        return lowerCasedItemText.includes(query.toLowerCase());
      });

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
                {item.word}
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default Autocomplete;