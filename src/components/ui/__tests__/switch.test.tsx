import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Switch } from '../switch';

/**
 * Switch Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Switch component (Radix UI primitive)
 * - No mocking of project components or Radix primitives
 * - Radix UI Switch works well in jsdom environment
 */

describe('Switch Component', () => {
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
    it('should render a switch element', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('should be unchecked by default', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should apply custom className', () => {
      render(<Switch className='custom-switch-class' />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('custom-switch-class');
    });

    it('should have default styling classes', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('inline-flex', 'shrink-0', 'w-full', 'rounded-full');
    });

    it('should have proper data-slot attribute', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-slot', 'switch');
    });

    it('should render the thumb element', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      const thumb = switchElement.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should toggle checked state on click', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should handle controlled checked state', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} onCheckedChange={() => {}} />);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should call onCheckedChange when clicked', () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should call onCheckedChange with correct value when toggling', () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      // First click - check
      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);

      // Second click - uncheck
      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should not trigger onChange when disabled', () => {
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should respect disabled prop', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should not change state when disabled and clicked', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      const initialState = switchElement.getAttribute('data-state');

      fireEvent.click(switchElement);

      expect(switchElement).toHaveAttribute('data-state', initialState);
    });

    it('should allow disabling a checked switch', () => {
      render(<Switch checked={true} disabled onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attribute', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('should have correct aria-checked attribute', () => {
      render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should update aria-checked when state changes', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true} onCheckedChange={() => {}} />);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('should support aria-label', () => {
      render(<Switch aria-label='Toggle notifications' />);

      const switchElement = screen.getByRole('switch', { name: 'Toggle notifications' });
      expect(switchElement).toBeInTheDocument();
    });

    it('should support aria-labelledby', () => {
      render(
        <div>
          <label id='switch-label'>Enable feature</label>
          <Switch aria-labelledby='switch-label' />
        </div>
      );

      const switchElement = screen.getByRole('switch', { name: 'Enable feature' });
      expect(switchElement).toBeInTheDocument();
    });

    it('should have data-disabled when disabled', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled', '');
    });
  });

  describe('Keyboard Interaction', () => {
    it('should be focusable via keyboard', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      expect(switchElement).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(
        <div>
          <button>Before</button>
          <Switch disabled />
          <button>After</button>
        </div>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();

      // Disabled elements are typically skipped in tab order
      expect(switchElement).toHaveAttribute('data-disabled', '');
    });
  });

  describe('Data Attributes', () => {
    it('should have data-state="unchecked" when unchecked', () => {
      render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should have data-state="checked" when checked', () => {
      render(<Switch checked={true} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should update data-state when toggled', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should have data-disabled when disabled', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled', '');
    });

    it('should apply state-dependent styles via data attributes', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');

      // Unchecked state classes
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-lightgray');

      // Checked state classes
      rerender(<Switch checked={true} onCheckedChange={() => {}} />);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveClass('data-[state=checked]:bg-green');
    });
  });

  describe('Form Integration', () => {
    it('should support value attribute', () => {
      render(<Switch value='on' />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('value', 'on');
    });

    it('should work with forms when given name and value', () => {
      render(
        <form>
          <Switch name='notifications' value='enabled' />
        </form>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling', () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      fireEvent.click(switchElement);
      fireEvent.click(switchElement);
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should handle defaultChecked prop', () => {
      render(<Switch defaultChecked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should work without onCheckedChange handler', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');

      expect(() => {
        fireEvent.click(switchElement);
      }).not.toThrow();

      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should preserve other props passed to the component', () => {
      render(<Switch data-testid='custom-switch' id='my-switch' />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-testid', 'custom-switch');
      expect(switchElement).toHaveAttribute('id', 'my-switch');
    });
  });

  describe('Styling Variations', () => {
    it('should support peer class for label styling', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('peer');
    });

    it('should apply shadow and transition classes', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('shadow-xs', 'transition-all');
    });

    it('should have outline-none class', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('outline-none');
    });
  });

  describe('Thumb Behavior', () => {
    it('should position thumb based on state', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} />);

      const switchElement = screen.getByRole('switch');
      const thumb = switchElement.querySelector('[data-slot="switch-thumb"]');

      // Unchecked position
      expect(thumb).toHaveClass('data-[state=unchecked]:ml-0.75');

      // Checked position
      rerender(<Switch checked={true} onCheckedChange={() => {}} />);
      expect(thumb).toHaveClass('data-[state=checked]:ml-[calc(100%-2.6rem)]');
    });

    it('should apply thumb styling', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      const thumb = switchElement.querySelector('[data-slot="switch-thumb"]');

      expect(thumb).toHaveClass(
        'bg-white',
        'rounded-full',
        'transition-all',
        'pointer-events-none'
      );
    });

    it('should make thumb non-interactive', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      const thumb = switchElement.querySelector('[data-slot="switch-thumb"]');

      expect(thumb).toHaveClass('pointer-events-none');
    });
  });
});
