export enum Categories {
    FOR_HER = "FOR_HER",
    FOR_HIM = "FOR_HIM",
    FOR_KIDS = "FOR_KIDS",
    ACCESSORIES = "ACCESSORIES",
    FLOWERS_AND_BALLOONS = "FLOWERS_AND_BALLOONS",
    GIFT_SET = "GIFT_SET",
    CUSTOM = "CUSTOM"
  };

  export const CategoriesArr = Object.values(Categories).filter(value => typeof value === 'string') as string[];