# Component Testing Guide

This directory contains tests for React components in the Cado e-commerce platform.

## Test Infrastructure

### Test Utilities

All component test utilities are located in `src/__tests__/helpers/componentTestUtils.tsx`.

**Key utilities:**

- `renderWithProviders()` - Renders components with all necessary providers (tRPC, next-intl, QueryClient)
- `createMockProduct()` - Factory for creating mock product data
- `createMockCartItem()` - Factory for creating mock cart items
- `mockNextRouter()` - Mocks Next.js navigation hooks
- `mockTRPCQuery()` - Creates mock tRPC query responses
- `mockTRPCMutation()` - Creates mock tRPC mutations

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test src/__tests__/components/product/ProductCard.test.tsx

# Run tests with coverage
npm run test -- --coverage
```

## Test Patterns

### 1. Basic Component Rendering

```typescript
import { renderWithProviders, screen } from '@/__tests__/helpers/componentTestUtils';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { createMockProduct } from '@/__tests__/helpers/componentTestUtils';

describe('ProductCard', () => {
  it('should render product information', () => {
    const product = createMockProduct();

    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('100 MDL')).toBeInTheDocument();
  });
});
```

### 2. Testing User Interactions

```typescript
import { renderWithProviders, screen, fireEvent } from '@/__tests__/helpers/componentTestUtils';

it('should call onClick when button is clicked', () => {
  const handleClick = vi.fn();

  renderWithProviders(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. Testing Multilingual Content

```typescript
it('should display product title in Romanian', () => {
  const product = createMockProduct({
    title: {
      ro: 'Produs Românesc',
      ru: 'Румынский продукт',
      en: 'Romanian Product',
    },
  });

  renderWithProviders(<ProductCard product={product} />, { locale: 'ro' });

  expect(screen.getByText('Produs Românesc')).toBeInTheDocument();
});
```

### 4. Testing tRPC Queries

```typescript
import { mockTRPCQuery } from '@/__tests__/helpers/componentTestUtils';

it('should display products from tRPC query', () => {
  const mockProducts = createMockProducts(3);

  vi.mock('@/app/_trpc/client', () => ({
    useTRPC: () => ({
      products: {
        getProductsByIds: {
          useQuery: () => mockTRPCQuery({ products: mockProducts }),
        },
      },
    }),
  }));

  renderWithProviders(<ProductList />);

  expect(screen.getByText('Product 1')).toBeInTheDocument();
  expect(screen.getByText('Product 2')).toBeInTheDocument();
});
```

### 5. Testing Forms

```typescript
import { renderWithProviders, screen, fireEvent, waitFor } from '@/__tests__/helpers/componentTestUtils';

it('should submit form with valid data', async () => {
  const onSubmit = vi.fn();

  renderWithProviders(<CheckoutForm onSubmit={onSubmit} />);

  // Fill in form fields
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@example.com' },
  });

  fireEvent.change(screen.getByPlaceholderText(/phone/i), {
    target: { value: '+37369123456' },
  });

  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### 6. Testing Cart Functionality

```typescript
import { renderWithProviders, screen, fireEvent } from '@/__tests__/helpers/componentTestUtils';
import { createMockCartItem, createMockProduct } from '@/__tests__/helpers/componentTestUtils';

it('should update quantity when + button is clicked', () => {
  const mockSetValue = vi.fn();
  const cartItems = [createMockCartItem('PROD001', 1)];
  const products = [createMockProduct({ custom_id: 'PROD001' })];

  renderWithProviders(
    <CartSidebar
      items={cartItems}
      setValue={mockSetValue}
      products={products}
    />
  );

  const increaseButton = screen.getByRole('button', { name: '+' });
  fireEvent.click(increaseButton);

  expect(mockSetValue).toHaveBeenCalledWith([
    { productId: 'PROD001', quantity: 2 }
  ]);
});
```

### 7. Testing Loading and Error States

```typescript
it('should display loading state', () => {
  vi.mock('@/app/_trpc/client', () => ({
    useTRPC: () => ({
      products: {
        getAll: {
          useQuery: () => ({
            isLoading: true,
            isSuccess: false,
            data: null,
          }),
        },
      },
    }),
  }));

  renderWithProviders(<ProductGrid />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should display error state', () => {
  vi.mock('@/app/_trpc/client', () => ({
    useTRPC: () => ({
      products: {
        getAll: {
          useQuery: () => ({
            isLoading: false,
            isSuccess: false,
            isError: true,
            error: new Error('Failed to load products'),
          }),
        },
      },
    }),
  }));

  renderWithProviders(<ProductGrid />);

  expect(screen.getByText(/error/i)).toBeInTheDocument();
});
```

### 8. Testing Conditional Rendering

```typescript
it('should display sale badge when product is on sale', () => {
  const product = createMockProductOnSale(80);

  renderWithProviders(<ProductCard product={product} />);

  expect(screen.getByText(/discount/i)).toBeInTheDocument();
  expect(screen.getByText('100 MDL')).toHaveClass('line-through');
  expect(screen.getByText('80 MDL')).toBeInTheDocument();
});

it('should not display sale badge when product is not on sale', () => {
  const product = createMockProduct();

  renderWithProviders(<ProductCard product={product} />);

  expect(screen.queryByText(/discount/i)).not.toBeInTheDocument();
});
```

## Component Test Organization

Tests are organized by component category:

```
src/__tests__/components/
├── README.md                    # This file
├── cart/
│   ├── CartSidebar.test.tsx     # Cart sidebar tests
│   └── CartIcon.test.tsx        # Cart icon tests
├── checkout/
│   ├── CheckoutForm.test.tsx    # Checkout form tests
│   └── CheckoutCart.test.tsx    # Checkout cart tests
├── product/
│   ├── ProductCard.test.tsx     # Product card tests
│   ├── ProductInfo.test.tsx     # Product info tests
│   └── ProductImages.test.tsx   # Product images tests
└── navigation/
    ├── Header.test.tsx          # Header tests
    ├── MobileMenu.test.tsx      # Mobile menu tests
    └── LangPicker.test.tsx      # Language picker tests
```

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// Good
it('should display out of stock message when product has no inventory', () => {});

// Bad
it('works', () => {});
```

### 2. Arrange, Act, Assert (AAA) Pattern

```typescript
it('should update cart quantity', () => {
  // Arrange
  const mockSetValue = vi.fn();
  const cartItems = [createMockCartItem('PROD001', 1)];

  renderWithProviders(<Cart items={cartItems} setValue={mockSetValue} />);

  // Act
  const increaseButton = screen.getByRole('button', { name: '+' });
  fireEvent.click(increaseButton);

  // Assert
  expect(mockSetValue).toHaveBeenCalledWith([
    { productId: 'PROD001', quantity: 2 }
  ]);
});
```

### 3. Test User Behavior, Not Implementation

```typescript
// Good - tests what the user sees
it('should display error message when form is invalid', () => {
  renderWithProviders(<CheckoutForm />);

  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

// Bad - tests implementation details
it('should set formState.errors.email', () => {
  const { result } = renderHook(() => useForm());
  // Testing internal state instead of user-visible behavior
});
```

### 4. Clean Up After Tests

Vitest automatically cleans up DOM and mocks after each test, but for additional cleanup:

```typescript
afterEach(() => {
  vi.clearAllMocks();
  // Any additional cleanup
});
```

### 5. Mock External Dependencies

```typescript
// Mock Next.js router
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Mock tRPC
vi.mock('@/app/_trpc/client', () => ({
  useTRPC: () => ({
    products: {
      getAll: {
        useQuery: () => mockTRPCQuery({ products: [] }),
      },
    },
  }),
}));
```

### 6. Test Accessibility

```typescript
it('should be keyboard accessible', () => {
  renderWithProviders(<ProductCard product={createMockProduct()} />);

  const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

  // Check ARIA attributes
  expect(addToCartButton).toHaveAttribute('aria-label');

  // Test keyboard interaction
  addToCartButton.focus();
  expect(addToCartButton).toHaveFocus();
});
```

## Common Issues and Solutions

### Issue: "Cannot find module" errors

**Solution:** Ensure path aliases are configured in `vitest.config.mts`:

```typescript
resolve: {
  alias: {
    '@': '/src',
  },
}
```

### Issue: Translation errors

**Solution:** Use `renderWithProviders` which includes next-intl provider:

```typescript
renderWithProviders(<Component />, { locale: 'en' });
```

### Issue: tRPC errors

**Solution:** Mock the tRPC client properly:

```typescript
vi.mock('@/app/_trpc/client', () => ({
  useTRPC: () => ({
    // Your mock implementation
  }),
}));
```

### Issue: Image loading warnings

**Solution:** Mock Next.js Image component (already included in componentTestUtils):

```typescript
import { mockNextImage } from '@/__tests__/helpers/componentTestUtils';

beforeAll(() => {
  mockNextImage();
});
```

## Coverage Goals

| Component Type  | Target Coverage |
| --------------- | --------------- |
| Cart            | 80%             |
| Checkout        | 75%             |
| Product Card    | 80%             |
| Product Details | 65%             |
| Navigation      | 55%             |
| Filters/Search  | 50%             |

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)
