import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Textarea } from '../textarea';

/**
 * Textarea Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Textarea component
 * - No mocking of project components
 * - Only test utilities from @testing-library
 */

describe('Textarea Component', () => {
  beforeEach(() => {
    // No mocks needed - testing real component
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render a textarea element', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render with placeholder text', () => {
      render(<Textarea placeholder='Enter your message' />);

      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Textarea className='custom-class' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('should have default styling classes', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      // Check for some key default classes from the component
      expect(textarea).toHaveClass('flex', 'min-h-16', 'w-full', 'rounded-md', 'border');
    });

    it('should have resize-none class by default', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });
  });

  describe('User Interaction', () => {
    it('should handle text input', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Hello World' } });

      expect(textarea).toHaveValue('Hello World');
    });

    it('should handle multi-line text', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      const multiLineText = 'Line 1\nLine 2\nLine 3';
      fireEvent.change(textarea, { target: { value: multiLineText } });

      expect(textarea).toHaveValue(multiLineText);
    });

    it('should handle value changes', () => {
      render(<Textarea defaultValue='Initial text' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('Initial text');

      fireEvent.change(textarea, { target: { value: 'Updated text' } });

      expect(textarea).toHaveValue('Updated text');
    });

    it('should maintain line breaks', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      const textWithBreaks = 'First paragraph\n\nSecond paragraph\n\nThird paragraph';
      fireEvent.change(textarea, { target: { value: textWithBreaks } });

      expect(textarea).toHaveValue(textWithBreaks);
    });
  });

  describe('Error States', () => {
    it('should apply error styles when aria-invalid is true', () => {
      render(<Textarea aria-invalid={true} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      // Check for error border class
      expect(textarea.className).toContain('aria-invalid:border-destructive');
    });

    it('should not have error styles when aria-invalid is false', () => {
      render(<Textarea aria-invalid={false} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'false');
    });

    it('should display shake animation class for errors', () => {
      render(<Textarea aria-invalid={true} />);

      const textarea = screen.getByRole('textbox');
      // The component has aria-invalid:animate-shake class
      expect(textarea.className).toContain('aria-invalid:animate-shake');
    });

    it('should have ring styles for error state', () => {
      render(<Textarea aria-invalid={true} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('aria-invalid:ring-destructive/20');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when prop is set', () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should have disabled attribute preventing user interaction', () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole('textbox');
      // Verify disabled attribute is set (browser handles interaction blocking)
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('disabled');
    });

    it('should have disabled styling', () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('disabled:opacity-50');
      expect(textarea.className).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('should have proper data-slot attribute', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('data-slot', 'textarea');
    });

    it('should support aria-label', () => {
      render(<Textarea aria-label='Message' />);

      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Textarea aria-describedby='textarea-description' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'textarea-description');
    });

    it('should be focusable', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      textarea.focus();

      expect(textarea).toHaveFocus();
    });

    it('should lose focus on blur', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      textarea.focus();
      expect(textarea).toHaveFocus();

      textarea.blur();
      expect(textarea).not.toHaveFocus();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as uncontrolled with defaultValue', () => {
      render(<Textarea defaultValue='Default text' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('Default text');
    });

    it('should work as controlled with value prop', () => {
      const { rerender } = render(<Textarea value='Controlled' onChange={() => {}} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('Controlled');

      // Rerender with new value
      rerender(<Textarea value='Updated' onChange={() => {}} />);
      expect(textarea).toHaveValue('Updated');
    });
  });

  describe('Additional Attributes', () => {
    it('should support maxLength', () => {
      render(<Textarea maxLength={100} />);

      const textarea = screen.getByRole('textbox');
      // Browser enforces maxLength
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('should support readOnly', () => {
      render(<Textarea readOnly value='Read only' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readOnly');
      expect(textarea).toHaveValue('Read only');
    });

    it('should support required attribute', () => {
      render(<Textarea required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('should support name attribute', () => {
      render(<Textarea name='message' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'message');
    });

    it('should support rows attribute', () => {
      render(<Textarea rows={5} />);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.rows).toBe(5);
    });

    it('should support cols attribute', () => {
      render(<Textarea cols={50} />);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.cols).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Textarea value='' onChange={() => {}} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(5000);
      render(<Textarea />);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: longText } });

      expect(textarea.value).toHaveLength(5000);
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-={}[]|:";\'<>?,./';
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: specialText } });

      expect(textarea).toHaveValue(specialText);
    });

    it('should handle unicode characters', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '你好世界 🌍 Привет мир' } });

      expect(textarea).toHaveValue('你好世界 🌍 Привет мир');
    });

    it('should handle tabs and special whitespace', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      const textWithWhitespace = 'Line 1\t\tWith tabs\nLine 2   With spaces';
      fireEvent.change(textarea, { target: { value: textWithWhitespace } });

      expect(textarea).toHaveValue(textWithWhitespace);
    });
  });

  describe('Form Integration', () => {
    it('should submit value in a form', () => {
      const handleSubmit = vi.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData.get('message');
      });

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name='message' defaultValue='Test message' />
          <button type='submit'>Submit</button>
        </form>
      );

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Updated message' } });

      const submitButton = screen.getByRole('button');
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
