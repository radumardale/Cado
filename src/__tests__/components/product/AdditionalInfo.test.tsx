import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import AdditionalInfo from '@/components/product/AdditionalInfo';
import { createMockProduct } from '@/__tests__/helpers/componentTestUtils';
import { Categories } from '@/lib/enums/Categories';
import { ProductContent } from '@/lib/enums/ProductContent';
import { Ocasions } from '@/lib/enums/Ocasions';

/**
 * Mock dependencies - MUST be before component imports
 */

// Mock SCSS module
vi.mock('@/components/product/product.module.scss', () => ({
  default: {
    productDescription: 'productDescription',
  },
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid='plus-icon'>+</span>,
}));

// Mock next-intl with proper translation lookup
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: (namespace?: string) => (key: string) => {
    const translations: Record<string, string> = {
      // ProductPage namespace
      includes: 'Gift Includes',
      includes_info: 'The set composition may vary',
      description: 'Description',
      features: 'Features',
      material: 'Material',
      dimensions: 'Dimensions',
      weight: 'Weight',
      color: 'Color',
      category: 'Category',
      content: 'Content',
      ocasion: 'Occasion',
      number: 'Number of items',
      id: 'Product ID',
      // Tags namespace (categories)
      'Tags.FLOWERS_AND_BALLOONS.title': 'Flowers & Balloons',
      'Tags.GIFT_SET.title': 'Gift Sets',
      'Tags.ACCESSORIES.title': 'Accessories',
      // product_content namespace
      'product_content.CHOCOLATE_BISCUITS_CANDY': 'Chocolate/biscuits/candy',
      'product_content.COFFEE_TEA': 'Coffee/tea',
      // ocasions namespace
      'ocasions.UNIVERSAL.title': 'Universal',
      'ocasions.VALENTINES_DAY.title': "Valentine's Day",
      'ocasions.CHRISTMAS_NEW_YEAR.title': 'Christmas & New Year',
    };

    // Handle both direct keys and namespaced keys
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return translations[key] || translations[fullKey] || key;
  },
}));

// Mock the Accordion component
vi.mock('@/components/home/faq/Accordion', () => ({
  default: ({
    title,
    children,
    open,
    setActiveIndex,
  }: {
    title: string;
    children: React.ReactNode;
    open: boolean;
    setActiveIndex: () => void;
  }) => (
    <div data-testid='accordion' data-open={open}>
      <button onClick={setActiveIndex} data-testid={`accordion-${title}`}>
        {title}
      </button>
      {open && <div data-testid='accordion-content'>{children}</div>}
    </div>
  ),
}));

describe('AdditionalInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render all three accordions for multi-item products', () => {
      const product = createMockProduct({
        nr_of_items: 3,
        long_description: {
          en: '<p>Long description</p>',
          ro: '<p>Descriere lungă</p>',
          ru: '<p>Длинное описание</p>',
        },
        set_description: {
          en: '<p>Set contents</p>',
          ro: '<p>Conținut set</p>',
          ru: '<p>Содержимое набора</p>',
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY, ProductContent.COFFEE_TEA],
        ocasions: [Ocasions.UNIVERSAL],
      });

      render(<AdditionalInfo product={product} locale='en' />);

      // All three accordions should be rendered
      expect(screen.getByText('Gift Includes')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('should NOT render "includes" accordion for single-item products', () => {
      const product = createMockProduct({
        nr_of_items: 1,
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
      });

      render(<AdditionalInfo product={product} locale='en' />);

      // Should NOT have "includes" accordion
      expect(screen.queryByText('Gift Includes')).not.toBeInTheDocument();

      // Should still have description and features
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('should render set description for multi-item products', () => {
      const product = createMockProduct({
        nr_of_items: 2,
        set_description: {
          en: '<p>Set includes 2 items</p>',
          ro: '<p>Setul include 2 articole</p>',
          ru: '<p>Набор включает 2 предмета</p>',
        },
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
      });

      render(<AdditionalInfo product={product} locale='en' />);

      // Open includes accordion
      const includesButton = screen.getByText('Gift Includes');
      fireEvent.click(includesButton);

      // Set description should be visible
      expect(screen.getByText(/Set includes 2 items/)).toBeInTheDocument();

      // Should show info message with email link
      expect(screen.getByText(/The set composition may vary/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /order@cado.md/ })).toHaveAttribute(
        'href',
        'mailto:order@cado.md'
      );
    });
  });

  describe('Features Section - Optional Info', () => {
    it('should render material if provided', () => {
      const product = createMockProduct({
        optional_info: {
          material: {
            en: 'Silk',
            ro: 'Mătase',
            ru: 'Шелк',
          },
          dimensions: '',
          weight: '',
          color: {
            en: '',
            ro: '',
            ru: '',
          },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      // Open features accordion
      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Material:')).toBeInTheDocument();
      expect(screen.getByText('Silk')).toBeInTheDocument();
    });

    it('should NOT render material if empty', () => {
      const product = createMockProduct({
        optional_info: {
          material: {
            en: '',
            ro: '',
            ru: '',
          },
          dimensions: '',
          weight: '',
          color: {
            en: '',
            ro: '',
            ru: '',
          },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      // Open features accordion
      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.queryByText('Material:')).not.toBeInTheDocument();
    });

    it('should render dimensions if provided', () => {
      const product = createMockProduct({
        optional_info: {
          material: { en: '', ro: '', ru: '' },
          dimensions: '30x20x15 cm',
          weight: '',
          color: { en: '', ro: '', ru: '' },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Dimensions:')).toBeInTheDocument();
      expect(screen.getByText('30x20x15 cm')).toBeInTheDocument();
    });

    it('should render weight if provided', () => {
      const product = createMockProduct({
        optional_info: {
          material: { en: '', ro: '', ru: '' },
          dimensions: '',
          weight: '500g',
          color: { en: '', ro: '', ru: '' },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Weight:')).toBeInTheDocument();
      expect(screen.getByText('500g')).toBeInTheDocument();
    });

    it('should render color if provided', () => {
      const product = createMockProduct({
        optional_info: {
          material: { en: '', ro: '', ru: '' },
          dimensions: '',
          weight: '',
          color: {
            en: 'Red',
            ro: 'Roșu',
            ru: 'Красный',
          },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Color:')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('should render all optional info fields when provided', () => {
      const product = createMockProduct({
        optional_info: {
          material: { en: 'Silk', ro: 'Mătase', ru: 'Шелк' },
          dimensions: '30x20 cm',
          weight: '250g',
          color: { en: 'Blue', ro: 'Albastru', ru: 'Синий' },
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Material:')).toBeInTheDocument();
      expect(screen.getByText('Silk')).toBeInTheDocument();
      expect(screen.getByText('Dimensions:')).toBeInTheDocument();
      expect(screen.getByText('30x20 cm')).toBeInTheDocument();
      expect(screen.getByText('Weight:')).toBeInTheDocument();
      expect(screen.getByText('250g')).toBeInTheDocument();
      expect(screen.getByText('Color:')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
    });
  });

  describe('Features Section - Required Info', () => {
    it('should render categories with proper formatting', () => {
      const product = createMockProduct({
        categories: [Categories.FLOWERS_AND_BALLOONS, Categories.GIFT_SET, Categories.ACCESSORIES],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Category:')).toBeInTheDocument();
      // Check parent element contains all category text (they're separated by commas)
      const categorySection = screen.getByText('Category:').parentElement;
      expect(categorySection).toHaveTextContent('Flowers & Balloons');
      expect(categorySection).toHaveTextContent('Gift Sets');
      expect(categorySection).toHaveTextContent('Accessories');
    });

    it('should render product content with proper formatting', () => {
      const product = createMockProduct({
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY, ProductContent.COFFEE_TEA],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Content:')).toBeInTheDocument();
      // Product content should be present
      const contentSection = screen.getByText('Content:').parentElement;
      expect(contentSection).toHaveTextContent('Chocolate');
      expect(contentSection).toHaveTextContent('Coffee');
    });

    it('should render occasions with proper formatting', () => {
      const product = createMockProduct({
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL, Ocasions.VALENTINES_DAY, Ocasions.CHRISTMAS_NEW_YEAR],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Occasion:')).toBeInTheDocument();
      const occasionSection = screen.getByText('Occasion:').parentElement;
      expect(occasionSection).toHaveTextContent('Universal');
      expect(occasionSection).toHaveTextContent('Valentine');
      expect(occasionSection).toHaveTextContent('Christmas');
    });

    it('should render number of items for multi-item products', () => {
      const product = createMockProduct({
        nr_of_items: 5,
        set_description: {
          en: '<p>Set description</p>',
          ro: '<p>Descriere set</p>',
          ru: '<p>Описание набора</p>',
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText(/Number of items:/)).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it('should NOT render number of items for single-item products', () => {
      const product = createMockProduct({
        nr_of_items: 1,
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.queryByText(/Number of items:/)).not.toBeInTheDocument();
    });

    it('should render product ID', () => {
      const product = createMockProduct({
        custom_id: 'PROD123',
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
        long_description: {
          en: '<p>Description</p>',
          ro: '<p>Descriere</p>',
          ru: '<p>Описание</p>',
        },
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const featuresButton = screen.getByText('Features');
      fireEvent.click(featuresButton);

      expect(screen.getByText('Product ID:')).toBeInTheDocument();
      expect(screen.getByText('PROD123')).toBeInTheDocument();
    });
  });

  describe('Accordion State Management', () => {
    it('should maintain independent accordion states', () => {
      const product = createMockProduct({
        nr_of_items: 2,
        set_description: {
          en: '<p>Set description</p>',
          ro: '<p>Descriere set</p>',
          ru: '<p>Описание набора</p>',
        },
        long_description: {
          en: '<p>Long description</p>',
          ro: '<p>Descriere lungă</p>',
          ru: '<p>Длинное описание</p>',
        },
        categories: [Categories.FLOWERS_AND_BALLOONS],
        product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY],
        ocasions: [Ocasions.UNIVERSAL],
      });

      render(<AdditionalInfo product={product} locale='en' />);

      const includesButton = screen.getByText('Gift Includes');
      const descriptionButton = screen.getByText('Description');
      const featuresButton = screen.getByText('Features');

      // Initially all should be closed
      expect(includesButton.parentElement).toHaveAttribute('data-open', 'false');
      expect(descriptionButton.parentElement).toHaveAttribute('data-open', 'false');
      expect(featuresButton.parentElement).toHaveAttribute('data-open', 'false');
    });
  });
});
