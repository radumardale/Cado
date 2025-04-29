export enum Ocasions {
    WELCOME_KIT = "WELCOME_KIT",
    MARCH_8 = "MARCH_8",
    FEBRUARY_23 = "FEBRUARY_23",
    CHRISTMAS_GIFTS = "CHRISTMAS_GIFTS",
    EASTER_GIFTS = "EASTER_GIFTS",
    FOR_HOME_AND_OFFICE = "FOR_HOME_AND_OFFICE",
    FOR_TEAM = "FOR_TEAM",
    OTHERS = "OTHERS",
  };

  export const OcasionsArr = Object.values(Ocasions).filter(value => typeof value === 'string') as string[];

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
  [Ocasions.MARCH_8]: {
    title: {
      ro: "8 martie",
      ru: "8 марта",
      en: "March 8"
    }
  },
  [Ocasions.FEBRUARY_23]: {
    title: {
      ro: "23 februarie",
      ru: "23 февраля",
      en: "February 23"
    }
  },
  [Ocasions.CHRISTMAS_GIFTS]: {
    title: {
      ro: "Cadouri de Craciun",
      ru: "Рождественские подарки",
      en: "Christmas Gifts"
    }
  },
  [Ocasions.EASTER_GIFTS]: {
    title: {
      ro: "Cadouri de Paste",
      ru: "Пасхальные подарки",
      en: "Easter Gifts"
    }
  },
  [Ocasions.FOR_HOME_AND_OFFICE]: {
    title: {
      ro: "Pentru casa si oficiu",
      ru: "Для дома и офиса",
      en: "For Home and Office"
    }
  },
  [Ocasions.FOR_TEAM]: {
    title: {
      ro: "Pentru echipa",
      ru: "Для команды",
      en: "For Team"
    }
  },
  [Ocasions.OTHERS]: {
    title: {
      ro: "Altele",
      ru: "Другое",
      en: "Others"
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