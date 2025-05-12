export enum Ocasions {
    WELCOME_KIT = "WELCOME_KIT",
    FOR_TEAM = "FOR_TEAM",
    SCHOOL_HOLIDAYS = "SCHOOL_HOLIDAYS",
    VALENTINES_DAY = "VALENTINES_DAY",
    MARCH_8 = "MARCH_8",
    CHRISTMAS_NEW_YEAR = "CHRISTMAS_NEW_YEAR",
    EASTER = "EASTER",
    VIP_GIFTS = "VIP_GIFTS",
    FOR_HOME_AND_OFFICE = "FOR_HOME_AND_OFFICE",
    FOR_TRAVEL = "FOR_TRAVEL",
    MINI_GIFTS = "MINI_GIFTS",
    GASTRONOMIC = "GASTRONOMIC",
    PROMOTIONAL = "PROMOTIONAL",
    UNIVERSAL = "UNIVERSAL",
};

export const OcasionsArr = Object.values(Ocasions).filter(value => typeof value === 'string') as string[];
export const MenuOcasionsArr = ["WELCOME_KIT", "VALENTINES_DAY", "MARCH_8", "CHRISTMAS_NEW_YEAR", "EASTER", "FOR_HOME_AND_OFFICE", "UNIVERSAL"];

// Define the translation interface for Ocasions
interface OcasionTranslation {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
}

// Create the translations record for Ocasions
const ocasionTranslations: Record<Ocasions, OcasionTranslation> = {
  [Ocasions.WELCOME_KIT]: {
    title: {
      ro: "Welcome Kit",
      ru: "Приветственный набор",
      en: "Welcome Kit"
    }
  },
  [Ocasions.FOR_TEAM]: {
    title: {
      ro: "Pentru echipă",
      ru: "Для команды",
      en: "For Team"
    }
  },
  [Ocasions.SCHOOL_HOLIDAYS]: {
    title: {
      ro: "Sărbători școlare",
      ru: "Школьные праздники",
      en: "School Holidays"
    }
  },
  [Ocasions.VALENTINES_DAY]: {
    title: {
      ro: "Ziua Îndrăgostiților",
      ru: "День святого Валентина",
      en: "Valentine's Day"
    }
  },
  [Ocasions.MARCH_8]: {
    title: {
      ro: "8 Martie (Ziua Femeilor)",
      ru: "8 марта",
      en: "March 8 (Women's Day)"
    }
  },
  [Ocasions.CHRISTMAS_NEW_YEAR]: {
    title: {
      ro: "Crăciun & Anul Nou",
      ru: "Рождество и Новый год",
      en: "Christmas & New Year"
    }
  },
  [Ocasions.EASTER]: {
    title: {
      ro: "Paște",
      ru: "Пасха",
      en: "Easter"
    }
  },
  [Ocasions.VIP_GIFTS]: {
    title: {
      ro: "Cadouri VIP",
      ru: "VIP-подарки",
      en: "VIP Gifts"
    }
  },
  [Ocasions.FOR_HOME_AND_OFFICE]: {
    title: {
      ro: "Pentru casă și birou",
      ru: "Для дома и офиса",
      en: "For Home and Office"
    }
  },
  [Ocasions.FOR_TRAVEL]: {
    title: {
      ro: "Pentru călătorii",
      ru: "Для путешествий",
      en: "For Travel"
    }
  },
  [Ocasions.MINI_GIFTS]: {
    title: {
      ro: "Mini-cadouri & Complimente",
      ru: "Мини-подарки и комплименты",
      en: "Mini Gifts & Compliments"
    }
  },
  [Ocasions.GASTRONOMIC]: {
    title: {
      ro: "Gastronomice",
      ru: "Гастрономические",
      en: "Gastronomic"
    }
  },
  [Ocasions.PROMOTIONAL]: {
    title: {
      ro: "Promoționale",
      ru: "Рекламные",
      en: "Promotional"
    }
  },
  [Ocasions.UNIVERSAL]: {
    title: {
      ro: "Universale",
      ru: "Универсальные",
      en: "Universal"
    }
  }
};

export function findOcasionsByText(input: string): Ocasions[] {
  if (!input?.trim() || input.length < 1) return Object.values(Ocasions);
  
  const normalizedInput = input.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const matches: Ocasions[] = [];
  
  // Check if input is already an Ocasions enum value
  const enumValue = normalizedInput.toUpperCase().replace(/ /g, '_');
  if (Object.values(Ocasions).includes(enumValue as Ocasions)) {
    matches.push(enumValue as Ocasions);
  }
  
  // Check against all translations
  for (const [ocasion, translations] of Object.entries(ocasionTranslations)) {
    // Check all languages
    for (const language of ['ro', 'ru', 'en'] as const) {
      if (translations.title[language].toLowerCase() === normalizedInput) {
        // Ensure we don't add duplicates
        if (!matches.includes(ocasion as Ocasions)) {
          matches.push(ocasion as Ocasions);
        }
      }
    }
  }
  
  // If no exact matches, try fuzzy matching for partial matches
  if (matches.length === 0) {
    for (const [ocasion, translations] of Object.entries(ocasionTranslations)) {
      for (const language of ['ro', 'ru', 'en'] as const) {
        const title = translations.title[language].toLowerCase();
        
        // Check if input contains the occasion name or vice versa
        if (title.includes(normalizedInput) || normalizedInput.includes(title)) {
          if (!matches.includes(ocasion as Ocasions)) {
            matches.push(ocasion as Ocasions);
          }
        }
      }
    }
  }
  
  return matches;
}