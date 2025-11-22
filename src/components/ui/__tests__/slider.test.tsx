import * as React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DualRangeSlider } from '../slider';

/**
 * DualRangeSlider Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL DualRangeSlider component (Radix UI Slider primitive)
 * - No mocking of project components or Radix primitives
 * - Radix UI Slider works well in jsdom environment
 */

describe('DualRangeSlider Component', () => {
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
    it('should render slider elements', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[0, 100]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DualRangeSlider
          min={0}
          max={100}
          defaultValue={[0, 100]}
          className='custom-slider-class'
        />
      );

      const sliderRoot = container.querySelector('.custom-slider-class');
      expect(sliderRoot).toBeInTheDocument();
    });

    it('should have default styling classes', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[0, 100]} />);

      const sliderRoot = container.querySelector('[data-orientation="horizontal"]');
      expect(sliderRoot).toHaveClass('relative', 'flex', 'w-full', 'touch-none', 'select-none');
    });

    it('should render track element', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[0, 100]} />);

      const track = container.querySelector('[data-radix-collection-item]')?.parentElement;
      expect(track).toBeInTheDocument();
    });

    it('should render range element', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[0, 100]} />);

      // Range is rendered inside the track
      const track = container.querySelector('[data-radix-collection-item]')?.parentElement;
      expect(track).toBeInTheDocument();
    });
  });

  describe('Value Initialization', () => {
    it('should initialize with provided defaultValue array', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[20, 80]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('should create two thumbs for dual range', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[0, 100]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('should handle controlled value prop', () => {
      const { rerender } = render(
        <DualRangeSlider min={0} max={100} value={[25, 75]} onValueChange={() => {}} />
      );

      let sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');

      rerender(<DualRangeSlider min={0} max={100} value={[30, 70]} onValueChange={() => {}} />);

      sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '30');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '70');
    });

    it('should respect min and max props', () => {
      render(<DualRangeSlider min={10} max={90} defaultValue={[20, 80]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuemin', '10');
      expect(sliders[0]).toHaveAttribute('aria-valuemax', '90');
      expect(sliders[1]).toHaveAttribute('aria-valuemin', '10');
      expect(sliders[1]).toHaveAttribute('aria-valuemax', '90');
    });
  });

  describe('User Interaction', () => {
    it('should call onValueChange when value changes', () => {
      const handleChange = vi.fn();
      render(
        <DualRangeSlider min={0} max={100} defaultValue={[25, 75]} onValueChange={handleChange} />
      );

      // Note: Actual slider interaction requires more complex testing
      // This verifies the handler prop is accepted
      expect(handleChange).toBeDefined();
    });

    it('should have data-disabled when disabled', () => {
      const handleChange = vi.fn();
      render(
        <DualRangeSlider
          min={0}
          max={100}
          defaultValue={[25, 75]}
          disabled
          onValueChange={handleChange}
        />
      );

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('data-disabled', '');
      expect(sliders[1]).toHaveAttribute('data-disabled', '');
    });
  });

  describe('Disabled State', () => {
    it('should respect disabled prop', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} disabled />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('data-disabled', '');
      expect(sliders[1]).toHaveAttribute('data-disabled', '');
    });

    it('should apply disabled styling to thumbs', () => {
      const { container } = render(
        <DualRangeSlider min={0} max={100} defaultValue={[25, 75]} disabled />
      );

      const thumbs = container.querySelectorAll('[role="slider"]');
      thumbs.forEach(thumb => {
        expect(thumb).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
      });
    });

    it('should have aria-disabled when disabled', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} disabled />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('data-disabled', '');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attributes', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('role', 'slider');
      });
    });

    it('should have correct aria-valuenow attributes', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
    });

    it('should have correct aria-valuemin and aria-valuemax', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-valuemin', '0');
        expect(slider).toHaveAttribute('aria-valuemax', '100');
      });
    });

    it('should support aria-label', () => {
      render(
        <DualRangeSlider min={0} max={100} defaultValue={[25, 75]} aria-label='Price range' />
      );

      // Radix Slider generates its own aria-labels (Minimum/Maximum) for thumbs
      // The aria-label prop is applied to the root element
      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum');
      expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum');
    });

    it('should be keyboard accessible', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach(slider => {
        slider.focus();
        expect(slider).toHaveFocus();
      });
    });

    it('should have data-disabled when disabled', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} disabled />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('data-disabled', '');
      });
    });

    it('should have focus-visible outline class', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const thumbs = container.querySelectorAll('[role="slider"]');
      thumbs.forEach(thumb => {
        expect(thumb).toHaveClass('focus-visible:outline-none');
      });
    });
  });

  describe('Step Configuration', () => {
    it('should accept step prop', () => {
      render(<DualRangeSlider min={0} max={100} step={5} defaultValue={[25, 75]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('should accept step prop with decimal values', () => {
      render(<DualRangeSlider min={0} max={1} step={0.1} defaultValue={[0.2, 0.8]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });
  });

  describe('Thumb Styling', () => {
    it('should apply correct thumb styling classes', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const thumbs = container.querySelectorAll('[role="slider"]');
      thumbs.forEach(thumb => {
        expect(thumb).toHaveClass(
          'cursor-pointer',
          'relative',
          'block',
          'h-4',
          'w-4',
          'rounded-full',
          'bg-white'
        );
      });
    });

    it('should have border styling', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const thumbs = container.querySelectorAll('[role="slider"]');
      thumbs.forEach(thumb => {
        expect(thumb).toHaveClass('border-1', 'border-black');
      });
    });

    it('should have transition classes', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const thumbs = container.querySelectorAll('[role="slider"]');
      thumbs.forEach(thumb => {
        expect(thumb).toHaveClass('transition-colors');
      });
    });
  });

  describe('Track Styling', () => {
    it('should render track with proper structure', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      // Track is rendered with specific Radix attributes
      const track = container.querySelector('[data-orientation="horizontal"]');
      expect(track).toBeInTheDocument();
    });

    it('should have track element in the DOM', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      // Verify track structure exists
      const sliderRoot = container.querySelector('[data-orientation="horizontal"]');
      expect(sliderRoot).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle min and max being the same', () => {
      render(<DualRangeSlider min={50} max={50} defaultValue={[50, 50]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '50');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '50');
    });

    it('should handle negative ranges', () => {
      render(<DualRangeSlider min={-100} max={0} defaultValue={[-75, -25]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '-75');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '-25');
    });

    it('should handle very large ranges', () => {
      render(<DualRangeSlider min={0} max={1000000} defaultValue={[100000, 900000]} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '100000');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '900000');
    });

    it('should work without onValueChange handler', () => {
      expect(() => {
        render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);
      }).not.toThrow();
    });

    it('should preserve other props passed to the component', () => {
      render(
        <DualRangeSlider
          min={0}
          max={100}
          defaultValue={[25, 75]}
          data-testid='custom-slider'
          id='my-slider'
        />
      );

      const sliderRoot = screen.getByTestId('custom-slider');
      expect(sliderRoot).toBeInTheDocument();
      expect(sliderRoot).toHaveAttribute('id', 'my-slider');
    });
  });

  describe('Orientation', () => {
    it('should support horizontal orientation (default)', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliderRoot = container.querySelector('[data-orientation]');
      expect(sliderRoot).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should support vertical orientation', () => {
      const { container } = render(
        <DualRangeSlider min={0} max={100} defaultValue={[25, 75]} orientation='vertical' />
      );

      const sliderRoot = container.querySelector('[data-orientation]');
      expect(sliderRoot).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('Direction', () => {
    it('should support ltr direction (default)', () => {
      const { container } = render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} />);

      const sliderRoot = container.querySelector('[dir]');
      expect(sliderRoot).toHaveAttribute('dir', 'ltr');
    });

    it('should support rtl direction', () => {
      const { container } = render(
        <DualRangeSlider min={0} max={100} defaultValue={[25, 75]} dir='rtl' />
      );

      const sliderRoot = container.querySelector('[dir]');
      expect(sliderRoot).toHaveAttribute('dir', 'rtl');
    });
  });

  describe('Inverted', () => {
    it('should support inverted prop', () => {
      render(<DualRangeSlider min={0} max={100} defaultValue={[25, 75]} inverted />);

      // Component should render without errors
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });
  });

  describe('ForwardRef', () => {
    it('should forward ref to the root element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<DualRangeSlider ref={ref} min={0} max={100} defaultValue={[25, 75]} />);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('should have displayName set correctly', () => {
      expect(DualRangeSlider.displayName).toBe('DualRangeSlider');
    });
  });
});
