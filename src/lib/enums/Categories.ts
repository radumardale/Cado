export enum Categories {
    FOR_HIM = "FOR_HIM",
    FOR_HER = "FOR_HER",
    FOR_KIDS = "FOR_KIDS",
    ACCESSORIES = "ACCESSORIES",
    FLOWERS_AND_BALLOONS = "FLOWERS_AND_BALLOONS",
    GIFT_SET = "GIFT_SET"
  };

  export const CategoriesArr = Object.values(Categories).filter(value => typeof value === 'string') as string[];