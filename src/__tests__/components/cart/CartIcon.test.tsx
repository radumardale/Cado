import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import {
  renderWithProviders,
  screen,
  fireEvent,
  createMockCartItem,
} from '@/__tests__/helpers/componentTestUtils';
import CartIcon from '@/components/header/CartIcon';

// Mock the cart store
const mockSetCartOpen = vi.fn();
const mockIsOpen = false;

vi.mock('@/states/CartState', () => ({
  useCartStore: <T,>(
    selector: (state: { isOpen: boolean; setOpen: typeof mockSetCartOpen }) => T
  ) => {
    const state = {
      isOpen: mockIsOpen,
      setOpen: mockSetCartOpen,
    };
    return selector(state);
  },
}));

// Mock Lenis
vi.mock('lenis/react', () => ({
  useLenis: () => ({
    stop: vi.fn(),
    start: vi.fn(),
  }),
}));

// Mock localStorage hook
const mockLocalStorageValue = vi.fn();
const mockSetLocalStorageValue = vi.fn();

vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [mockLocalStorageValue(), mockSetLocalStorageValue],
}));

describe('CartIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorageValue.mockReturnValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  // Core Rendering Tests
  describe('Core Rendering', () => {
    it('should render shopping bag icon', () => {
      renderWithProviders(<CartIcon />);

      // Shopping bag icon should be visible
      const icon = screen.getByRole('button');
      expect(icon).toBeInTheDocument();
    });

    it('should not display badge when cart is empty', () => {
      mockLocalStorageValue.mockReturnValue([]);

      renderWithProviders(<CartIcon />);

      // Badge should not be visible
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });

    it('should display badge with item count when cart has items', () => {
      const mockItems = [createMockCartItem('PROD001', 2), createMockCartItem('PROD002', 1)];
      mockLocalStorageValue.mockReturnValue(mockItems);

      renderWithProviders(<CartIcon />);

      // Badge should show number of items (not total quantity)
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });

    it('should display correct count for single item', () => {
      const mockItems = [createMockCartItem('PROD001', 5)];
      mockLocalStorageValue.mockReturnValue(mockItems);

      renderWithProviders(<CartIcon />);

      // Badge should show 1 (one item type)
      const badge = screen.getByText('1');
      expect(badge).toBeInTheDocument();
    });
  });

  // Interaction Tests
  describe('User Interactions', () => {
    it('should open cart sidebar when icon is clicked', () => {
      renderWithProviders(<CartIcon />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockSetCartOpen).toHaveBeenCalledWith(true);
    });

    it('should handle multiple clicks', () => {
      renderWithProviders(<CartIcon />);

      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Component may call setCartOpen on mount (useEffect), so check it was called at least 3 times
      expect(mockSetCartOpen).toHaveBeenCalled();
      expect(mockSetCartOpen.mock.calls.length).toBeGreaterThanOrEqual(3);
      expect(mockSetCartOpen).toHaveBeenCalledWith(true);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle large item count', () => {
      const mockItems = Array.from({ length: 99 }, (_, i) => createMockCartItem(`PROD${i}`, 1));
      mockLocalStorageValue.mockReturnValue(mockItems);

      renderWithProviders(<CartIcon />);

      // Should display large number
      const badge = screen.getByText('99');
      expect(badge).toBeInTheDocument();
    });

    it('should handle cart with single item multiple times', () => {
      const mockItems = [createMockCartItem('PROD001', 100)];
      mockLocalStorageValue.mockReturnValue(mockItems);

      renderWithProviders(<CartIcon />);

      // Badge shows unique items (1), not total quantity (100)
      const badge = screen.getByText('1');
      expect(badge).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      renderWithProviders(<CartIcon />);

      const button = screen.getByRole('button');

      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have proper button role', () => {
      renderWithProviders(<CartIcon />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('class');
    });
  });
});
