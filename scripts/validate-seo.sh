#!/bin/bash

# SEO Validation Script for Cado.md
# Tests sitemap.xml and robots.txt generation
# Usage: ./scripts/validate-seo.sh [environment]
# Example: ./scripts/validate-seo.sh local
#          ./scripts/validate-seo.sh production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Determine environment
ENV=${1:-local}

if [ "$ENV" = "production" ]; then
    BASE_URL="https://cado.md"
else
    BASE_URL="http://localhost:3000"
fi

echo "🔍 SEO Validation Script"
echo "========================"
echo "Testing: $BASE_URL"
echo ""

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "Testing: $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to check URL exists in sitemap
check_url_in_sitemap() {
    local url_pattern="$1"
    curl -s "$BASE_URL/sitemap.xml" | grep -q "$url_pattern"
}

echo "📄 Testing robots.txt"
echo "--------------------"

# Test robots.txt exists and is accessible
run_test "robots.txt is accessible" \
    "curl -f -s -o /dev/null -w '%{http_code}' $BASE_URL/robots.txt | grep -q 200"

# Test robots.txt blocks admin
run_test "Blocks /admin/ path" \
    "curl -s $BASE_URL/robots.txt | grep -q 'Disallow: /admin/'"

# Test robots.txt blocks API
run_test "Blocks /api/ path" \
    "curl -s $BASE_URL/robots.txt | grep -q 'Disallow: /api/'"

# Test robots.txt blocks checkout
run_test "Blocks /checkout/ path" \
    "curl -s $BASE_URL/robots.txt | grep -q 'Disallow: /checkout/'"

# Test robots.txt references sitemap
run_test "References sitemap.xml" \
    "curl -s $BASE_URL/robots.txt | grep -q 'Sitemap: $BASE_URL/sitemap.xml'"

# Test Googlebot specific rules
run_test "Has Googlebot rules" \
    "curl -s $BASE_URL/robots.txt | grep -q 'User-Agent: Googlebot'"

# Test Yandex specific rules
run_test "Has Yandex rules" \
    "curl -s $BASE_URL/robots.txt | grep -q 'User-Agent: Yandex'"

echo ""
echo "🗺️  Testing sitemap.xml"
echo "---------------------"

# Test sitemap exists and is accessible
run_test "sitemap.xml is accessible" \
    "curl -f -s -o /dev/null -w '%{http_code}' $BASE_URL/sitemap.xml | grep -q 200"

# Test content-type header is application/xml
run_test "Content-Type is application/xml" \
    "curl -I $BASE_URL/sitemap.xml 2>/dev/null | grep -i content-type | grep -q 'application/xml'"

# Test XML is well-formed
run_test "Valid XML structure" \
    "curl -s $BASE_URL/sitemap.xml | xmllint --noout - 2>/dev/null"

# Test for required namespaces
run_test "Has sitemap namespace" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"'"

run_test "Has hreflang namespace" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"'"

# Test for language versions
echo ""
echo "🌐 Testing Multi-language Support"
echo "---------------------------------"

run_test "Romanian URLs present" \
    "check_url_in_sitemap '/ro/'"

run_test "Russian URLs present" \
    "check_url_in_sitemap '/ru/'"

run_test "English URLs present" \
    "check_url_in_sitemap '/en/'"

# Test hreflang implementation
run_test "Hreflang tags present" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'xhtml:link rel=\"alternate\"'"

run_test "Romanian hreflang" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'hreflang=\"ro\"'"

run_test "Russian hreflang" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'hreflang=\"ru\"'"

run_test "English hreflang" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'hreflang=\"en\"'"

# Test for important pages
echo ""
echo "📋 Testing Page Coverage"
echo "-----------------------"

run_test "Homepage in sitemap" \
    "check_url_in_sitemap '<loc>$BASE_URL/ro</loc>'"

run_test "Catalog page in sitemap" \
    "check_url_in_sitemap '/catalog</loc>'"

run_test "About page in sitemap" \
    "check_url_in_sitemap '/about-us</loc>'"

run_test "Blogs page in sitemap" \
    "check_url_in_sitemap '/blogs</loc>'"

run_test "Contacts page in sitemap" \
    "check_url_in_sitemap '/contacts</loc>'"

# Test for dynamic content
echo ""
echo "🛍️  Testing Dynamic Content"
echo "--------------------------"

run_test "Product URLs present" \
    "curl -s $BASE_URL/sitemap.xml | grep -q '/catalog/product/'"

run_test "Category URLs present" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'category='"

run_test "Occasion URLs present" \
    "curl -s $BASE_URL/sitemap.xml | grep -q 'occasion='"

# Count URLs
echo ""
echo "📊 Content Statistics"
echo "--------------------"

TOTAL_URLS=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "<loc>" || echo "0")
PRODUCT_URLS=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "/catalog/product/" || echo "0")
CATEGORY_URLS=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "category=" || echo "0")
OCCASION_URLS=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "occasion=" || echo "0")

echo "Total URLs in sitemap: $TOTAL_URLS"
echo "Product pages: $PRODUCT_URLS"
echo "Category pages: $CATEGORY_URLS"
echo "Occasion pages: $OCCASION_URLS"

# URL validation
echo ""
echo "🔗 Testing URL Validity"
echo "----------------------"

# Test that URLs are properly encoded (no spaces within URL tags)
run_test "URLs are properly encoded" \
    "! curl -s $BASE_URL/sitemap.xml | grep '<loc>' | grep -E 'http[^<]*[ ]+[^<]*</loc>'"

# Test for lastmod dates
run_test "Has lastmod dates" \
    "curl -s $BASE_URL/sitemap.xml | grep -q '<lastmod>'"

# Test for priority values
run_test "Has priority values" \
    "curl -s $BASE_URL/sitemap.xml | grep -q '<priority>'"

# Test for changefreq values
run_test "Has changefreq values" \
    "curl -s $BASE_URL/sitemap.xml | grep -q '<changefreq>'"

# Summary
echo ""
echo "================================"
echo "📈 Test Results Summary"
echo "================================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All SEO validation tests passed!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please review the results above.${NC}"
    exit 1
fi