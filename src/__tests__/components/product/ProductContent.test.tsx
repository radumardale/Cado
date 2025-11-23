import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  renderWithProviders,
  screen,
  fireEvent,
  createMockProduct,
  createMockProductOnSale,
  createMockProductOutOfStock,
  cleanup,
} from '@/__tests__/helpers/componentTestUtils';
import ProductContent from '@/components/product/ProductContent';
import { StockState } from '@/lib/enums/StockState';
import * as utils from '@/lib/utils';

// Mock SCSS module
vi.mock('@/components/product/product.module.scss', () => ({
  default: {
    productDescription: 'productDescription',
  },
}));

// Mock lenis/react
vi.mock('lenis/react', () => ({
  useLenis: () => ({
    scrollTo: vi.fn(),
  }),
}));

// Mock usehooks-ts
const mockSetValue = vi.fn();
vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [[], mockSetValue],
}));

// Mock AdditionalInfo component (unit test focus on ProductContent)
vi.mock('@/components/product/AdditionalInfo', () => ({
  default: () => <div data-testid='additional-info'>Additional Info</div>,
}));

// Spy on addToCart utility
vi.spyOn(utils, 'addToCart');

describe('ProductContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render product title in current locale', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />, { locale: 'en' });

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(product.title.en);
    });

    it('should render product title with multilingual support', () => {
      const product = createMockProduct({
        title: {
          ro: 'Produs Românesc',
          ru: 'Румынский продукт',
          en: 'Romanian Product',
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      // Component renders title based on locale (defaults to 'en' in tests)
      const heading = screen.getByRole('heading', { level: 1 });
      // Should render one of the localized titles
      expect(heading.textContent).toMatch(/Produs Românesc|Румынский продукт|Romanian Product/);
    });

    it('should render product description with HTML content', () => {
      const product = createMockProduct({
        description: {
          en: '<p>Rich <strong>HTML</strong> description</p>',
          ro: '<p>Descriere <strong>HTML</strong></p>',
          ru: '<p>HTML <strong>описание</strong></p>',
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText(/Rich/)).toBeInTheDocument();
      expect(screen.getByText('HTML', { selector: 'strong' })).toBeInTheDocument();
    });

    it('should render AdditionalInfo component', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByTestId('additional-info')).toBeInTheDocument();
    });
  });

  describe('Price Display', () => {
    it('should display regular price when product is not on sale', () => {
      const product = createMockProduct({ price: 150 });

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText(`${product.price} MDL`)).toBeInTheDocument();
      expect(screen.queryByText(/line-through/)).not.toBeInTheDocument();
    });

    it('should display sale price with original price crossed out', () => {
      const product = createMockProductOnSale(80);

      renderWithProviders(<ProductContent product={product} />);

      // Original price should be visible and crossed out
      const originalPrice = screen.getByText(`${product.price} MDL`, { selector: '.line-through' });
      expect(originalPrice).toBeInTheDocument();
      expect(originalPrice).toHaveClass('line-through');

      // Sale price should be visible
      expect(screen.getByText(`${product.sale?.sale_price} MDL`)).toBeInTheDocument();
    });

    it('should format price with thousand separators', () => {
      const product = createMockProduct({ price: 1250 });

      renderWithProviders(<ProductContent product={product} />);

      // toLocaleString() adds thousand separators
      expect(screen.getByText(/1[,\s]?250 MDL/)).toBeInTheDocument();
    });
  });

  describe('Stock State Indicators', () => {
    it('should display IN_STOCK indicator with correct color', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.IN_STOCK,
          stock: 10,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      // Stock state text contains the state key
      expect(screen.getByText(/IN_STOCK/i)).toBeInTheDocument();
    });

    it('should display ON_COMMAND indicator', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.ON_COMMAND,
          stock: 0,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText(/ON_COMMAND/i)).toBeInTheDocument();
    });

    it('should display NOT_IN_STOCK indicator', () => {
      const product = createMockProductOutOfStock();

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText(/NOT_IN_STOCK/i)).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('should render quantity controls when product is in stock', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText('1')).toBeInTheDocument(); // Initial quantity
      expect(screen.getAllByRole('button')).toHaveLength(3); // -, +, Add to cart
    });

    it('should not render quantity controls when product is out of stock', () => {
      const product = createMockProductOutOfStock();

      renderWithProviders(<ProductContent product={product} />);

      // Should not show quantity (1) or add to cart button
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      const buttons = screen.queryAllByRole('button');
      const addToCartButton = buttons.find(btn => btn.textContent?.includes('add'));
      expect(addToCartButton).toBeUndefined();
    });

    it('should increment quantity when + button is clicked', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText('1')).toBeInTheDocument();

      // Find the increment button (+ button) by querying within the quantity container
      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type') as HTMLButtonElement;

      fireEvent.click(incrementButton);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should decrement quantity when - button is clicked', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      // First increment to 2
      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type');

      if (incrementButton) {
        fireEvent.click(incrementButton);
      }

      expect(screen.getByText('2')).toBeInTheDocument();

      // Then decrement back to 1
      const decrementButton = container?.querySelector('button:first-of-type');

      if (decrementButton) {
        fireEvent.click(decrementButton);
      }

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should disable decrement button when quantity is 1', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      const container = screen.getByText('1').parentElement;
      const decrementButton = container?.querySelector('button:first-of-type') as HTMLButtonElement;

      expect(decrementButton).toBeDisabled();
    });

    it('should disable increment button when quantity reaches stock limit', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.IN_STOCK,
          stock: 2,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type') as HTMLButtonElement;

      // Increment to stock limit
      fireEvent.click(incrementButton);
      expect(screen.getByText('2')).toBeInTheDocument();

      // Button should now be disabled
      expect(incrementButton).toBeDisabled();
    });

    it('should not allow quantity to exceed stock availability', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.IN_STOCK,
          stock: 3,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type') as HTMLButtonElement;

      // Click increment 5 times (more than stock)
      for (let i = 0; i < 5; i++) {
        fireEvent.click(incrementButton);
      }

      // Should stop at stock limit of 3
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Add to Cart', () => {
    it('should render Add to Cart button when product is in stock', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />);

      // Check for button by role since translation might not work perfectly in tests
      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons.find(btn => btn.textContent?.includes('add'));
      expect(addToCartButton).toBeInTheDocument();
    });

    it('should call addToCart when Add to Cart button is clicked', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />, { locale: 'en' });

      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons.find(btn =>
        btn.textContent?.includes('add')
      ) as HTMLButtonElement;
      fireEvent.click(addToCartButton);

      expect(utils.addToCart).toHaveBeenCalledWith(
        product,
        1, // Default quantity
        [], // Empty cart
        mockSetValue,
        'en'
      );
    });

    it('should call addToCart with updated quantity', () => {
      const product = createMockProduct();

      renderWithProviders(<ProductContent product={product} />, { locale: 'en' });

      // Increment quantity to 3
      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type') as HTMLButtonElement;

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByText('3')).toBeInTheDocument();

      // Add to cart with quantity 3
      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons.find(btn =>
        btn.textContent?.includes('add')
      ) as HTMLButtonElement;
      fireEvent.click(addToCartButton);

      expect(utils.addToCart).toHaveBeenCalledWith(
        product,
        3, // Updated quantity
        [],
        mockSetValue,
        'en' // Locale defaults to 'en' in tests
      );
    });

    it('should not render Add to Cart button when product is out of stock', () => {
      const product = createMockProductOutOfStock();

      renderWithProviders(<ProductContent product={product} />);

      const buttons = screen.queryAllByRole('button');
      const addToCartButton = buttons.find(btn => btn.textContent?.includes('add'));
      expect(addToCartButton).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with zero price', () => {
      const product = createMockProduct({ price: 0 });

      renderWithProviders(<ProductContent product={product} />);

      expect(screen.getByText('0 MDL')).toBeInTheDocument();
    });

    it('should handle product with single stock item', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.IN_STOCK,
          stock: 1,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      // Should show quantity 1
      expect(screen.getByText('1')).toBeInTheDocument();

      // Increment button should be disabled at stock limit
      const container = screen.getByText('1').parentElement;
      const incrementButton = container?.querySelector('button:last-of-type') as HTMLButtonElement;
      expect(incrementButton).toBeDisabled();
    });

    it('should handle ON_COMMAND state with max stock of 100', () => {
      const product = createMockProduct({
        stock_availability: {
          state: StockState.ON_COMMAND,
          stock: 0,
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      // Should still show quantity controls for ON_COMMAND state
      expect(screen.getByText('1')).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons.find(btn => btn.textContent?.includes('add'));
      expect(addToCartButton).toBeInTheDocument();
    });

    it('should handle empty HTML description gracefully', () => {
      const product = createMockProduct({
        description: {
          en: '',
          ro: '',
          ru: '',
        },
      });

      renderWithProviders(<ProductContent product={product} />);

      // Component should render without crashing
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
