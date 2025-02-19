import { render, fireEvent, waitFor, screen, createEvent } from '@testing-library/react';
import { SuggestionItem } from "./SuggestionItem"

const mockItem = {
  id: '1',
  label: 'test'
};

const mockProps = {
  item: mockItem,
  isHighlighted: false,
  searchQuery: 'te',
  handleSelect: jest.fn()
}

const renderSuggestionItem = () => {
  render(
    <SuggestionItem
      {...mockProps}
    />
  );
};

describe('SuggestionItem', () => {
  it('highlights matching text when searchQuery matches', () => {
    renderSuggestionItem();

    expect(screen.getByText('te')).toHaveClass('suggestion__text-highlight');
    expect(screen.getByText('st')).toBeInTheDocument();
  });

  it('calls handleSelect on click', async () => {
    renderSuggestionItem();

    const item = screen.getByTestId(`suggestion-item-${mockProps.item.id}`);
    await fireEvent.click(item);

    expect(mockProps.handleSelect).toHaveBeenCalledWith(mockItem);
  });

  it('prevents default on mouseDown', () => {
    renderSuggestionItem();

    const item = screen.getByTestId(`suggestion-item-${mockProps.item.id}`);
    const event = createEvent.mouseDown(item);

    event.preventDefault = jest.fn();
    fireEvent(item, event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});