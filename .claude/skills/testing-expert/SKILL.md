---
name: testing-expert
description: Expert guidance for component testing with Vitest, React Testing Library, tRPC, and Suspense. Use when writing tests, debugging test failures, or needing testing best practices for React components with tRPC data fetching.
version: 1.0.0
last-updated: 2025-01-23
---

# Testing Expert Skill

> 📝 **Living Document**
> This skill evolves as we discover better patterns and practices.
>
> **Claude's Role:**
>
> - ⚠️ Alert when patterns in this document are outdated or incorrect
> - 💡 Suggest updates when we discover new approaches during development
> - 🔄 Help keep these guidelines aligned with actual working code
> - 📊 Propose moving content between SKILL.md ↔ PATTERNS.md as usage patterns emerge
>
> **Last Updated:** 2025-01-23

## 🚀 Quick Start

1. **Use VS Code snippets:**
   - `vitest-imports` → Import statements
   - `vitest-nav-mocks` → Navigation mocking setup

2. **Essential patterns:**
   - Use `renderSuspenseResolved()` for components with `useSuspenseQuery` ⭐ **RECOMMENDED**
   - Use `createMockProduct()` and other factories for test data
   - Pre-populate cache with `queryClient.setQueryData()` for tRPC data

3. **Start from template:** `.claude/templates/component.test.tsx`

## 🎯 Decision Trees

### Which Render Helper Do I Need?

```
├─ Component uses useSuspenseQuery?
│  └─ YES → renderSuspenseResolved() ⭐ (default - 99% of cases)
│     └─ Need to test loading states? → renderWithSuspense() (rare)
│  └─ NO → renderWithProviders()
│
└─ Just UI component (no data fetching)?
   └─ render() from RTL directly
```

### Do I Need Navigation Mocks?

```
├─ Component uses useRouter/usePathname/Link/useSearchParams?
│  └─ YES → Use `vitest-nav-mocks` VS Code snippet
│  └─ NO → Skip navigation mocking
```

### How Do I Handle tRPC Data?

```
├─ Component fetches tRPC data?
│  └─ YES → Pre-populate cache with queryClient.setQueryData()
│  └─ NO → Just render the component
```

## ⚡ Essential Commands

**VS Code Snippets:**

- `vitest-imports` → Import statements
- `vitest-nav-mocks` → Complete navigation mock setup (~50 lines)

**Factory Functions:**

```typescript
createMockProduct(overrides); // Product with sensible defaults
createMockProductOnSale(salePrice); // Product with active sale
createMockProducts(count); // Array of products
createTestQueryClient(); // Fresh QueryClient for each test
```

**Rendering Functions:**

```typescript
// ⭐ Default for components with useSuspenseQuery (99% of cases)
await renderSuspenseResolved(<Component />, { queryClient })

// For components without Suspense
renderWithProviders(<Component />, { queryClient })

// Direct RTL render (no providers needed)
render(<Component />)
```

**tRPC Cache Setup:**

```typescript
const trpcQueryKey = [['routerName', 'procedureName'], { input: { id: 'PROD001' }, type: 'query' }];
queryClient.setQueryData(trpcQueryKey, { product: mockProduct });
```

## 📚 Available Utilities

| Utility                      | Use Case                            |
| ---------------------------- | ----------------------------------- |
| `createMockProduct()`        | Product test data                   |
| `createMockCartItem()`       | Cart item data                      |
| `createTestQueryClient()`    | Fresh QueryClient per test          |
| `renderSuspenseResolved()`   | ⭐ Components with useSuspenseQuery |
| `renderWithProviders()`      | Components needing QueryClient/tRPC |
| `setupPortalContainer()`     | Radix UI portals (Select, Calendar) |
| `mockIntersectionObserver()` | Lazy loading tests                  |
| `mockMatchMedia()`           | Responsive component tests          |

See **PATTERNS.md** for detailed examples and full utility list.

## ✅ ALWAYS Do These

1. **Use factories** - `createMockProduct()`, not inline objects with 30+ fields
2. **Reference mock properties** - Use `mockProduct.title.en`, not hardcoded `'Test Product'`
3. **Pre-populate cache** - Use `queryClient.setQueryData()`, don't mock hooks
4. **Use renderSuspenseResolved()** - Default for useSuspenseQuery components
5. **Clean up** - Always include `afterEach(cleanup)`
6. **Use VS Code snippets** - Type `vitest-nav-mocks` + Tab for navigation setup

## ❌ NEVER Do These

1. **Don't mock child components you're testing**

   ```typescript
   // ❌ BAD - Breaks integration testing
   vi.mock('@/components/product/ProductContent');

   // ✅ GOOD - Test with real children
   renderWithProviders(<ProductInfo id='PROD001' />, { queryClient });
   ```

2. **Don't mock tRPC or React Query hooks directly**

   ```typescript
   // ❌ BAD - Breaks the testing model
   vi.mock('@tanstack/react-query');

   // ✅ GOOD - Pre-populate cache
   queryClient.setQueryData(trpcQueryKey, { product: mockProduct });
   ```

3. **Don't hardcode duplicate values in assertions**

   ```typescript
   // ❌ BAD - Brittle!
   const mockProduct = createMockProduct({ title: { en: 'Test Product' } });
   expect(screen.getByText('Test Product')).toBeInTheDocument();

   // ✅ GOOD - Single source of truth
   expect(screen.getByText(mockProduct.title.en)).toBeInTheDocument();
   ```

4. **Don't import helpers into `vi.hoisted()` blocks**

   ```typescript
   // ❌ BAD - Will fail with "Cannot access before initialization"
   import { createMockRouter } from '@/__tests__/helpers/componentTestUtils';
   const mocks = vi.hoisted(() => createMockRouter('/en'));

   // ✅ GOOD - Use VS Code snippet or inline pattern
   const mocks = vi.hoisted(() => ({
     pathname: '/en',
     router: { push: vi.fn() },
   }));
   ```

5. **Don't forget Suspense boundaries**

   ```typescript
   // ❌ BAD - Will throw error!
   renderWithProviders(<ProductInfo id='PROD001' />, { queryClient });

   // ✅ GOOD - Use async helper
   await renderSuspenseResolved(<ProductInfo id='PROD001' />, { queryClient });
   ```

6. **Don't test implementation details**

   ```typescript
   // ❌ BAD - Testing how it works
   expect(mockTRPC.getProductById).toHaveBeenCalledWith({ id: 'PROD001' });

   // ✅ GOOD - Test user-visible behavior
   expect(screen.getByRole('heading')).toHaveTextContent(mockProduct.title.en);
   ```

## 🐛 Quick Debugging Tips

**See rendered output:**

```typescript
console.log(screen.debug()); // Entire DOM
```

**Check text not in accessibility tree:**

```typescript
expect(document.body.textContent).toContain('Expected text');
```

**Verify Suspense resolved:**

```typescript
// Option 1: Use helper (recommended)
await renderSuspenseResolved(<Component />, { queryClient });

// Option 2: Manual wait
await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

**Check mock calls:**

```typescript
expect(nextNav.router.push).toHaveBeenCalledWith('/cart');
expect(nextNav.router.push).toHaveBeenCalledTimes(1);
```

## 📖 Detailed Patterns & Examples

For complete examples, see **PATTERNS.md**:

- Navigation Mocking (complete 50-line pattern)
- Pattern 1: Component with tRPC Data
- Pattern 2: UI Component (minimal mocking)
- Pattern 3: Isolated Child Mocking
- Suspense Testing (all alternatives)
- tRPC Cache Key Structures
- Anti-Patterns We Discovered
- Debugging Techniques

## 🔬 Pattern Discovery Protocol

When you notice during development:

1. **Outdated pattern** → Alert user, suggest update
2. **New pattern** → Capture it, suggest adding to PATTERNS.md
3. **Decision tree needs adjustment** → Propose SKILL.md edit
4. **Anti-pattern encountered** → Add to ❌ NEVER list

**Template for suggestions:**

```
⚠️ Pattern Update Suggested

What changed: [Brief description]
Which file: SKILL.md | PATTERNS.md | Both
Proposed update: [Specific change]
Reason: [Why this improves testing]
```

## 🎓 Testing Philosophy

### The Golden Rules

- ✅ **Integration over Isolation** - Test components with their real dependencies
- ✅ **Mock at the Boundary** - Only mock external APIs, navigation, and external libraries
- ✅ **User Behavior over Implementation** - Test what users see, not how code works internally
- ✅ **Real Providers Always** - Use actual tRPC, QueryClient, NextIntl providers in tests
- ✅ **Meaningful Tests Only** - If a test doesn't catch real bugs or verify real behavior, delete it. "Technical debt disguised as coverage" is worse than no test. Less is more, but quality is paramount.

### When to Write Different Test Types

**Component Tests (Current Focus):**

- Testing React components with real dependencies
- User interactions, rendering, state changes
- Tools: Vitest + RTL + `renderWithProviders()`

**E2E Tests (Recommended - See Issue #103):**

- Complete user flows through the application
- Less mocking, more confidence
- Tools: Playwright (proposed)

**Unit Tests:**

- Pure functions, utilities, helpers
- Calculations, transformations, business logic
- Tools: Vitest only (no React)

## 🌍 Multilingual Testing

**Golden Rule:** Avoid "technical debt disguised as coverage"

**✅ DO Test:**

- Actual translated text appears (import real `/messages/*.json` files)
- Component renders in all locales without errors
- Translation keys resolve correctly

**❌ DON'T Test:**

- URL locale prefixes (`/en/`, `/ro/`) - belongs in E2E tests
- Reimplementing next-intl logic in mocks

**See PATTERNS.md** for detailed examples, anti-patterns, and testing boundaries.

## 📚 Additional Resources

- **Template:** `.claude/templates/component.test.tsx` - Copy-paste starting point
- **VS Code snippets:** `.vscode/vitest-navigation-mocks.code-snippets`
- **Test utilities:** `src/__tests__/helpers/componentTestUtils.tsx`
- **Live examples:** `src/__tests__/components/product/ProductInfo.test.tsx`
- **Detailed patterns:** `PATTERNS.md` (in this skill directory)
