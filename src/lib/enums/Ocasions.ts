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