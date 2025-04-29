export enum Categories {
    FOR_HER = "FOR_HER",
    FOR_HIM = "FOR_HIM",
    FOR_KIDS = "FOR_KIDS",
    ACCESSORIES = "ACCESSORIES",
    FLOWERS_AND_BALLOONS = "FLOWERS_AND_BALLOONS",
    GIFT_SET = "GIFT_SET",
  };

  export const CategoriesArr = Object.values(Categories).filter(value => typeof value === 'string') as string[];

  interface CategoryTranslation {
    title: {
      ro: string;
      ru: string;
      en: string;
    };
  }

  const categoryTranslations: Record<Categories, CategoryTranslation> = {
    [Categories.FOR_HIM]: {
      title: {
        ro: "Pentru El",
        ru: "Для Него",
        en: "For Him"
      }
    },
    [Categories.FOR_HER]: {
      title: {
        ro: "Pentru Ea",
        ru: "Для Нее",
        en: "For Her"
      }
    },
    [Categories.FOR_KIDS]: {
      title: {
        ro: "Pentru Copii",
        ru: "Для Детей",
        en: "For Kids"
      }
    },
    [Categories.ACCESSORIES]: {
      title: {
        ro: "Accesorii",
        ru: "Аксессуары",
        en: "Accessories"
      }
    },
    [Categories.FLOWERS_AND_BALLOONS]: {
      title: {
        ro: "Flori & Baloane",
        ru: "Цветы и Шары",
        en: "Flowers & Balloons"
      }
    },
    [Categories.GIFT_SET]: {
      title: {
        ro: "Seturi cadou",
        ru: "Подарочные наборы",
        en: "Gift Sets"
      }
    }
  };

  export function findCategoriesByText(input: string): Categories[] {
    if (!input?.trim() || input.length < 1) return Object.values(Categories);
    
    const normalizedInput = input.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const matches: Categories[] = [];
    
    // Check if input is already a Categories enum value
    if (Object.values(Categories).includes(normalizedInput.toUpperCase() as Categories)) {
      matches.push(normalizedInput.toUpperCase() as Categories);
    }
    
    // Check against all translations
    for (const [category, translations] of Object.entries(categoryTranslations)) {
      // Check all languages
      for (const language of ['ro', 'ru', 'en'] as const) {
        if (translations.title[language].toLowerCase() === normalizedInput) {
          // Ensure we don't add duplicates
          if (!matches.includes(category as Categories)) {
            matches.push(category as Categories);
          }
        }
      }
    }
    
    // If no exact matches, try fuzzy matching for partial matches
    if (matches.length === 0) {
      for (const [category, translations] of Object.entries(categoryTranslations)) {
        for (const language of ['ro', 'ru', 'en'] as const) {
          const title = translations.title[language].toLowerCase();
          
          // Check if input contains the category name or vice versa
          if (title.includes(normalizedInput) || normalizedInput.includes(title)) {
            if (!matches.includes(category as Categories)) {
              matches.push(category as Categories);
            }
          }
        }
      }
    }
    
    return matches;
  }