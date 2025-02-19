import { render, fireEvent, screen } from '@testing-library/react';
import { Autocomplete } from "./Autocomplete";

const mockProps = {
  error: '',
  handleClear: jest.fn(),
  handleInputChange: jest.fn(),
  handleKeyDown: jest.fn(),
  handleSelect: jest.fn(),
  highlightedItemIndex: -1,
  isLoading: false,
  options: [
    { id: '1', label: 'test' },
    { id: '2', label: 'testing' }
  ],
  query: ''
};

const renderComponent = (overrides?: Partial<typeof mockProps>) => {
  render(<Autocomplete {...mockProps} {...overrides} />);
};

describe('Autocomplete', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with correct props', () => {
    renderComponent();

    const input = screen.getByTestId('autocomplete-input');

    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('placeholder', 'Type to search...');
  });

  it('shows error message when error prop is set', () => {
    renderComponent({ error: 'Test error' });

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderComponent({ isLoading: true });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('suggestions-list')).not.toBeInTheDocument();
  });

  it('renders suggestions list with highlighted item', () => {
    renderComponent({ highlightedItemIndex: 0 });

    const firstItem = screen.getByTestId('suggestion-item-1');
    expect(firstItem).toHaveClass('suggestion--highlight');

  });

  it('shows clear button when query exists', () => {
    renderComponent({ query: 'test' });

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    expect(mockProps.handleClear).toHaveBeenCalled();
  });

  it('calls handleInputChange when typing', () => {
    renderComponent();

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockProps.handleInputChange).toHaveBeenCalled();
  });

  it('calls handleKeyDown on keyboard events', () => {
    renderComponent();

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(mockProps.handleKeyDown).toHaveBeenCalled();
  });

  it('calls handleSelect when clicking suggestion', () => {
    renderComponent();

    const suggestion = screen.getByTestId('suggestion-item-1');
    fireEvent.click(suggestion);

    expect(mockProps.handleSelect).toHaveBeenCalledWith(mockProps.options[0]);
  });

  it('hides suggestions list when no options', () => {
    renderComponent({ options: [] });

    expect(screen.queryByTestId('suggestions-list')).toBeEmptyDOMElement();
  });
});
