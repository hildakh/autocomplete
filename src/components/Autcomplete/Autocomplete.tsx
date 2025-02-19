import React, { useCallback, useEffect, useState } from 'react';
import { Suggestion, Option } from '../../heplers/types';
import './Autocomplete.styles.scss'
import { mockData } from '../../heplers/mockData';
import { findMatches } from '../../heplers/findMatches';

const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Option[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setQuery(event.target.value);
  }

  const fetchOptions = async (query: string): Promise<Option[]> => {
    if (!query) return [];

    try {
      const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);

      const data = await response.json();
      const transformedData: Option[] = data.map((item: Suggestion) => ({
        id: `${item.word}-${item.score}`,
        label: item.word
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchData = useCallback(async (query: string) => {
    const matchingItems = await fetchOptions(query);
    setSuggestions(matchingItems);
  }, []);

  useEffect(() => {
    fetchData(query)
  }, [query, fetchData])

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
            suggestions.map((item: Option) => (
              <li
                key={item.id}
                className='autocomplete__suggestion'
              >
                {
                  displaySuggestions(item.label)
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