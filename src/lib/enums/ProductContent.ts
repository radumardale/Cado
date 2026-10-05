import { findEnumByText } from './findEnumByText';

export enum ProductContent {
  ACCESSORIES_FOR_DRINKS = 'ACCESSORIES_FOR_DRINKS',
  ACCESSORIES_FOR_TEA_COFFEE = 'ACCESSORIES_FOR_TEA_COFFEE',
  GOURMET_ACCESSORIES = 'GOURMET_ACCESSORIES',
  FOR_OFFICE = 'FOR_OFFICE',
  FOR_HOME = 'FOR_HOME',
  GAMES = 'GAMES',
  TOYS = 'TOYS',
  STATIONERY_ITEMS = 'STATIONERY_ITEMS',
  COFFEE_TEA = 'COFFEE_TEA',
  MUG_THERMOS_BOTTLE_FOR_WATER = 'MUG_THERMOS_BOTTLE_FOR_WATER',
  HONEY_JAM_CARAMEL_PEANUT_BUTTER = 'HONEY_JAM_CARAMEL_PEANUT_BUTTER',
  NUTS_DRY_FRUITS_SPICES = 'NUTS_DRY_FRUITS_SPICES',
  CHOCOLATE_BISCUITS_CANDY = 'CHOCOLATE_BISCUITS_CANDY',
  PACKAGING_CRAFT_BOX = 'PACKAGING_CRAFT_BOX',
  PACKAGING_CARDBOARD_BOX_DESIGN = 'PACKAGING_CARDBOARD_BOX_DESIGN',
  PACKAGING_WOODEN = 'PACKAGING_WOODEN',
  PACKAGING_CUSTOM_BAG = 'PACKAGING_CUSTOM_BAG',
  PACKAGING_CUSTOM_DESIGN = 'PACKAGING_CUSTOM_DESIGN',
}

export const ProductContentArr = Object.values(ProductContent).filter(
  value => typeof value === 'string'
) as string[];

/**
 * Product content translation structure using shared multilingual type.
 */
interface ProductContentTranslation {
  title: MultilingualString;
}

/**
 * Translations for all product content types in ro/ru/en.
 */
const productContentTranslations: Record<ProductContent, ProductContentTranslation> = {
  [ProductContent.ACCESSORIES_FOR_DRINKS]: {
    title: {
      ro: 'Accesorii pentru băuturi',
      ru: 'Аксессуары для напитков',
      en: 'Accessories for drinks',
    },
  },
  [ProductContent.ACCESSORIES_FOR_TEA_COFFEE]: {
    title: {
      ro: 'Accesorii pentru ceai/cafea',
      ru: 'Аксессуары для чая/кофе',
      en: 'Accessories for tea/coffee',
    },
  },
  [ProductContent.FOR_OFFICE]: {
    title: {
      ro: 'Pentru birou',
      ru: 'Для офиса',
      en: 'For office',
    },
  },
  [ProductContent.FOR_HOME]: {
    title: {
      ro: 'Pentru casă',
      ru: 'Для дома',
      en: 'For home',
    },
  },
  [ProductContent.GAMES]: {
    title: {
      ro: 'Jocuri',
      ru: 'Игры',
      en: 'Games',
    },
  },
  [ProductContent.TOYS]: {
    title: {
      ro: 'Jucării',
      ru: 'Игрушки',
      en: 'Toys',
    },
  },
  [ProductContent.STATIONERY_ITEMS]: {
    title: {
      ro: 'Articole de papetărie',
      ru: 'Канцелярские товары',
      en: 'Stationery items',
    },
  },
  [ProductContent.COFFEE_TEA]: {
    title: {
      ro: 'Cafea/ceai',
      ru: 'Кофе/чай',
      en: 'Coffee/tea',
    },
  },
  [ProductContent.MUG_THERMOS_BOTTLE_FOR_WATER]: {
    title: {
      ro: 'Cană/cană termos/sticlă pentru apă',
      ru: 'Кружка/термос/бутылка для воды',
      en: 'Mug/thermos/bottle for water',
    },
  },
  [ProductContent.HONEY_JAM_CARAMEL_PEANUT_BUTTER]: {
    title: {
      ro: 'Miere/dulceață/caramelă/pastă de arahide',
      ru: 'Мёд/джем/карамель/арахисовая паста',
      en: 'Honey/jam/caramel/peanut butter',
    },
  },
  [ProductContent.NUTS_DRY_FRUITS_SPICES]: {
    title: {
      ro: 'Nuci/fructe uscate/condimente',
      ru: 'Орехи/сухофрукты/специи',
      en: 'Nuts/dry fruits/spices',
    },
  },
  [ProductContent.CHOCOLATE_BISCUITS_CANDY]: {
    title: {
      ro: 'Ciocolată/biscuiți/bomboane',
      ru: 'Шоколад/печенье/конфеты',
      en: 'Chocolate/biscuits/candy',
    },
  },
  [ProductContent.PACKAGING_CRAFT_BOX]: {
    title: {
      ro: 'Ambalaj - cutie craft',
      ru: 'Упаковка - крафт коробка',
      en: 'Packaging - craft box',
    },
  },
  [ProductContent.PACKAGING_CARDBOARD_BOX_DESIGN]: {
    title: {
      ro: 'Ambalaj - cutie din carton caserat/design',
      ru: 'Упаковка - дизайнерская картонная коробка',
      en: 'Packaging - cardboard box design',
    },
  },
  [ProductContent.PACKAGING_WOODEN]: {
    title: {
      ro: 'Ambalaj - din lemn',
      ru: 'Упаковка - деревянная',
      en: 'Packaging - wooden',
    },
  },
  [ProductContent.PACKAGING_CUSTOM_BAG]: {
    title: {
      ro: 'Ambalaj - pungă personalizată',
      ru: 'Упаковка - индивидуальный пакет',
      en: 'Packaging - custom bag',
    },
  },
  [ProductContent.PACKAGING_CUSTOM_DESIGN]: {
    title: {
      ro: 'Ambalaj - design individual',
      ru: 'Упаковка - индивидуальный дизайн',
      en: 'Packaging - custom design',
    },
  },
  [ProductContent.GOURMET_ACCESSORIES]: {
    title: {
      ro: 'Accesorii gastronomice',
      ru: 'Гастрономические аксессуары',
      en: 'Gourmet Accessories',
    },
  },
};

export function findProductContentByText(input: string): ProductContent[] {
  return findEnumByText(input, Object.values(ProductContent), productContentTranslations);
}
