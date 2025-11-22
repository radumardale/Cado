import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from '../form';
import { Input } from '../input';
import { ReactNode } from 'react';

/**
 * Form Component Tests
 *
 * Testing Strategy: MINIMAL MOCKING
 * - Test the REAL Form components with React Hook Form
 * - No mocking of project components
 * - Test full form integration with validation
 */

describe('Form Components', () => {
  beforeEach(() => {
    // No mocks needed - testing real components
  });

  afterEach(() => {
    cleanup();
  });

  describe('FormItem', () => {
    it('should render children', () => {
      render(
        <FormItem>
          <div data-testid='child'>Child Content</div>
        </FormItem>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(
        <FormItem data-testid='form-item'>
          <div>Content</div>
        </FormItem>
      );

      const formItem = screen.getByTestId('form-item');
      expect(formItem).toHaveAttribute('data-slot', 'form-item');
    });

    it('should apply custom className', () => {
      render(
        <FormItem className='custom-class' data-testid='form-item'>
          <div>Content</div>
        </FormItem>
      );

      expect(screen.getByTestId('form-item')).toHaveClass('custom-class');
    });

    it('should have default grid gap-2 classes', () => {
      render(
        <FormItem data-testid='form-item'>
          <div>Content</div>
        </FormItem>
      );

      const formItem = screen.getByTestId('form-item');
      expect(formItem).toHaveClass('grid', 'gap-2', 'relative');
    });
  });

  describe('FormLabel', () => {
    function TestFormWithLabel({ children }: { children: ReactNode }) {
      const form = useForm({
        defaultValues: { testField: '' },
      });

      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name='testField'
            render={({ field }) => (
              <FormItem>
                {children}
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      );
    }

    it('should render label text', () => {
      render(
        <TestFormWithLabel>
          <FormLabel>Username</FormLabel>
        </TestFormWithLabel>
      );

      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(
        <TestFormWithLabel>
          <FormLabel>Email</FormLabel>
        </TestFormWithLabel>
      );

      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('data-slot', 'form-label');
    });

    it('should apply error styling when field has error', async () => {
      const schema = z.object({
        testField: z.string().min(1, 'Required'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Trigger validation by submitting empty form
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('data-error', 'true');
        expect(label).toHaveClass('data-[error=true]:text-destructive');
      });
    });

    it('should associate with form control via htmlFor', () => {
      render(
        <TestFormWithLabel>
          <FormLabel>Password</FormLabel>
        </TestFormWithLabel>
      );

      const label = screen.getByText('Password');
      expect(label).toHaveAttribute('for');
      expect(label.getAttribute('for')).toContain('form-item');
    });
  });

  describe('FormControl', () => {
    function TestFormWithControl() {
      const form = useForm({
        defaultValues: { testField: '' },
      });

      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name='testField'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Test input' />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      );
    }

    it('should render the slotted child component', () => {
      render(<TestFormWithControl />);

      expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      const { container } = render(<TestFormWithControl />);

      // FormControl uses Slot from Radix which doesn't render a wrapper
      // The data-slot attribute should be on the slotted element itself
      const formControl = container.querySelector('[data-slot="form-control"]');
      expect(formControl).toBeInTheDocument();
    });

    it('should apply aria-describedby attribute', () => {
      render(<TestFormWithControl />);

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('aria-describedby');
      expect(input.getAttribute('aria-describedby')).toContain('form-item-description');
    });

    it('should set aria-invalid to false when no error', () => {
      render(<TestFormWithControl />);

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria-invalid to true when field has error', async () => {
      const schema = z.object({
        testField: z.string().min(5, 'Too short'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Test input' />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Trigger validation
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Test input');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should include message ID in aria-describedby when error exists', async () => {
      const schema = z.object({
        testField: z.string().min(1, 'Required'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Test input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Trigger validation
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Test input');
        const ariaDescribedBy = input.getAttribute('aria-describedby');
        expect(ariaDescribedBy).toContain('form-item-message');
      });
    });
  });

  describe('FormDescription', () => {
    function TestFormWithDescription() {
      const form = useForm({
        defaultValues: { testField: '' },
      });

      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name='testField'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This is a helper text</FormDescription>
              </FormItem>
            )}
          />
        </Form>
      );
    }

    it('should render description text', () => {
      render(<TestFormWithDescription />);

      expect(screen.getByText('This is a helper text')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<TestFormWithDescription />);

      const description = screen.getByText('This is a helper text');
      expect(description).toHaveAttribute('data-slot', 'form-description');
    });

    it('should have proper ID for aria-describedby association', () => {
      render(<TestFormWithDescription />);

      const description = screen.getByText('This is a helper text');
      expect(description).toHaveAttribute('id');
      expect(description.getAttribute('id')).toContain('form-item-description');
    });

    it('should apply custom className', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='testField'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className='custom-desc'>Helper</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<TestForm />);

      const description = screen.getByText('Helper');
      expect(description).toHaveClass('custom-desc');
    });

    it('should have muted text styling', () => {
      render(<TestFormWithDescription />);

      const description = screen.getByText('This is a helper text');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });
  });

  describe('FormMessage', () => {
    it('should not render when no error and no children', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='testField'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      }

      const { container } = render(<TestForm />);

      // FormMessage should not render when no error
      const message = container.querySelector('[data-slot="form-message"]');
      expect(message).not.toBeInTheDocument();
    });

    it('should display validation error message', async () => {
      const schema = z.object({
        email: z.string().email('Invalid email address'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { email: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Enter invalid email
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'not-an-email' } });

      // Submit to trigger validation
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('should have data-slot attribute', async () => {
      const schema = z.object({
        testField: z.string().min(1, 'Required field'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const message = screen.getByText('Required field');
        expect(message).toHaveAttribute('data-slot', 'form-message');
      });
    });

    it('should have proper ID for aria-describedby association', async () => {
      const schema = z.object({
        testField: z.string().min(1, 'Error'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const message = screen.getByText('Error');
        expect(message).toHaveAttribute('id');
        expect(message.getAttribute('id')).toContain('form-item-message');
      });
    });

    it('should render custom children when provided', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='testField'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<TestForm />);

      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

    it('should apply error styling classes', async () => {
      const schema = z.object({
        testField: z.string().min(1, 'Error'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { testField: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='testField'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const message = screen.getByText('Error');
        expect(message).toHaveClass('text-white', 'text-xs', 'bg-red');
      });
    });
  });

  describe('FormField Integration', () => {
    it('should integrate with Input component', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { username: '' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter username' />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<TestForm />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('should handle controlled form value', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { name: 'John' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<TestForm />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('John');
    });

    it('should update form value on input change', () => {
      function TestForm() {
        const form = useForm({
          defaultValues: { name: '' },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<TestForm />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Alice' } });

      expect(input).toHaveValue('Alice');
    });

    it('should validate on submit', async () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      });

      const onSubmit = vi.fn();

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { email: '', password: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Submit empty form
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should submit with valid data', async () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const onSubmit = vi.fn();

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: { email: '', password: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type='password' placeholder='Password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      // Fill in valid data
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            password: 'password123',
          },
          expect.anything()
        );
      });
    });

    it('should clear errors when valid input is provided', async () => {
      const schema = z.object({
        username: z.string().min(3, 'Too short'),
      });

      function TestForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          mode: 'onChange',
          defaultValues: { username: '' },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Submit</button>
            </form>
          </Form>
        );
      }

      render(<TestForm />);

      const input = screen.getByRole('textbox');

      // Trigger error with short input
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Too short')).toBeInTheDocument();
      });

      // Fix by providing valid input
      fireEvent.change(input, { target: { value: 'abc' } });

      await waitFor(() => {
        expect(screen.queryByText('Too short')).not.toBeInTheDocument();
      });
    });
  });

  describe('Complete Form Example', () => {
    it('should render a complete registration form', () => {
      const schema = z.object({
        email: z.string().email(),
        username: z.string().min(3),
        password: z.string().min(8),
      });

      function RegistrationForm() {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            email: '',
            username: '',
            password: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' />
                    </FormControl>
                    <FormDescription>We&apos;ll never share your email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Choose a unique username.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password' />
                    </FormControl>
                    <FormDescription>At least 8 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type='submit'>Register</button>
            </form>
          </Form>
        );
      }

      render(<RegistrationForm />);

      // Check all labels
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();

      // Check all descriptions
      expect(screen.getByText("We'll never share your email.")).toBeInTheDocument();
      expect(screen.getByText('Choose a unique username.')).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters.')).toBeInTheDocument();

      // Check submit button
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });
  });
});
