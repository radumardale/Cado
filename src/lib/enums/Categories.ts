import { findEnumByText } from './findEnumByText';

export enum Categories {
  FOR_HER = 'FOR_HER',
  FOR_HIM = 'FOR_HIM',
  FOR_KIDS = 'FOR_KIDS',
  ACCESSORIES = 'ACCESSORIES',
  FLOWERS_AND_BALLOONS = 'FLOWERS_AND_BALLOONS',
  GIFT_SET = 'GIFT_SET',
}

export const CategoriesArr = Object.values(Categories).filter(
  value => typeof value === 'string'
) as string[];

/**
 * Category translation structure using shared multilingual type.
 */
interface CategoryTranslation {
  title: MultilingualString;
}

/**
 * Translations for all product categories in ro/ru/en.
 */
export const categoryTranslations: Record<Categories, CategoryTranslation> = {
  [Categories.FOR_HIM]: {
    title: {
      ro: 'Pentru El',
      ru: 'Для Него',
      en: 'For Him',
    },
  },
  [Categories.FOR_HER]: {
    title: {
      ro: 'Pentru Ea',
      ru: 'Для Нее',
      en: 'For Her',
    },
  },
  [Categories.FOR_KIDS]: {
    title: {
      ro: 'Pentru Copii',
      ru: 'Для Детей',
      en: 'For Kids',
    },
  },
  [Categories.ACCESSORIES]: {
    title: {
      ro: 'Accesorii',
      ru: 'Аксессуары',
      en: 'Accessories',
    },
  },
  [Categories.FLOWERS_AND_BALLOONS]: {
    title: {
      ro: 'Flori & Baloane',
      ru: 'Цветы и Шары',
      en: 'Flowers & Balloons',
    },
  },
  [Categories.GIFT_SET]: {
    title: {
      ro: 'Seturi cadou',
      ru: 'Подарочные наборы',
      en: 'Gift Sets',
    },
  },
};

export function findCategoriesByText(input: string): Categories[] {
  return findEnumByText(input, Object.values(Categories), categoryTranslations);
}
