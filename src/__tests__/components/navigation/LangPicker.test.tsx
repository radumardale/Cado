import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import LangPicker from '@/components/header/LangPicker';

describe('LangPicker', () => {
  let setLanguageMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setLanguageMock = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Core Rendering', () => {
    it('should display the current language', () => {
      render(<LangPicker language='ro' setLanguage={setLanguageMock} />);

      expect(screen.getByText('Română')).toBeInTheDocument();
    });

    it('should display Russian when locale is ru', () => {
      render(<LangPicker language='ru' setLanguage={setLanguageMock} />);

      expect(screen.getByText('Русский')).toBeInTheDocument();
    });

    it('should display English when locale is en', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should render with chevron icon', () => {
      const { container } = render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      const chevron = container.querySelector('svg');
      expect(chevron).toBeInTheDocument();
    });
  });

  describe('Dropdown Toggle', () => {
    it('should not show dropdown menu initially', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Dropdown should not be visible initially
      const dropdown = screen.queryByText('Română');
      expect(dropdown).not.toBeInTheDocument();
    });

    it('should open dropdown when clicked', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Click to open dropdown
      const button = screen.getByText('English');
      fireEvent.click(button);

      // All language options should be visible
      expect(screen.getAllByText('Română')).toHaveLength(1);
      expect(screen.getAllByText('Русский')).toHaveLength(1);
      expect(screen.getAllByText('English')).toHaveLength(2); // Button text + dropdown option
    });

    it('should close dropdown when clicked again', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Open dropdown
      const button = screen.getByText('English');
      fireEvent.click(button);

      // Verify dropdown is open
      expect(screen.getAllByText('Română')).toHaveLength(1);

      // Close dropdown
      fireEvent.click(button);

      // Dropdown should be closed (only the button text remains)
      expect(screen.queryByText('Română')).not.toBeInTheDocument();
    });

    it('should rotate chevron when dropdown is open', () => {
      const { container } = render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      const chevron = container.querySelector('svg');
      expect(chevron).not.toHaveClass('rotate-180');

      // Open dropdown
      const button = screen.getByText('English');
      fireEvent.click(button);

      // Chevron should be rotated
      expect(chevron).toHaveClass('rotate-180');
    });
  });

  describe('Language Selection', () => {
    it('should call setLanguage with "ro" when Română is clicked', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Open dropdown
      fireEvent.click(screen.getByText('English'));

      // Click Romanian option
      const romanaOption = screen.getAllByText('Română')[0];
      fireEvent.click(romanaOption);

      expect(setLanguageMock).toHaveBeenCalledWith('ro');
    });

    it('should call setLanguage with "ru" when Русский is clicked', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Open dropdown
      fireEvent.click(screen.getByText('English'));

      // Click Russian option
      const russianOption = screen.getByText('Русский');
      fireEvent.click(russianOption);

      expect(setLanguageMock).toHaveBeenCalledWith('ru');
    });

    it('should call setLanguage with "en" when English is clicked', () => {
      render(<LangPicker language='ro' setLanguage={setLanguageMock} />);

      // Open dropdown
      fireEvent.click(screen.getByText('Română'));

      // Click English option
      const englishOptions = screen.getAllByText('English');
      fireEvent.click(englishOptions[0]);

      expect(setLanguageMock).toHaveBeenCalledWith('en');
    });
  });

  describe('Click Outside Behavior', () => {
    it('should close dropdown when clicking outside', () => {
      render(
        <div>
          <LangPicker language='en' setLanguage={setLanguageMock} />
          <div data-testid='outside'>Outside element</div>
        </div>
      );

      // Open dropdown
      fireEvent.click(screen.getByText('English'));
      expect(screen.getAllByText('Română')).toHaveLength(1);

      // Click outside
      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);

      // Dropdown should be closed
      expect(screen.queryByText('Română')).not.toBeInTheDocument();
    });

    it('should not close dropdown when clicking inside', () => {
      render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Open dropdown
      const button = screen.getByText('English');
      fireEvent.click(button);

      // Click inside the dropdown
      const romanaOption = screen.getAllByText('Română')[0];
      fireEvent.mouseDown(romanaOption);

      // Dropdown should still be open after mousedown (before click)
      expect(screen.getAllByText('Română')).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown locale gracefully', () => {
      // TypeScript would prevent this, but test runtime behavior
      render(<LangPicker language={'unknown' as LocaleCode} setLanguage={setLanguageMock} />);

      // Should display the unknown locale as-is
      expect(screen.getByText('unknown')).toBeInTheDocument();
    });

    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<LangPicker language='en' setLanguage={setLanguageMock} />);

      // Open dropdown to activate event listener
      fireEvent.click(screen.getByText('English'));

      // Unmount component
      unmount();

      // Verify cleanup
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
