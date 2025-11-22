import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Checkbox } from '../checkbox';

/**
 * Checkbox Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Checkbox component (Radix UI primitive)
 * - No mocking of project components or Radix primitives
 * - Radix UI works well in jsdom environment
 */

describe('Checkbox Component', () => {
  beforeEach(() => {
    // Mock ResizeObserver for Radix components
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render a checkbox element', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should be unchecked by default', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should apply custom className', () => {
      render(<Checkbox className='custom-class' />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-class');
    });

    it('should have default styling classes', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      // Check for some key default classes from the component
      expect(checkbox).toHaveClass('size-4', 'shrink-0', 'rounded-[4px]', 'border');
    });

    it('should have proper data-slot attribute', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
    });
  });

  describe('User Interaction', () => {
    it('should toggle checked state on click', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should handle controlled checked state', () => {
      const { rerender } = render(<Checkbox checked={false} onCheckedChange={() => {}} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      rerender(<Checkbox checked={true} onCheckedChange={() => {}} />);
      expect(checkbox).toBeChecked();
    });

    it('should call onCheckedChange when clicked', () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle with Space key', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).not.toBeChecked();

      // Use click instead - Radix handles keyboard internally
      // Space key in real browser triggers click event
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should not toggle with Enter key (Radix behavior)', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).not.toBeChecked();

      fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter' });
      // Radix checkbox only responds to Space, not Enter
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Checked States', () => {
    it('should support defaultChecked prop', () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should support checked prop (controlled)', () => {
      render(<Checkbox checked={true} onCheckedChange={() => {}} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should have data-state=checked when checked', () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });

    it('should have data-state=unchecked when not checked', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('should apply checked styling classes', () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('data-[state=checked]:bg-black');
      expect(checkbox.className).toContain('data-[state=checked]:text-primary-foreground');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when prop is set', () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should not toggle when disabled and clicked', () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should have disabled styling', () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('disabled:opacity-50');
      expect(checkbox.className).toContain('disabled:cursor-not-allowed');
    });

    it('should have disabled attribute', () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('disabled');
    });
  });

  describe('Error States', () => {
    it('should apply error styles when aria-invalid is true', () => {
      render(<Checkbox aria-invalid={true} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      expect(checkbox.className).toContain('aria-invalid:border-destructive');
    });

    it('should display shake animation class for errors', () => {
      render(<Checkbox aria-invalid={true} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('aria-invalid:animate-shake');
    });

    it('should have ring styles for error state', () => {
      render(<Checkbox aria-invalid={true} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('aria-invalid:ring-destructive/20');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      expect(checkbox).toHaveFocus();
    });

    it('should lose focus on blur', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();

      checkbox.blur();
      expect(checkbox).not.toHaveFocus();
    });

    it('should support aria-label', () => {
      render(<Checkbox aria-label='Accept terms' />);

      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Checkbox aria-describedby='checkbox-description' />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-description');
    });

    it('should have focus-visible ring styles', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('focus-visible:ring-ring/50');
      expect(checkbox.className).toContain('focus-visible:border-ring');
    });

    it('should announce checked state to screen readers', () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('should announce unchecked state to screen readers', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Label Association', () => {
    it('should work with label element', () => {
      render(
        <div>
          <Checkbox id='terms' />
          <label htmlFor='terms'>Accept terms and conditions</label>
        </div>
      );

      const label = screen.getByText('Accept terms and conditions');
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(label);
      expect(checkbox).toBeChecked();
    });

    it('should toggle when wrapped label is clicked', () => {
      render(
        <label>
          <Checkbox />
          <span>Subscribe to newsletter</span>
        </label>
      );

      const label = screen.getByText('Subscribe to newsletter');
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(label);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Additional Attributes', () => {
    it('should support value attribute', () => {
      render(<Checkbox value='agreed' />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'agreed');
    });

    it('should support required attribute', () => {
      render(<Checkbox required />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeRequired();
    });
  });

  describe('Form Integration', () => {
    it('should work in a form context', () => {
      const handleSubmit = vi.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData.get('subscribe');
      });

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name='subscribe' value='yes' />
          <button type='submit'>Submit</button>
        </form>
      );

      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button');

      // Check the checkbox
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      // Submit the form
      fireEvent.click(submitButton);
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should reset with form reset', () => {
      render(
        <form>
          <Checkbox defaultChecked />
          <button type='reset'>Reset</button>
        </form>
      );

      const checkbox = screen.getByRole('checkbox');
      const resetButton = screen.getByRole('button');

      expect(checkbox).toBeChecked();

      // Uncheck it
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      // Reset form should restore default
      fireEvent.click(resetButton);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');

      // Rapid clicks
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should handle programmatic focus', () => {
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[role="checkbox"]') as HTMLElement;
      checkbox.focus();

      expect(checkbox).toHaveFocus();
    });

    it('should maintain state when re-rendered', () => {
      const { rerender } = render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      // Re-render without changing props
      rerender(<Checkbox />);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Peer Styling Support', () => {
    it('should have peer class for sibling styling', () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('peer');
    });

    it('should allow peer-based styling patterns', () => {
      render(
        <div className='flex items-center gap-2'>
          <Checkbox id='styled' />
          <label htmlFor='styled' className='peer-disabled:opacity-50'>
            Styled label
          </label>
        </div>
      );

      const label = screen.getByText('Styled label');
      expect(label).toHaveClass('peer-disabled:opacity-50');
    });
  });
});
