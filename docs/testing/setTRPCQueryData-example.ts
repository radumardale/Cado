/**
 * Example usage of setTRPCQueryData helper
 *
 * This file demonstrates how to use the new helper function.
 * Delete this file when you're ready - it's just for reference.
 */

import { QueryClient } from '@tanstack/react-query';
import { setTRPCQueryData, createMockProduct } from '@/__tests__/helpers/componentTestUtils';

// Example 1: Single product by ID
const queryClient = new QueryClient();
const mockProduct = createMockProduct({ custom_id: 'PROD001' });

setTRPCQueryData(queryClient, {
  router: 'products',
  procedure: 'getProductById',
  input: { id: mockProduct.custom_id },
  data: { product: mockProduct },
});

// Example 2: Product list (no input)
setTRPCQueryData(queryClient, {
  router: 'products',
  procedure: 'getProducts',
  input: {},
  data: { products: [mockProduct] },
});

// Example 3: Cart (undefined input - omit the field)
setTRPCQueryData(queryClient, {
  router: 'cart',
  procedure: 'getCart',
  data: { cart: [] },
});

// Equivalent manual approach (what it replaces):
const trpcQueryKey = [
  ['products', 'getProductById'],
  { input: { id: mockProduct.custom_id }, type: 'query' as const },
];
queryClient.setQueryData(trpcQueryKey, { product: mockProduct });
