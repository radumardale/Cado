export enum TermsSections {
    TERMS_AND_CONDITIONS = "TERMS_AND_CONDITIONS",
    CONFIDENTIALITY = "CONFIDENTIALITY",
    PAYMENT_AND_SECURITY = "PAYMENT_AND_SECURITY",
    ORDERS = "ORDERS",
    RETURN = "RETURN",
    SUPPORT = "SUPPORT"
  };

  export const TermsSectionsArr = Object.values(TermsSections).filter(value => typeof value === 'string') as string[];