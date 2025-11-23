import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, cleanup } from '@testing-library/react';
import MobileMenu from '@/components/header/MobileMenu';
import {
  renderWithProviders,
  createMockProduct,
  createTestQueryClient,
} from '@/__tests__/helpers/componentTestUtils';

// Mock child components to isolate MobileMenu testing
vi.mock('@/components/header/CatalogMenu/Searchbar', () => ({
  default: ({
    searchText,
    setSearchText,
    closeMenu,
  }: {
    searchText: string;
    setSearchText: (v: string) => void;
    closeMenu: () => void;
  }) => (
    <div data-testid='searchbar'>
      <input
        data-testid='search-input'
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <button onClick={closeMenu}>Close from Searchbar</button>
    </div>
  ),
}));

vi.mock('@/components/catalog/sidebar/Accordion', () => ({
  default: ({
    title,
    children,
    isMenuAccordion,
  }: {
    title: string;
    children: React.ReactNode;
    isMenuAccordion?: boolean;
  }) => (
    <div data-testid='accordion' data-menu-accordion={isMenuAccordion}>
      <div data-testid='accordion-title'>{title}</div>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock('@/components/header/CatalogMenu/SearchProducts', () => ({
  default: ({
    products,
    searchText,
    closeMenu,
  }: {
    recProducts?: unknown[];
    isLoading: boolean;
    productsCount?: number;
    products?: unknown[];
    searchText: string;
    closeMenu: () => void;
  }) => (
    <div data-testid='search-products'>
      <div data-testid='search-text'>{searchText}</div>
      <div data-testid='products-count'>{products?.length || 0}</div>
      <button onClick={closeMenu}>Close from SearchProducts</button>
    </div>
  ),
}));

// No need to mock tRPC - we'll pre-populate the QueryClient cache instead
// This follows the testing pattern from ProductInfo.test.tsx

describe('MobileMenu', () => {
  let setSidebarOpenMock: ReturnType<typeof vi.fn>;
  let queryClient: ReturnType<typeof createTestQueryClient>;

  // Mock data for tRPC queries
  const mockRecProducts = [createMockProduct({ custom_id: 'REC001' })];
  const mockSearchProducts = [createMockProduct({ custom_id: 'SEARCH001' })];

  beforeEach(() => {
    setSidebarOpenMock = vi.fn();
    queryClient = createTestQueryClient();

    // Pre-populate cache with recommended products (always loaded)
    queryClient.setQueryData([['products', 'getRecProduct'], { type: 'query' }], {
      products: mockRecProducts,
    });

    // Pre-populate cache with search results (when searchText.length > 1)
    queryClient.setQueryData([['search'], { input: { title: 'test' }, type: 'query' }], {
      products: mockSearchProducts,
      count: 1,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Core Rendering', () => {
    it('should render the mobile menu', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      expect(screen.getByTestId('searchbar')).toBeInTheDocument();
    });

    it('should render the logo', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const logo = screen.getByAltText('logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo/logo-white.svg');
    });

    it('should render the close button', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));
      expect(closeButton).toBeInTheDocument();
    });

    it('should render the searchbar', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      expect(screen.getByTestId('searchbar')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should call setSidebarOpen(false) when close button is clicked', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));

      fireEvent.click(closeButton!);

      expect(setSidebarOpenMock).toHaveBeenCalledWith(false);
    });
  });

  describe('Navigation Links', () => {
    it('should render home navigation link', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const homeLink = screen.getByText(/NavBar\.home/i);
      expect(homeLink).toBeInTheDocument();
    });

    it('should render about navigation link', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const aboutLink = screen.getByText(/NavBar\.about/i);
      expect(aboutLink).toBeInTheDocument();
    });

    it('should render blogs navigation link', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const blogsLink = screen.getByText(/NavBar\.blogs/i);
      expect(blogsLink).toBeInTheDocument();
    });

    it('should render contact navigation link', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const contactLink = screen.getByText(/NavBar\.contact/i);
      expect(contactLink).toBeInTheDocument();
    });
  });

  describe('Catalog Accordion', () => {
    it('should render catalog accordion', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const accordion = screen.getByTestId('accordion');
      expect(accordion).toBeInTheDocument();
      expect(accordion).toHaveAttribute('data-menu-accordion', 'true');
    });

    it('should render catalog accordion with correct title', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const accordionTitle = screen.getByTestId('accordion-title');
      expect(accordionTitle).toHaveTextContent(/NavBar\.catalog/i);
    });

    it('should render all category links in accordion', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      // Check for category translation keys
      expect(screen.getByText('Tags.ALL_PRODUCTS.title')).toBeInTheDocument();
      expect(screen.getByText('Tags.FOR_HER.title')).toBeInTheDocument();
      expect(screen.getByText('Tags.FOR_HIM.title')).toBeInTheDocument();
      expect(screen.getByText('Tags.FOR_KIDS.title')).toBeInTheDocument();
      expect(screen.getByText('Tags.ACCESSORIES.title')).toBeInTheDocument();
      expect(screen.getByText('Tags.FLOWERS_AND_BALLOONS.title')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should show catalog accordion when search text is empty', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryByTestId('search-products')).not.toBeInTheDocument();
    });

    it('should show catalog accordion when search text is less than 2 characters', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'a' } });

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryByTestId('search-products')).not.toBeInTheDocument();
    });

    it('should show search products when search text is 2 or more characters', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(screen.getByTestId('search-products')).toBeInTheDocument();
      expect(screen.queryByTestId('accordion')).not.toBeInTheDocument();
    });

    it('should pass search text to SearchProducts component', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'product' } });

      const searchTextDisplay = screen.getByTestId('search-text');
      expect(searchTextDisplay).toHaveTextContent('product');
    });
  });

  describe('Logo Link', () => {
    it('should have logo link to home', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const logoLink = screen.getByAltText('logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/en');
    });
  });

  describe('Multilingual Support', () => {
    it('should render in Romanian locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'ro',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/ro');
    });

    it('should render in Russian locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'ru',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/ru');
    });

    it('should render in English locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'en',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/en');
    });
  });
});
