import type { ProductInterface } from '@/models/product/types/productInterface';
import type { OrderInterface } from '@/models/order/types/orderInterface';
import type { BlogInterface } from '@/models/blog/types/BlogInterface';
import type { ClientInterface } from '@/models/client/types/clientInterface';

/**
 * Base aggregation result type
 * Use for simple aggregation pipelines that return an array
 */
export type AggregationResult<T> = T[];

/**
 * Facet aggregation result type
 * Use for $facet aggregations that return multiple result sets
 *
 * @example
 * const results = await Product.aggregate<FacetAggregationResult<ProductQueryResult>>([
 *   { $facet: { products: [...], totalCount: [...] } }
 * ]);
 * const products = results[0].products || [];
 */
export type FacetAggregationResult<T> = T[];

/**
 * Product aggregation document with computed fields
 * Extends ProductInterface with fields added during aggregation
 * Note: relevance already exists in ProductInterface, so we omit and re-add as required
 */
export interface ProductAggregationDocument extends Omit<ProductInterface, 'relevance'> {
  relevance: number;
  recommended?: number;
  score?: number;
}

/**
 * Order aggregation document with joined client data
 * Extends OrderInterface with client information from lookup
 */
export interface OrderAggregationDocument extends OrderInterface {
  clientData?: {
    email: string;
    firstname: string;
    lastname: string;
  };
  relevance?: number;
}

/**
 * Blog aggregation document with score
 * Extends BlogInterface with computed score field
 */
export interface BlogAggregationDocument extends BlogInterface {
  score?: number;
}

/**
 * Standard product query result from $facet aggregation
 * Used in getProducts, getAdminProducts, etc.
 */
export interface ProductQueryResult {
  products: ProductAggregationDocument[];
  totalCount: Array<{ count: number }>;
  relevantCount?: Array<{ count: number }>;
}

/**
 * Order query result from $facet aggregation
 * Used in getAllOrders
 */
export interface OrderQueryResult {
  orders: OrderAggregationDocument[];
  totalCount: Array<{ count: number }>;
}

/**
 * Blog query result from $facet aggregation
 * Used in getAllBlogs
 */
export interface BlogQueryResult {
  blogs: BlogAggregationDocument[];
  totalCount: Array<{ count: number }>;
}

/**
 * Client query result from $facet aggregation
 * Used in getAllClients
 */
export interface ClientQueryResult {
  clients: ClientInterface[];
  totalCount: Array<{ count: number }>;
}

/**
 * Min/Max price aggregation result
 * Used in getMinMaxPrice procedure
 */
export interface MinMaxPriceResult {
  minPrice: number;
  maxPrice: number;
}
