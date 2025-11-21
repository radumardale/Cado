/**
 * PayNet API type definitions
 * Used for payment processing through PayNet gateway
 */

/**
 * Product structure for PayNet payment API
 */
export interface PayNetProduct {
  GroupName: string;
  GroupId: number;
  LineNo: number;
  Code: string;
  Barcode: number;
  Name: string;
  Description: string;
  UnitPrice: number;
  UnitProduct: number;
  Amount: number;
}

/**
 * Customer information for PayNet payment API
 */
export interface PayNetCustomer {
  Code: string;
  Name: string;
  NameFirst: string;
  NameLast: string;
  email: string;
  Country: string;
  City: string;
  Address: string;
  PhoneNumber: string;
}

/**
 * Service structure for PayNet payment request
 */
export interface PayNetService {
  Name: string;
  Description: string;
  Amount: number;
  Products: PayNetProduct[];
}

/**
 * Complete PayNet payment request body
 */
export interface PayNetRequest {
  Invoice: number;
  MerchantCode: string | undefined;
  SaleAreaCode: string | undefined;
  LinkUrlSuccess: string;
  LinkUrlCancel: string;
  Signature: null;
  SignVersion: string;
  Customer: PayNetCustomer;
  Payer: null;
  Currency: number;
  ExternalDate: string;
  ExpiryDate: string;
  Services: PayNetService[];
  MoneyType: null;
}

/**
 * PayNet payment API response
 */
export interface PayNetResponse {
  PaymentId: string;
  ExpiryDate: string;
  Signature: string;
}
