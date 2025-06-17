export enum ProductContent {
    ACCESSORIES_FOR_DRINKS = "ACCESSORIES_FOR_DRINKS",
    ACCESSORIES_FOR_TEA_COFFEE = "ACCESSORIES_FOR_TEA_COFFEE",
    FOR_OFFICE = "FOR_OFFICE",
    FOR_HOME = "FOR_HOME",
    GAMES = "GAMES",
    TOYS = "TOYS",
    STATIONERY_ITEMS = "STATIONERY_ITEMS",
    COFFEE_TEA = "COFFEE_TEA",
    MUG_THERMOS_BOTTLE_FOR_WATER = "MUG_THERMOS_BOTTLE_FOR_WATER",
    HONEY_JAM_CARAMEL_PEANUT_BUTTER = "HONEY_JAM_CARAMEL_PEANUT_BUTTER",
    NUTS_DRY_FRUITS_SPICES = "NUTS_DRY_FRUITS_SPICES",
    CHOCOLATE_BISCUITS_CANDY = "CHOCOLATE_BISCUITS_CANDY",
    PACKAGING_CRAFT_BOX = "PACKAGING_CRAFT_BOX",
    PACKAGING_CARDBOARD_BOX_DESIGN = "PACKAGING_CARDBOARD_BOX_DESIGN",
    PACKAGING_WOODEN = "PACKAGING_WOODEN",
    PACKAGING_CUSTOM_BAG = "PACKAGING_CUSTOM_BAG",
    PACKAGING_CUSTOM_DESIGN = "PACKAGING_CUSTOM_DESIGN",
    GOURMET_ACCESSORIES = "GOURMET_ACCESSORIES",
  };
  
  export const ProductContentArr = Object.values(ProductContent).filter(value => typeof value === 'string') as string[];

  // Define the translation interface for ProductContent
interface ProductContentTranslation {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
}

// Helper function for normalization
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Update the translations with normalized titles directly
const productContentTranslations: Record<ProductContent, ProductContentTranslation> = {
  [ProductContent.ACCESSORIES_FOR_DRINKS]: {
    title: {
      ro: normalizeText("Accesorii pentru băuturi"),
      ru: normalizeText("Аксессуары для напитков"),
      en: normalizeText("Accessories for drinks")
    }
  },
  [ProductContent.ACCESSORIES_FOR_TEA_COFFEE]: {
    title: {
      ro: normalizeText("Accesorii pentru ceai/cafea"),
      ru: normalizeText("Аксессуары для чая/кофе"),
      en: normalizeText("Accessories for tea/coffee")
    }
  },
  [ProductContent.FOR_OFFICE]: {
    title: {
      ro: normalizeText("Pentru birou"),
      ru: normalizeText("Для офиса"),
      en: normalizeText("For office")
    }
  },
  [ProductContent.FOR_HOME]: {
    title: {
      ro: normalizeText("Pentru casă"),
      ru: normalizeText("Для дома"),
      en: normalizeText("For home")
    }
  },
  [ProductContent.GAMES]: {
    title: {
      ro: normalizeText("Jocuri"),
      ru: normalizeText("Игры"),
      en: normalizeText("Games")
    }
  },
  [ProductContent.TOYS]: {
    title: {
      ro: normalizeText("Jucării"),
      ru: normalizeText("Игрушки"),
      en: normalizeText("Toys")
    }
  },
  [ProductContent.STATIONERY_ITEMS]: {
    title: {
      ro: normalizeText("Articole de papetărie"),
      ru: normalizeText("Канцелярские товары"),
      en: normalizeText("Stationery items")
    }
  },
  [ProductContent.COFFEE_TEA]: {
    title: {
      ro: normalizeText("Cafea/ceai"),
      ru: normalizeText("Кофе/чай"),
      en: normalizeText("Coffee/tea")
    }
  },
  [ProductContent.MUG_THERMOS_BOTTLE_FOR_WATER]: {
    title: {
      ro: normalizeText("Cană/cană termos/sticlă pentru apă"),
      ru: normalizeText("Кружка/термос/бутылка для воды"),
      en: normalizeText("Mug/thermos/bottle for water")
    }
  },
  [ProductContent.HONEY_JAM_CARAMEL_PEANUT_BUTTER]: {
    title: {
      ro: normalizeText("Miere/dulceață/caramelă/pastă de arahide"),
      ru: normalizeText("Мёд/джем/карамель/арахисовая паста"),
      en: normalizeText("Honey/jam/caramel/peanut butter")
    }
  },
  [ProductContent.NUTS_DRY_FRUITS_SPICES]: {
    title: {
      ro: normalizeText("Nuci/fructe uscate/condimente"),
      ru: normalizeText("Орехи/сухофрукты/специи"),
      en: normalizeText("Nuts/dry fruits/spices")
    }
  },
  [ProductContent.CHOCOLATE_BISCUITS_CANDY]: {
    title: {
      ro: normalizeText("Ciocolată/biscuiți/bomboane"),
      ru: normalizeText("Шоколад/печенье/конфеты"),
      en: normalizeText("Chocolate/biscuits/candy")
    }
  },
  [ProductContent.PACKAGING_CRAFT_BOX]: {
    title: {
      ro: normalizeText("Ambalaj - cutie craft"),
      ru: normalizeText("Упаковка - крафт коробка"),
      en: normalizeText("Packaging - craft box")
    }
  },
  [ProductContent.PACKAGING_CARDBOARD_BOX_DESIGN]: {
    title: {
      ro: normalizeText("Ambalaj - cutie din carton caserat/design"),
      ru: normalizeText("Упаковка - дизайнерская картонная коробка"),
      en: normalizeText("Packaging - cardboard box design")
    }
  },
  [ProductContent.PACKAGING_WOODEN]: {
    title: {
      ro: normalizeText("Ambalaj - din lemn"),
      ru: normalizeText("Упаковка - деревянная"),
      en: normalizeText("Packaging - wooden")
    }
  },
  [ProductContent.PACKAGING_CUSTOM_BAG]: {
    title: {
      ro: normalizeText("Ambalaj - pungă personalizată"),
      ru: normalizeText("Упаковка - индивидуальный пакет"),
      en: normalizeText("Packaging - custom bag")
    }
  },
  [ProductContent.PACKAGING_CUSTOM_DESIGN]: {
    title: {
      ro: normalizeText("Ambalaj - design individual"),
      ru: normalizeText("Упаковка - индивидуальный дизайн"),
      en: normalizeText("Packaging - custom design")
    }
  },
  [ProductContent.GOURMET_ACCESSORIES]: {
    title: {
      ro: normalizeText("Accesorii gastronomice"),
      ru: normalizeText("Гастрономические аксессуары"),
      en: normalizeText("Gourmet Accessories")
    }
  },
};

export function findProductContentByText(input: string): ProductContent[] {
  if (!input?.trim() || input.length < 1) return Object.values(ProductContent);
  
  const normalizedInput = input.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const matches: ProductContent[] = [];
  
  // Check if input is already a ProductContent enum value
  const enumValue = normalizedInput.toUpperCase().replace(/ /g, '_');
  if (Object.values(ProductContent).includes(enumValue as ProductContent)) {
    matches.push(enumValue as ProductContent);
  }
  
  // Check against all translations
  for (const [content, translations] of Object.entries(productContentTranslations)) {
    // Check all languages
    for (const language of ['ro', 'ru', 'en'] as const) {
      if (translations.title[language].toLowerCase() === normalizedInput) {
        // Ensure we don't add duplicates
        if (!matches.includes(content as ProductContent)) {
          matches.push(content as ProductContent);
        }
      }
    }
  }
  
  // If no exact matches, try fuzzy matching for partial matches
  if (matches.length === 0) {
    for (const [content, translations] of Object.entries(productContentTranslations)) {
      for (const language of ['ro', 'ru', 'en'] as const) {
        const title = translations.title[language].toLowerCase();
        
        // Check if input contains the product content name or vice versa
        if (title.includes(normalizedInput) || normalizedInput.includes(title)) {
          if (!matches.includes(content as ProductContent)) {
            matches.push(content as ProductContent);
          }
        }
      }
    }
  }
  
  return matches;
}