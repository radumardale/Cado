import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from '../radio-group';

/**
 * RadioGroup Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL RadioGroup component (Radix UI primitive)
 * - No mocking of project components or Radix primitives
 * - Radix UI works well in jsdom environment
 */

describe('RadioGroup Component', () => {
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
    it('should render a radio group', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' />
          <RadioGroupItem value='option2' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
    });

    it('should render multiple radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
          <RadioGroupItem value='option3' aria-label='Option 3' />
        </RadioGroup>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('should apply custom className to RadioGroup', () => {
      render(
        <RadioGroup className='custom-class'>
          <RadioGroupItem value='test' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('custom-class');
    });

    it('should have default grid styling', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='test' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('grid', 'gap-3');
    });

    it('should have proper data-slot attributes', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='test' aria-label='Test' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      const radio = screen.getByRole('radio');

      expect(radiogroup).toHaveAttribute('data-slot', 'radio-group');
      expect(radio).toHaveAttribute('data-slot', 'radio-group-item');
    });
  });

  describe('User Interaction', () => {
    it('should select a radio option on click', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      fireEvent.click(radio1);

      expect(radio1).toBeChecked();
    });

    it('should allow only one selection at a time', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      fireEvent.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      fireEvent.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('should call onValueChange when selection changes', () => {
      const handleChange = vi.fn();

      render(
        <RadioGroup onValueChange={handleChange}>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      fireEvent.click(radio2);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    // Note: Arrow key navigation is handled internally by Radix
    // and requires full browser environment to test properly
  });

  describe('Controlled State', () => {
    it('should support controlled value', () => {
      const { rerender } = render(
        <RadioGroup value='option1' onValueChange={() => {}}>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      expect(radio1).toBeChecked();

      rerender(
        <RadioGroup value='option2' onValueChange={() => {}}>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      expect(radio2).toBeChecked();
      expect(radio1).not.toBeChecked();
    });

    it('should support defaultValue for uncontrolled state', () => {
      render(
        <RadioGroup defaultValue='option2'>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      expect(radio2).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('should disable entire RadioGroup', () => {
      render(
        <RadioGroup disabled>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it('should disable individual radio item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' disabled />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toBeDisabled();
      expect(radio2).not.toBeDisabled();
    });

    it('should not select disabled radio on click', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' disabled />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      fireEvent.click(radio);

      expect(radio).not.toBeChecked();
    });

    // Note: Keyboard navigation with disabled items is handled internally by Radix

    it('should have disabled styling', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' disabled />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      expect(radio.className).toContain('disabled:opacity-50');
      expect(radio.className).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('Error States', () => {
    it('should apply error styles when aria-invalid is true', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' aria-invalid={true} />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('aria-invalid', 'true');
      expect(radio.className).toContain('aria-invalid:border-destructive');
    });

    it('should have ring styles for error state', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' aria-invalid={true} />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      expect(radio.className).toContain('aria-invalid:ring-destructive/20');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      radio.focus();

      expect(radio).toHaveFocus();
    });

    it('should support aria-label', () => {
      render(
        <RadioGroup aria-label='Payment method'>
          <RadioGroupItem value='card' aria-label='Credit Card' />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Payment method')).toBeInTheDocument();
      expect(screen.getByLabelText('Credit Card')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(
        <RadioGroup aria-describedby='radio-description'>
          <RadioGroupItem value='option1' aria-label='Option 1' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-describedby', 'radio-description');
    });

    it('should have focus-visible ring styles', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      expect(radio.className).toContain('focus-visible:ring-ring/50');
      expect(radio.className).toContain('focus-visible:border-ring');
    });

    it('should announce checked state to screen readers', () => {
      render(
        <RadioGroup defaultValue='option2'>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toHaveAttribute('aria-checked', 'false');
      expect(radio2).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Label Association', () => {
    it('should work with label elements', () => {
      render(
        <RadioGroup>
          <div>
            <RadioGroupItem value='option1' id='opt1' />
            <label htmlFor='opt1'>First Option</label>
          </div>
          <div>
            <RadioGroupItem value='option2' id='opt2' />
            <label htmlFor='opt2'>Second Option</label>
          </div>
        </RadioGroup>
      );

      const label1 = screen.getByText('First Option');
      const radio1 = screen.getByLabelText('First Option');

      fireEvent.click(label1);
      expect(radio1).toBeChecked();
    });
  });

  describe('Form Integration', () => {
    it('should work in a form context', () => {
      const handleSubmit = vi.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData.get('payment');
      });

      render(
        <form onSubmit={handleSubmit}>
          <RadioGroup name='payment'>
            <RadioGroupItem value='card' aria-label='Card' />
            <RadioGroupItem value='cash' aria-label='Cash' />
          </RadioGroup>
          <button type='submit'>Submit</button>
        </form>
      );

      const cardRadio = screen.getByLabelText('Card');
      const submitButton = screen.getByRole('button');

      fireEvent.click(cardRadio);
      expect(cardRadio).toBeChecked();

      fireEvent.click(submitButton);
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should support required attribute', () => {
      render(
        <RadioGroup required>
          <RadioGroupItem value='option1' aria-label='Option 1' />
        </RadioGroup>
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeRequired();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid selection changes', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
          <RadioGroupItem value='option3' aria-label='Option 3' />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');
      const radio3 = screen.getByLabelText('Option 3');

      fireEvent.click(radio1);
      fireEvent.click(radio2);
      fireEvent.click(radio3);

      expect(radio3).toBeChecked();
      expect(radio1).not.toBeChecked();
      expect(radio2).not.toBeChecked();
    });

    it('should maintain state when re-rendered', () => {
      const { rerender } = render(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      fireEvent.click(radio2);
      expect(radio2).toBeChecked();

      rerender(
        <RadioGroup>
          <RadioGroupItem value='option1' aria-label='Option 1' />
          <RadioGroupItem value='option2' aria-label='Option 2' />
        </RadioGroup>
      );

      expect(radio2).toBeChecked();
    });

    it('should handle empty RadioGroup gracefully', () => {
      render(<RadioGroup />);

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
      expect(radiogroup).toBeEmptyDOMElement();
    });
  });
});
