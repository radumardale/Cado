import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Input } from '../input';

/**
 * Input Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Input component
 * - No mocking of project components
 * - Only test utilities from @testing-library
 */

describe('Input Component', () => {
  beforeEach(() => {
    // No mocks needed - testing real component
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render an input element', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should render with placeholder text', () => {
      render(<Input placeholder='Enter your name' />);

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('should be a textbox by default (text input)', () => {
      render(<Input />);

      // Input without explicit type attribute is treated as text input
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with specified type', () => {
      const { container } = render(<Input type='email' />);

      const input = container.querySelector('input[type="email"]');
      expect(input).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Input className='custom-class' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should have default styling classes', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      // Check for some key default classes from the component
      expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border');
    });
  });

  describe('User Interaction', () => {
    it('should handle text input', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Hello World' } });

      expect(input).toHaveValue('Hello World');
    });

    it('should handle value changes', () => {
      render(<Input defaultValue='Initial' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Initial');

      fireEvent.change(input, { target: { value: 'Updated' } });

      expect(input).toHaveValue('Updated');
    });

    it('should handle numeric input for type="number"', () => {
      render(<Input type='number' />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '123' } });

      expect(input).toHaveValue(123);
    });

    it('should handle password input', () => {
      const { container } = render(<Input type='password' />);

      const input = container.querySelector('input[type="password"]')!;
      fireEvent.change(input, { target: { value: 'secret123' } });

      expect(input).toHaveValue('secret123');
    });

    it('should handle email input', () => {
      const { container } = render(<Input type='email' />);

      const input = container.querySelector('input[type="email"]')!;
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      expect(input).toHaveValue('test@example.com');
    });
  });

  describe('Error States', () => {
    it('should apply error styles when aria-invalid is true', () => {
      render(<Input aria-invalid={true} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      // Check for error border class
      expect(input.className).toContain('aria-invalid:border-destructive');
    });

    it('should not have error styles when aria-invalid is false', () => {
      render(<Input aria-invalid={false} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should display shake animation class for errors', () => {
      render(<Input aria-invalid={true} />);

      const input = screen.getByRole('textbox');
      // The component has aria-invalid:animate-shake class
      expect(input.className).toContain('aria-invalid:animate-shake');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when prop is set', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should have disabled attribute preventing user interaction', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      // Verify disabled attribute is set (browser handles interaction blocking)
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('disabled');
    });

    it('should have disabled styling', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('disabled:opacity-50');
      expect(input.className).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('should have proper data-slot attribute', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('should support aria-label', () => {
      render(<Input aria-label='Username' />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Input aria-describedby='input-description' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'input-description');
    });

    it('should be focusable', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      input.focus();

      expect(input).toHaveFocus();
    });

    it('should lose focus on blur', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();

      input.blur();
      expect(input).not.toHaveFocus();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as uncontrolled with defaultValue', () => {
      render(<Input defaultValue='Default text' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Default text');
    });

    it('should work as controlled with value prop', () => {
      const { rerender } = render(<Input value='Controlled' onChange={() => {}} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Controlled');

      // Rerender with new value
      rerender(<Input value='Updated' onChange={() => {}} />);
      expect(input).toHaveValue('Updated');
    });
  });

  describe('Input Variants', () => {
    it('should handle search type input', () => {
      const { container } = render(<Input type='search' />);

      const input = container.querySelector('input[type="search"]')!;
      fireEvent.change(input, { target: { value: 'search query' } });

      expect(input).toHaveValue('search query');
    });

    it('should handle tel type input', () => {
      const { container } = render(<Input type='tel' />);

      const input = container.querySelector('input[type="tel"]')!;
      fireEvent.change(input, { target: { value: '+1234567890' } });

      expect(input).toHaveValue('+1234567890');
    });

    it('should handle url type input', () => {
      const { container } = render(<Input type='url' />);

      const input = container.querySelector('input[type="url"]')!;
      fireEvent.change(input, { target: { value: 'https://example.com' } });

      expect(input).toHaveValue('https://example.com');
    });
  });

  describe('Additional Attributes', () => {
    it('should support maxLength', () => {
      render(<Input maxLength={5} />);

      const input = screen.getByRole('textbox');
      // Browser enforces maxLength
      expect(input).toHaveAttribute('maxLength', '5');
    });

    it('should support readOnly', () => {
      render(<Input readOnly value='Read only' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
      expect(input).toHaveValue('Read only');
    });

    it('should support required attribute', () => {
      render(<Input required />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should support autoComplete', () => {
      render(<Input autoComplete='email' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('should support name attribute', () => {
      render(<Input name='username' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Input value='' onChange={() => {}} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      render(<Input />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: longText } });

      expect(input.value).toHaveLength(1000);
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-={}[]|:";\'<>?,./';
      render(<Input />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: specialText } });

      expect(input).toHaveValue(specialText);
    });

    it('should handle unicode characters', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '你好世界 🌍' } });

      expect(input).toHaveValue('你好世界 🌍');
    });
  });
});
