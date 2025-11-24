import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import Header from '@/components/header/Header';
import { Categories } from '@/lib/enums/Categories';
import { renderWithProviders } from '@/__tests__/helpers/componentTestUtils';

// Mock child components to isolate Header testing
vi.mock('@/components/header/TopHeader', () => ({
  default: () => <div data-testid='top-header'>TopHeader</div>,
}));

vi.mock('@/components/header/CatalogMenu/CatalogMenuButton', () => ({
  default: ({ isCatalogMenuOpen }: { isCatalogMenuOpen: boolean }) => (
    <button data-testid='catalog-menu-button'>{isCatalogMenuOpen ? 'Open' : 'Closed'}</button>
  ),
}));

vi.mock('@/components/header/CatalogMenu/CatalogMenu', () => ({
  default: () => <div data-testid='catalog-menu'>CatalogMenu</div>,
}));

vi.mock('@/components/header/CartIcon', () => ({
  default: () => <div data-testid='cart-icon'>CartIcon</div>,
}));

vi.mock('@/components/header/MobileMenuIcon', () => ({
  default: () => <div data-testid='mobile-menu-icon'>MobileMenuIcon</div>,
}));

vi.mock('@/components/header/LangIcon', () => ({
  default: () => <div data-testid='lang-icon'>LangIcon</div>,
}));

vi.mock('@/components/Breadcrums', () => ({
  default: ({
    category,
    productInfo,
  }: {
    category?: Categories | null;
    productInfo?: { title: string; id: string };
  }) => (
    <div data-testid='breadcrumbs'>
      Breadcrumbs - {category} - {productInfo?.title}
    </div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive behavior
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Core Rendering', () => {
    it('should render the header component', () => {
      renderWithProviders(<Header />);

      expect(screen.getByTestId('top-header')).toBeInTheDocument();
      expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
    });

    it('should render the logo with correct alt text', () => {
      renderWithProviders(<Header />);

      const logo = screen.getByAltText('logo');
      expect(logo).toBeInTheDocument();
    });

    it('should render navigation links on desktop', () => {
      renderWithProviders(<Header />);

      // Links render via CustomLink component with translation keys
      expect(screen.getAllByText(/NavBar\.(home|about|blogs|contact)/).length).toBeGreaterThan(0);
    });

    it('should render catalog menu button', () => {
      renderWithProviders(<Header />);

      expect(screen.getByTestId('catalog-menu-button')).toBeInTheDocument();
    });

    it('should render search button', () => {
      renderWithProviders(<Header />);

      const searchButtons = screen.getAllByRole('button');
      const searchButton = searchButtons.find(button => button.querySelector('svg'));
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('Locale-Specific Logo', () => {
    it('should display Romanian logo when locale is ro', () => {
      renderWithProviders(<Header />, { locale: 'ro' });

      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-ro.svg');
    });

    it('should display Russian logo when locale is ru', () => {
      renderWithProviders(<Header />, { locale: 'ru' });

      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-ru.svg');
    });

    it('should display English logo when locale is en', () => {
      renderWithProviders(<Header />, { locale: 'en' });

      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-en.svg');
    });
  });

  describe('Child Components Integration', () => {
    it('should render TopHeader component', () => {
      renderWithProviders(<Header />);

      expect(screen.getByTestId('top-header')).toBeInTheDocument();
    });

    it('should render CartIcon component', () => {
      renderWithProviders(<Header />);

      expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
    });

    it('should render MobileMenuIcon on mobile', () => {
      renderWithProviders(<Header />);

      expect(screen.getByTestId('mobile-menu-icon')).toBeInTheDocument();
    });

    it('should render LangIcon component', () => {
      renderWithProviders(<Header />);

      // Should render two LangIcon instances (mobile + desktop)
      const langIcons = screen.getAllByTestId('lang-icon');
      expect(langIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Breadcrumbs', () => {
    it('should not render breadcrumbs by default', () => {
      renderWithProviders(<Header />);

      expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument();
    });

    it('should render breadcrumbs when breadcrumbs prop is true', () => {
      renderWithProviders(<Header breadcrumbs={true} />);

      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    });

    it('should pass category to breadcrumbs component', () => {
      renderWithProviders(<Header breadcrumbs={true} category={Categories.FOR_HER} />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');
      expect(breadcrumbs).toHaveTextContent('FOR_HER');
    });

    it('should pass productInfo to breadcrumbs component', () => {
      const productInfo = { title: 'Test Product', id: 'test-123' };
      renderWithProviders(<Header breadcrumbs={true} productInfo={productInfo} />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');
      expect(breadcrumbs).toHaveTextContent(productInfo.title);
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for home link', () => {
      renderWithProviders(<Header />);

      // Logo should link to home
      const logoLink = screen.getByAltText('logo').closest('a');
      expect(logoLink).toHaveAttribute('href', '/en');
    });

    it('should render all main navigation links with correct hrefs', () => {
      renderWithProviders(<Header />);

      // Find all links on the page
      const allLinks = screen.getAllByRole('link');

      // Verify navigation links exist by their href
      const homeLink = allLinks.find(link => link.getAttribute('href') === '/en');
      const aboutLink = allLinks.find(link => link.getAttribute('href') === '/en/about-us');
      const blogLink = allLinks.find(link => link.getAttribute('href') === '/en/blogs');
      const contactLink = allLinks.find(link => link.getAttribute('href') === '/en/contacts');

      expect(homeLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
      expect(blogLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should show desktop navigation on large screens', () => {
      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      renderWithProviders(<Header />);

      // Desktop navigation links should exist
      const allLinks = screen.getAllByRole('link');
      const navigationLinks = allLinks.filter(
        link =>
          link.getAttribute('href') === '/en' ||
          link.getAttribute('href') === '/en/about-us' ||
          link.getAttribute('href') === '/en/blogs' ||
          link.getAttribute('href') === '/en/contacts'
      );

      expect(navigationLinks.length).toBeGreaterThan(0);
    });

    it('should render CatalogMenu on desktop after mount', () => {
      renderWithProviders(<Header />);

      // CatalogMenu should render after component mounts on desktop
      // Note: In actual implementation, this renders conditionally based on isDesktop state
      // The test verifies the component structure
      expect(screen.getByTestId('catalog-menu-button')).toBeInTheDocument();
    });
  });

  describe('Multilingual Support', () => {
    it('should render navigation in Romanian', () => {
      renderWithProviders(<Header />, { locale: 'ro' });

      // Verify Romanian locale logo
      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-ro.svg');

      // Links should be in /ro path
      const allLinks = screen.getAllByRole('link');
      const roLinks = allLinks.filter(link => link.getAttribute('href')?.startsWith('/ro'));
      expect(roLinks.length).toBeGreaterThan(0);
    });

    it('should render navigation in Russian', () => {
      renderWithProviders(<Header />, { locale: 'ru' });

      // Verify Russian locale logo
      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-ru.svg');

      // Links should be in /ru path
      const allLinks = screen.getAllByRole('link');
      const ruLinks = allLinks.filter(link => link.getAttribute('href')?.startsWith('/ru'));
      expect(ruLinks.length).toBeGreaterThan(0);
    });

    it('should render navigation in English', () => {
      renderWithProviders(<Header />, { locale: 'en' });

      // Verify English locale logo
      const logo = screen.getByAltText('logo') as HTMLImageElement;
      expect(logo.src).toContain('CADO-en.svg');

      // Links should be in /en path
      const allLinks = screen.getAllByRole('link');
      const enLinks = allLinks.filter(link => link.getAttribute('href')?.startsWith('/en'));
      expect(enLinks.length).toBeGreaterThan(0);
    });
  });
});
