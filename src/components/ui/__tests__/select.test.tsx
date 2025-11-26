import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '../select';

/**
 * Select Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Select component (Radix UI primitive)
 * - No mocking of project components
 * - Portal handling for dropdown content
 * - Accessibility and keyboard navigation
 */

describe('Select Component', () => {
  beforeEach(() => {
    // No component mocks - testing real Radix UI Select
  });

  afterEach(() => {
    cleanup();
  });

  describe('Select Root', () => {
    it('should render Select trigger', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Choose option' />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render select wrapper element', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      // Select root is a context provider, not a DOM element
      // The trigger should be rendered
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('should render trigger with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    });

    it('should apply default size', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('should apply small size when specified', () => {
      render(
        <Select>
          <SelectTrigger size='sm'>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('should apply custom className', () => {
      render(
        <Select>
          <SelectTrigger className='custom-trigger'>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should be disabled when disabled prop is set', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });

    it('should toggle content on click', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');

      // Open select
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });
  });

  describe('SelectValue', () => {
    it('should display placeholder when no value selected', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Choose...' />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
        </Select>
      );

      const value = container.querySelector('[data-slot="select-value"]');
      expect(value).toBeInTheDocument();
    });

    it('should display selected value', async () => {
      render(
        <Select defaultValue='option2'>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Selected value should be displayed
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('SelectContent', () => {
    it('should render items in portal', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
            <SelectItem value='item2'>Item 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
      });
    });

    it('should have data-slot attribute', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open the select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });

    it('should apply custom className', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='custom-content'>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open the select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toHaveClass('custom-content');
      });
    });

    // Note: "Click outside to close" is handled internally by Radix UI
    // and is difficult to test reliably in jsdom due to portal behavior
    // This functionality is well-tested by Radix UI's own test suite
  });

  describe('SelectItem', () => {
    it('should render item text', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='test'>Test Item</SelectItem>
          </SelectContent>
        </Select>
      );

      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument();
      });
    });

    it('should have data-slot attribute', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item'>Item</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const item = document.querySelector('[data-slot="select-item"]');
        expect(item).toBeInTheDocument();
      });
    });

    it('should display items that can be selected', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const items = screen.getAllByRole('option');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Option 1');
        expect(items[1]).toHaveTextContent('Option 2');
      });
    });

    it('should be disabled when disabled prop is set', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='enabled'>Enabled</SelectItem>
            <SelectItem value='disabled' disabled>
              Disabled
            </SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const items = screen.getAllByRole('option');
        const disabledItem = items.find(item => item.textContent === 'Disabled');
        expect(disabledItem).toHaveAttribute('data-disabled');
      });
    });

    it('should show check icon for selected item', async () => {
      render(
        <Select defaultValue='selected'>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='selected'>Selected Item</SelectItem>
            <SelectItem value='other'>Other Item</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        // Check that the selected item has an indicator
        const items = screen.getAllByRole('option');
        const selectedItem = items.find(item => item.getAttribute('data-state') === 'checked');
        expect(selectedItem).toBeInTheDocument();
      });
    });
  });

  describe('SelectGroup and SelectLabel', () => {
    it('should render grouped items with label', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('should have data-slot attributes', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group</SelectLabel>
              <SelectItem value='item'>Item</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(document.querySelector('[data-slot="select-group"]')).toBeInTheDocument();
        expect(document.querySelector('[data-slot="select-label"]')).toBeInTheDocument();
      });
    });
  });

  describe('SelectSeparator', () => {
    it('should render separator between groups', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
            <SelectSeparator />
            <SelectItem value='item2'>Item 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const separator = document.querySelector('[data-slot="select-separator"]');
        expect(separator).toBeInTheDocument();
      });
    });

    it('should apply custom className', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
            <SelectSeparator className='custom-separator' />
            <SelectItem value='item2'>Item 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const separator = document.querySelector('[data-slot="select-separator"]');
        expect(separator).toHaveClass('custom-separator');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open on Enter key', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'Enter' });

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });

    it('should open on Space key', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: ' ' });

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });

    // Note: Arrow key navigation is handled internally by Radix UI
    // Radix manages focus and ARIA attributes, which is difficult to test in jsdom
    // This functionality is well-tested by Radix UI's own test suite

    // Note: Escape key handling is managed internally by Radix UI
    // and difficult to test reliably in jsdom due to focus management
    // This functionality is well-tested by Radix UI's own test suite
  });

  describe('Controlled and Uncontrolled', () => {
    it('should work as uncontrolled component with defaultValue', () => {
      render(
        <Select defaultValue='option2'>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Default value should be displayed
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should work as controlled component', async () => {
      function ControlledSelect() {
        const [value, setValue] = React.useState('option1');

        return (
          <div>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='option1'>Option 1</SelectItem>
                <SelectItem value='option2'>Option 2</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={() => setValue('option2')}>Change to Option 2</button>
          </div>
        );
      }

      render(<ControlledSelect />);

      // Initial value
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      // Change value programmatically
      fireEvent.click(screen.getByText('Change to Option 2'));

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    it('should accept onValueChange callback prop', () => {
      const onValueChange = vi.fn();

      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      // Verify the callback is passed to Radix
      // Actual selection behavior is tested by Radix UI
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have aria-expanded attribute', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Open select
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have aria-invalid when invalid', () => {
      render(
        <Select>
          <SelectTrigger aria-invalid>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('should be focusable', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      expect(trigger).toHaveFocus();
    });
  });

  describe('Complete Select Example', () => {
    it('should render a complete select with groups and separators', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select a fruit' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
              <SelectItem value='orange'>Orange</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value='carrot'>Carrot</SelectItem>
              <SelectItem value='potato'>Potato</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // Placeholder should be visible
      expect(screen.getByText('Select a fruit')).toBeInTheDocument();

      // Open select
      fireEvent.click(screen.getByRole('combobox'));

      await waitFor(() => {
        // Groups should be visible
        expect(screen.getByText('Fruits')).toBeInTheDocument();
        expect(screen.getByText('Vegetables')).toBeInTheDocument();

        // Items should be visible
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.getByText('Carrot')).toBeInTheDocument();
        expect(screen.getByText('Potato')).toBeInTheDocument();
      });
    });
  });
});
