import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Suggestion, Option, DebouncedFunction } from '../../helpers/types';
import { debounce } from '../../helpers/debounce';
import { sanitizeInput } from '../../helpers/sanitizeInput';
import { Autocomplete } from '../autcomplete/Autocomplete';

export const AutocompleteContainer: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number>(-1);

  const fetchData = useCallback(async (query: string) => {
    if (!query) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const sanitizedText = sanitizeInput(query);
      const response = await fetch(`https://api.datamuse.com/sug?s=${sanitizedText}`);

      const data: Suggestion[] = await response.json();
      const transformedData: Option[] = data.map((item: Suggestion) => ({
        id: `${item.word}-${item.score}`,
        label: item.word
      }));

      setOptions(transformedData);

      if (options.length === 0) {
        setError('No matching words found. Try another search.');
      };
    } catch (error) {
      setError('No matching words found. Try another search.');
    } finally {
      setIsLoading(false);
    }
  }, [options.length]);

  const debouncedFetch = useMemo((): DebouncedFunction =>
    debounce((item: string) => fetchData(item), 300),
    [fetchData]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  }

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      setHighlightedItemIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (event.key === 'ArrowUp') {
      setHighlightedItemIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (event.key === 'Enter' && highlightedItemIndex >= 0) {
      event.preventDefault();
      handleSelect(options[highlightedItemIndex]);
    }
  };

  const handleSelect = (option: Option): void => {
    setQuery(option.label);
    setHighlightedItemIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setHighlightedItemIndex(-1);
    setError('');
  };

  useEffect(() => {
    if (query) {
      debouncedFetch(query);
    } else {
      setOptions([]);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  return (
    <Autocomplete
      error={error}
      handleClear={handleClear}
      handleInputChange={handleInputChange}
      handleKeyDown={handleKeyDown}
      handleSelect={handleSelect}
      highlightedItemIndex={highlightedItemIndex}
      isLoading={isLoading}
      options={options}
      query={query}
    />
  );
};
