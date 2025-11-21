# Test Suite Analysis & Action Plan

**Date:** 2025-11-21
**Analyzed by:** Claude Code
**Test Command:** `npm run test`

---

## Executive Summary

The test suite currently has **3 passing test files** with 74 tests and **13 skipped test files** with 13 tests. All passing tests use proper mocking and don't require a real database. All skipped tests would require a real MongoDB connection and are currently non-functional placeholders.

**Recommendation:** Delete all 13 skipped test files. They provide no value and two are actually data migration scripts misnamed as tests.

---

## Current Test Status

### ✅ Passing Tests (3 files, 74 tests)

| File | Tests | Purpose | Database Needed? |
|------|-------|---------|------------------|
| `src/__tests__/routes/robots.test.ts` | 14 | Tests robots.txt generation | ❌ No |
| `src/lib/seo/hreflang.test.ts` | 45 | Tests hreflang link generation | ❌ No |
| `src/__tests__/routes/sitemap.test.ts` | 15 | Tests sitemap generation | ❌ No (uses mocks) |

**Key Success Factors:**
- ✅ Use `vi.mock()` to mock database models
- ✅ Test pure functions or configurations
- ✅ Mock external dependencies (Product, Blog models)
- ✅ No real database connection required

### ⏭️ Skipped Tests (13 files, 13 tests)

All located in `src/__tests__/actions/` directory:

#### Order Tests (4 files)
| File | Issue | Real Purpose |
|------|-------|--------------|
| `order/updateOrder.test.ts` | All code commented out | Placeholder test |
| `order/addOrder.test.ts` | ⚠️ **NOT A TEST!** | Domain migration script |
| `order/deleteOrder.test.ts` | All code commented out | Placeholder test |
| `order/getAllOrders.test.ts` | All code commented out | Placeholder test |

#### Product Tests (5 files)
| File | Issue | Real Purpose |
|------|-------|--------------|
| `product/getProduct.test.ts` | All code commented out | Placeholder test |
| `product/addProduct.test.ts` | Code exists but requires DB | Database seed script |
| `product/updateProduct.test.ts` | All code commented out | Placeholder test |
| `product/deleteProduct.test.ts` | All code commented out | Placeholder test |
| `product/deleteAllProducts.test.ts` | All code commented out | Placeholder test |

#### Other Tests (4 files)
| File | Issue | Real Purpose |
|------|-------|--------------|
| `search/searchProduct.test.ts` | All code commented out | Placeholder test |
| `blog/addBlog.test.ts` | ⚠️ **NOT A TEST!** | Blog post seeding script |
| `image/uploadImage.test.ts` | Code exists but requires DB+S3 | Image update script |
| `image/deleteImage.test.ts` | All code commented out | Placeholder test |

---

## Detailed Analysis

### Problems with Skipped Tests

1. **Not Real Tests**
   - `addOrder.test.ts` - Contains `updateProductImageDomains()` migration script
   - `addBlog.test.ts` - Creates 4 blog posts (data seeding)
   - These should be in `/scripts/` directory, not test files

2. **Would Require Real Database**
   - All use `appRouter.createCaller({})` with empty context
   - Call actual tRPC procedures (createProduct, createBlog, updateImage, etc.)
   - Would perform real database operations if uncommented
   - No mocking of database models

3. **Missing Test Infrastructure**
   - No test database setup/teardown
   - No mocking of MongoDB models
   - No mocking of S3 for image tests
   - Would modify production/development database if run

4. **Code Quality Issues**
   - Commented out code throughout
   - Use of `test.skip()` instead of proper implementation
   - No assertions in some tests
   - Hard-coded database IDs

### What Good Tests Look Like

Example from `sitemap.test.ts`:

```typescript
// ✅ Mock database models
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/blog/blog');

// ✅ Create mock query chains
function createMockQuery<T>(data: T[]): Partial<Query<unknown, unknown>> {
  return {
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(data),
    }),
  };
}

// ✅ Test with mocked data
it('should only include in-stock products', async () => {
  const mockProducts = [
    { custom_id: 'prod1', updatedAt: new Date() },
  ];

  vi.mocked(Product.find).mockReturnValue(
    createMockQuery(mockProducts) as unknown as ReturnType<typeof Product.find>
  );

  await generateSitemapEntries();

  expect(mockFind).toHaveBeenCalledWith({
    'stock_availability.state': StockState.IN_STOCK,
  });
});
```

---

## Test Configuration

**File:** `vitest.config.mts`

```typescript
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    testTimeout: 0,  // ⚠️ Unlimited timeout - risky!
  },
});
```

**Issues:**
- `testTimeout: 0` means tests can hang forever
- No global setup/teardown for database mocking
- Environment variables loaded but no test-specific config

---

## Action Plan Options

### Option 1: Delete All Skipped Tests ✅ RECOMMENDED

**Rationale:**
- They provide no testing value in current state
- Two are misnamed data scripts, not tests
- Would require significant effort to fix properly
- False sense of test coverage

**Actions:**
1. Delete all 13 files in `src/__tests__/actions/`
2. Move `addBlog.test.ts` and `addOrder.test.ts` logic to `/scripts/` if needed
3. Keep the 3 working test files
4. Update test configuration to set reasonable timeout (30s)

**Outcome:**
- Clean, maintainable test suite
- All tests pass and are useful
- No confusion about test status

---

### Option 2: Fix Tests with Proper Mocking

**Rationale:**
- Provides unit testing for tRPC procedures
- No database dependency
- Fast test execution

**Effort:** High (2-4 hours per test file)

**Required Work per File:**
1. Mock database models (Product, Order, Blog, etc.)
2. Mock S3 client for image tests
3. Mock tRPC context with fake session
4. Create proper test data fixtures
5. Write meaningful assertions
6. Test error cases

**Example pattern:**
```typescript
// Mock models
vi.mock('@/models/product/product');
vi.mock('@/lib/connect-mongo');

// Test
it('should create product', async () => {
  vi.mocked(Product.create).mockResolvedValue(mockProduct);

  const result = await caller.products.createProduct({
    data: productData
  });

  expect(result.success).toBe(true);
  expect(Product.create).toHaveBeenCalledWith(
    expect.objectContaining({
      title: productData.title
    })
  );
});
```

**Outcome:**
- Real unit tests for business logic
- No database dependency
- Fast, reliable tests

---

### Option 3: Convert to Integration Tests

**Rationale:**
- Tests real database interactions
- Catches integration issues
- More confidence in code

**Effort:** Very High (1-2 days)

**Required Work:**
1. Set up MongoDB Memory Server or test database
2. Implement global test setup/teardown
3. Create database seeding utilities
4. Clean database between tests
5. Mock external services (S3, email, etc.)
6. Update all test files

**Outcome:**
- Full integration test coverage
- Slower test execution
- More maintenance overhead

---

## Recommended Approach: Option 1

### Step-by-Step Plan

#### Phase 1: Cleanup (5 minutes)
1. ✅ Delete 11 placeholder test files with commented code:
   - `order/updateOrder.test.ts`
   - `order/deleteOrder.test.ts`
   - `order/getAllOrders.test.ts`
   - `product/getProduct.test.ts`
   - `product/updateProduct.test.ts`
   - `product/deleteProduct.test.ts`
   - `product/deleteAllProducts.test.ts`
   - `search/searchProduct.test.ts`
   - `image/deleteImage.test.ts`

2. ✅ Move data scripts to proper location:
   - Extract `updateProductImageDomains()` from `order/addOrder.test.ts` → create `/scripts/update-product-domains.ts`
   - Extract blog seeding from `blog/addBlog.test.ts` → create `/scripts/seed-blogs.ts`
   - Delete both test files

3. ✅ Review remaining files:
   - `product/addProduct.test.ts` - If useful as documentation, move to `/scripts/seed-products.ts`
   - `image/uploadImage.test.ts` - If useful as documentation, move to `/scripts/update-images.ts`

#### Phase 2: Configuration Update (2 minutes)
1. Update `vitest.config.mts`:
   ```typescript
   test: {
     environment: 'jsdom',
     testTimeout: 30000,  // 30 seconds - reasonable timeout
   }
   ```

#### Phase 3: Verification (1 minute)
1. Run `npm run test`
2. Verify all tests pass
3. Confirm test count: 3 files, 74 tests

---

## Test Coverage Analysis

### Current Coverage

| Area | Coverage | Notes |
|------|----------|-------|
| SEO utilities | ✅ Excellent | robots.txt, sitemap, hreflang all tested |
| tRPC procedures | ❌ None | No unit tests for business logic |
| Database models | ❌ None | No model validation tests |
| API routes | ❌ None | No integration tests |
| Components | ❌ None | No React component tests |

### Future Testing Priorities

If you want to add tests later, prioritize in this order:

1. **Critical Business Logic** (High Priority)
   - Order creation and payment processing
   - Product stock management
   - Price calculations
   - Email notifications

2. **API Endpoints** (Medium Priority)
   - tRPC procedures with mocking
   - Authentication/authorization
   - Input validation

3. **UI Components** (Low Priority)
   - Critical user flows (checkout, cart)
   - Form validation
   - Error states

---

## Conclusion

**Current State:**
- 3 well-written tests (74 tests total) ✅
- 13 non-functional placeholders (2 are data scripts) ❌

**Recommended Action:**
- Delete all 13 skipped test files
- Extract useful scripts to `/scripts/` directory
- Update test timeout configuration
- Keep the 3 working test files

**Result:**
- Clean, maintainable test suite
- All tests pass and provide value
- Clear foundation for future test additions

---

## Appendix: File Inventory

### Files to Delete
```
src/__tests__/actions/order/updateOrder.test.ts
src/__tests__/actions/order/addOrder.test.ts
src/__tests__/actions/order/deleteOrder.test.ts
src/__tests__/actions/order/getAllOrders.test.ts
src/__tests__/actions/product/getProduct.test.ts
src/__tests__/actions/product/addProduct.test.ts
src/__tests__/actions/product/updateProduct.test.ts
src/__tests__/actions/product/deleteProduct.test.ts
src/__tests__/actions/product/deleteAllProducts.test.ts
src/__tests__/actions/search/searchProduct.test.ts
src/__tests__/actions/blog/addBlog.test.ts
src/__tests__/actions/image/uploadImage.test.ts
src/__tests__/actions/image/deleteImage.test.ts
```

### Files to Keep
```
src/__tests__/routes/robots.test.ts
src/__tests__/routes/sitemap.test.ts
src/lib/seo/hreflang.test.ts
```

### Scripts to Create (Optional)
```
scripts/update-product-domains.ts (from addOrder.test.ts)
scripts/seed-blogs.ts (from addBlog.test.ts)
scripts/seed-products.ts (from addProduct.test.ts)
scripts/update-images.ts (from uploadImage.test.ts)
```
