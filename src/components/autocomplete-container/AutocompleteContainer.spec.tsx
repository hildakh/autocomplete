import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { AutocompleteContainer } from './AutocompleteContainer';
import { mockSuggestions, mockOptions } from '../../helpers/mockData';

jest.mock('../../helpers/debounce', () => ({
  debounce: (fn: (...args: any[]) => void) => {
    let timeoutId: NodeJS.Timeout;
    const debouncedFn = (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), 300);
    };
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  }
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockSuggestions)
  })
) as jest.Mock;

const renderComponent = () => {
  render(<AutocompleteContainer />);
};

describe('AutocompleteContainer', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSuggestions)
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('debounces API calls', async () => {
    jest.useFakeTimers();
    renderComponent();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      const input = screen.getByTestId('autocomplete-input');
      fireEvent.change(input, { target: { value: 't' } });
      fireEvent.change(input, { target: { value: 'te' } });
      fireEvent.change(input, { target: { value: 'tes' } });

      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('clears suggestions on empty input', async () => {
    jest.useFakeTimers();
    renderComponent();

    const input = screen.getByTestId('autocomplete-input');

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.change(input, { target: { value: 'testing' } });
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId(`suggestion-item-${mockOptions[0].id}`)).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByTestId('suggestions-list')).toBeEmptyDOMElement();
    });
  });

  it('highlights options using arrow keys', async () => {
    jest.useFakeTimers();
    renderComponent();
    const input = screen.getByTestId('autocomplete-input');

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
      jest.runAllTimers();
    });

    const firstItemQuery = `suggestion-item-${mockOptions[0].id}`;
    const secondItemQuery = `suggestion-item-${mockOptions[1].id}`;

    await waitFor(() => {
      expect(screen.getByTestId(firstItemQuery)).toBeInTheDocument();
    });

    // Navigate using input element
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // First item
    expect(screen.getByTestId(firstItemQuery)).toHaveClass('suggestion--highlight');

    fireEvent.keyDown(input, { key: 'ArrowDown' }); // Second item
    expect(screen.getByTestId(secondItemQuery)).toHaveClass('suggestion--highlight');
  });

  it('selects option on Enter key', async () => {
    jest.useFakeTimers();
    renderComponent();
    const input = screen.getByTestId('autocomplete-input');

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
      jest.runAllTimers();
    });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveValue(mockOptions[0].label);
  });
});
