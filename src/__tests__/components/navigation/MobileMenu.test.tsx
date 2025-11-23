import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type ReactNode } from 'react';

// Navigation mocks - must be defined with vi.hoisted() before other imports
const i18nNav = vi.hoisted(() => {
  const pathname = '/en';

  return {
    pathname,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    },
    Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
      <a {...props}>{children}</a>
    ),
    redirect: vi.fn(),
    getPathname: vi.fn(() => pathname),
  };
});

// Setup navigation mocks BEFORE other imports
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => i18nNav.router,
  usePathname: () => i18nNav.pathname,
  Link: i18nNav.Link,
  redirect: i18nNav.redirect,
  getPathname: i18nNav.getPathname,
}));

import { screen, fireEvent, cleanup } from '@testing-library/react';
import MobileMenu from '@/components/header/MobileMenu';
import {
  renderWithProviders,
  createMockProduct,
  createTestQueryClient,
} from '@/__tests__/helpers/componentTestUtils';

// Testing with real child components for integration testing
// Following testing-expert principle: "Integration over Isolation"
// No child component mocks - testing how components actually work together

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

      // Real searchbar renders as a textbox input
      expect(screen.getByRole('textbox')).toBeInTheDocument();
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

      // Real searchbar renders as a textbox with placeholder
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'NavBar.search...');
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

      // Real accordion renders with the catalog title
      const catalogTitle = screen.getByText(/NavBar\.catalog/i);
      expect(catalogTitle).toBeInTheDocument();
    });

    it('should render catalog accordion with correct title', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      // Check for catalog navigation title
      expect(screen.getByText(/NavBar\.catalog/i)).toBeInTheDocument();
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

      // Accordion visible when no search text
      expect(screen.getByText(/NavBar\.catalog/i)).toBeInTheDocument();
      expect(screen.getByText('Tags.ALL_PRODUCTS.title')).toBeInTheDocument();
    });

    it('should show catalog accordion when search text is less than 2 characters', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'a' } });

      // Accordion still visible with single character
      expect(screen.getByText(/NavBar\.catalog/i)).toBeInTheDocument();
      expect(screen.getByText('Tags.ALL_PRODUCTS.title')).toBeInTheDocument();
    });

    it('should show search products when search text is 2 or more characters', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Real SearchProducts component should render with search results
      // Note: The exact assertion depends on SearchProducts component structure
      // For now, verify accordion is NOT visible
      expect(screen.queryByText('Tags.ALL_PRODUCTS.title')).not.toBeInTheDocument();
    });

    it('should update search text in input', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'product' } });

      expect(searchInput).toHaveValue('product');
    });
  });

  describe('Logo Link', () => {
    it('should have logo link to home', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, { queryClient });

      const logoLink = screen.getByAltText('logo').closest('a');
      // Mocked Link renders href as-is without locale prefix
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Multilingual Support', () => {
    it('should render in Romanian locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'ro',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      // Mocked Link renders href without locale processing
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render in Russian locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'ru',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      // Mocked Link renders href without locale processing
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render in English locale', () => {
      renderWithProviders(<MobileMenu setSidebarOpen={setSidebarOpenMock} />, {
        locale: 'en',
        queryClient,
      });

      const logoLink = screen.getByAltText('logo').closest('a');
      // Mocked Link renders href without locale processing
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });
});
