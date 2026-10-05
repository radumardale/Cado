import { findEnumByText } from './findEnumByText';

export enum Ocasions {
  WELCOME_KIT = 'WELCOME_KIT',
  FOR_TEAM = 'FOR_TEAM',
  SCHOOL_HOLIDAYS = 'SCHOOL_HOLIDAYS',
  VALENTINES_DAY = 'VALENTINES_DAY',
  MARCH_8 = 'MARCH_8',
  CHRISTMAS_NEW_YEAR = 'CHRISTMAS_NEW_YEAR',
  EASTER = 'EASTER',
  VIP_GIFTS = 'VIP_GIFTS',
  FOR_HOME_AND_OFFICE = 'FOR_HOME_AND_OFFICE',
  FOR_TRAVEL = 'FOR_TRAVEL',
  MINI_GIFTS = 'MINI_GIFTS',
  // GASTRONOMIC = "GASTRONOMIC",
  PROMOTIONAL = 'PROMOTIONAL',
  UNIVERSAL = 'UNIVERSAL',
}

export const OcasionsArr = Object.values(Ocasions).filter(
  value => typeof value === 'string'
) as string[];
export const MenuOcasionsArr = [
  'WELCOME_KIT',
  'VALENTINES_DAY',
  'MARCH_8',
  'CHRISTMAS_NEW_YEAR',
  'EASTER',
  'FOR_HOME_AND_OFFICE',
  'UNIVERSAL',
  'FOR_TEAM',
  'PROMOTIONAL',
];

// Define the translation interface for Ocasions
interface OcasionTranslation {
  title: MultilingualString;
}

// Create the translations record for Ocasions
export const ocasionTranslations: Record<Ocasions, OcasionTranslation> = {
  [Ocasions.WELCOME_KIT]: {
    title: {
      ro: 'Welcome Kit',
      ru: 'Приветственный набор',
      en: 'Welcome Kit',
    },
  },
  [Ocasions.FOR_TEAM]: {
    title: {
      ro: 'Pentru echipă',
      ru: 'Для команды',
      en: 'For Team',
    },
  },
  [Ocasions.SCHOOL_HOLIDAYS]: {
    title: {
      ro: 'Sărbători școlare',
      ru: 'Школьные праздники',
      en: 'School Holidays',
    },
  },
  [Ocasions.VALENTINES_DAY]: {
    title: {
      ro: 'Ziua Îndrăgostiților',
      ru: 'День святого Валентина',
      en: "Valentine's Day",
    },
  },
  [Ocasions.MARCH_8]: {
    title: {
      ro: '8 Martie (Ziua Femeilor)',
      ru: '8 марта',
      en: "March 8 (Women's Day)",
    },
  },
  [Ocasions.CHRISTMAS_NEW_YEAR]: {
    title: {
      ro: 'Crăciun & Anul Nou',
      ru: 'Рождество и Новый год',
      en: 'Christmas & New Year',
    },
  },
  [Ocasions.EASTER]: {
    title: {
      ro: 'Paște',
      ru: 'Пасха',
      en: 'Easter',
    },
  },
  [Ocasions.VIP_GIFTS]: {
    title: {
      ro: 'Cadouri VIP',
      ru: 'VIP-подарки',
      en: 'VIP Gifts',
    },
  },
  [Ocasions.FOR_HOME_AND_OFFICE]: {
    title: {
      ro: 'Pentru casă și birou',
      ru: 'Для дома и офиса',
      en: 'For Home and Office',
    },
  },
  [Ocasions.FOR_TRAVEL]: {
    title: {
      ro: 'Pentru călătorii',
      ru: 'Для путешествий',
      en: 'For Travel',
    },
  },
  [Ocasions.MINI_GIFTS]: {
    title: {
      ro: 'Mini-cadouri & Complimente',
      ru: 'Мини-подарки и комплименты',
      en: 'Mini Gifts & Compliments',
    },
  },
  // [Ocasions.GASTRONOMIC]: {
  //   title: {
  //     ro: "Gastronomice",
  //     ru: "Гастрономические",
  //     en: "Gastronomic"
  //   }
  // },
  [Ocasions.PROMOTIONAL]: {
    title: {
      ro: 'Promoționale',
      ru: 'Рекламные',
      en: 'Promotional',
    },
  },
  [Ocasions.UNIVERSAL]: {
    title: {
      ro: 'Universale',
      ru: 'Универсальные',
      en: 'Universal',
    },
  },
};

export function findOcasionsByText(input: string): Ocasions[] {
  return findEnumByText(input, Object.values(Ocasions), ocasionTranslations);
}
