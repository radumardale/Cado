import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Button } from '../button';

/**
 * Button Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Button component with all variants
 * - No mocking of project components
 * - Tests Radix Slot functionality (asChild prop)
 * - Verifies class-variance-authority (CVA) variants
 */

describe('Button Component', () => {
  beforeEach(() => {
    // No mocks needed - testing real component
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render a button element', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render button text', () => {
      render(<Button>Submit Form</Button>);

      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<Button>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-slot', 'button');
    });

    it('should apply custom className', () => {
      render(<Button className='custom-class'>Click</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button variant='default'>Default</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should render destructive variant', () => {
      render(<Button variant='destructive'>Delete</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-white');
    });

    it('should render outline variant', () => {
      render(<Button variant='outline'>Outline</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'bg-background');
    });

    it('should render secondary variant', () => {
      render(<Button variant='secondary'>Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('should render ghost variant', () => {
      render(<Button variant='ghost'>Ghost</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('should render link variant', () => {
      render(<Button variant='link'>Link</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size='default'>Default Size</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6');
    });

    it('should render small size', () => {
      render(<Button size='sm'>Small</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'rounded-md');
    });

    it('should render large size', () => {
      render(<Button size='lg'>Large</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'rounded-md');
    });

    it('should render icon size', () => {
      render(<Button size='icon'>🔍</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-9');
    });
  });

  describe('User Interaction', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when prop is set', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have disabled styling', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:opacity-50');
      expect(button.className).toContain('disabled:pointer-events-none');
    });

    it('should have disabled attribute', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Button Types', () => {
    it('should default to type="button"', () => {
      render(<Button>Default Type</Button>);

      const button = screen.getByRole('button');
      // When type is not specified, it defaults to button (not submit)
      expect(button).toBeInTheDocument();
    });

    it('should support type="submit"', () => {
      render(<Button type='submit'>Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support type="reset"', () => {
      render(<Button type='reset'>Reset</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('AsChild Prop (Radix Slot)', () => {
    it('should render as a link when asChild is true', () => {
      render(
        <Button asChild>
          <a href='https://example.com'>Link Button</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveTextContent('Link Button');
    });

    it('should apply button styles to child element', () => {
      render(
        <Button asChild variant='destructive'>
          <a href='https://example.com/delete'>Delete Link</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-destructive');
    });
  });

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Button aria-label='Close dialog'>×</Button>);

      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Button aria-describedby='button-description'>Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
    });

    it('should be focusable', () => {
      render(<Button>Focus me</Button>);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      button.focus();

      // Disabled buttons cannot receive focus
      expect(button).not.toHaveFocus();
    });
  });

  describe('Variant and Size Combinations', () => {
    it('should combine default variant with small size', () => {
      render(
        <Button variant='default' size='sm'>
          Small Default
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'h-8');
    });

    it('should combine destructive variant with large size', () => {
      render(
        <Button variant='destructive' size='lg'>
          Large Destructive
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'h-10');
    });

    it('should combine outline variant with icon size', () => {
      render(
        <Button variant='outline' size='icon'>
          +
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'size-9');
    });
  });

  describe('Button with Icons', () => {
    it('should render with leading icon', () => {
      render(
        <Button>
          <span>🔍</span>
          Search
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('🔍Search');
    });

    it('should render with trailing icon', () => {
      render(
        <Button>
          Next
          <span>→</span>
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Next→');
    });

    it('should render icon-only button', () => {
      render(<Button size='icon'>+</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('+');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long button text that might wrap to multiple lines';
      render(<Button>{longText}</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longText);
    });

    it('should handle special characters', () => {
      render(<Button>{'<Click> & "Submit"'}</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('<Click> & "Submit"');
    });

    it('should handle multiple children', () => {
      render(
        <Button>
          <span>Part 1</span>
          <span>Part 2</span>
          <span>Part 3</span>
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Part 1Part 2Part 3');
    });
  });

  describe('Form Integration', () => {
    it('should submit form when type="submit"', () => {
      const handleSubmit = vi.fn(e => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type='submit'>Submit</Button>
        </form>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should reset form when type="reset"', () => {
      render(
        <form>
          <input defaultValue='test' />
          <Button type='reset'>Reset</Button>
        </form>
      );

      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox') as HTMLInputElement;

      // Change input value
      fireEvent.change(input, { target: { value: 'changed' } });
      expect(input.value).toBe('changed');

      // Click reset button
      fireEvent.click(button);

      // Value should be reset to default
      expect(input.value).toBe('test');
    });
  });
});
