#!/bin/bash

# Hreflang validation script for Cado e-commerce site
# This script tests that hreflang tags are properly implemented across all pages

set -e

echo "🔍 Validating Hreflang Implementation for cado.md"
echo "================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (use localhost for local testing)
BASE_URL="http://localhost:3001"

# Counter for tracking results
PASSED=0
FAILED=0

# Function to test a single URL
test_url() {
    local path="$1"
    local description="$2"

    echo -e "\n📍 Testing: ${YELLOW}$description${NC}"
    echo "   URL: $BASE_URL$path"

    # Fetch the page content
    response=$(curl -s "$BASE_URL$path" || echo "CURL_ERROR")

    if [ "$response" = "CURL_ERROR" ]; then
        echo -e "   ${RED}❌ Failed to fetch page${NC}"
        ((FAILED++))
        return
    fi

    # Check for hreflang tags (case-insensitive due to Next.js using hrefLang)
    local has_ro=false
    local has_ru=false
    local has_en=false
    local has_default=false

    if echo "$response" | grep -qi 'hreflang="ro"'; then
        has_ro=true
    fi

    if echo "$response" | grep -qi 'hreflang="ru"'; then
        has_ru=true
    fi

    if echo "$response" | grep -qi 'hreflang="en"'; then
        has_en=true
    fi

    if echo "$response" | grep -qi 'hreflang="x-default"'; then
        has_default=true
    fi

    # Report results
    if [ "$has_ro" = true ]; then
        echo -e "   ${GREEN}✅ Romanian hreflang found${NC}"
    else
        echo -e "   ${RED}❌ Romanian hreflang missing${NC}"
    fi

    if [ "$has_ru" = true ]; then
        echo -e "   ${GREEN}✅ Russian hreflang found${NC}"
    else
        echo -e "   ${RED}❌ Russian hreflang missing${NC}"
    fi

    if [ "$has_en" = true ]; then
        echo -e "   ${GREEN}✅ English hreflang found${NC}"
    else
        echo -e "   ${RED}❌ English hreflang missing${NC}"
    fi

    if [ "$has_default" = true ]; then
        echo -e "   ${GREEN}✅ x-default hreflang found${NC}"
    else
        echo -e "   ${RED}❌ x-default hreflang missing${NC}"
    fi

    # Count pass/fail
    if [ "$has_ro" = true ] && [ "$has_ru" = true ] && [ "$has_en" = true ] && [ "$has_default" = true ]; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
}

# Function to test dynamic route
test_dynamic_url() {
    local path="$1"
    local description="$2"
    local expected_param="$3"

    echo -e "\n📍 Testing Dynamic Route: ${YELLOW}$description${NC}"
    echo "   URL: $BASE_URL$path"

    # Fetch the page content
    response=$(curl -s "$BASE_URL$path" || echo "CURL_ERROR")

    if [ "$response" = "CURL_ERROR" ]; then
        echo -e "   ${RED}❌ Failed to fetch page${NC}"
        ((FAILED++))
        return
    fi

    # Check if the dynamic parameter is preserved in hreflang URLs
    if echo "$response" | grep -q "hreflang=\"ro\".*$expected_param"; then
        echo -e "   ${GREEN}✅ Dynamic parameter preserved in Romanian hreflang${NC}"
        ((PASSED++))
    else
        echo -e "   ${RED}❌ Dynamic parameter not preserved in hreflang${NC}"
        ((FAILED++))
    fi
}

echo -e "\n${YELLOW}Starting development server check...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "307" ] || [ "$HTTP_STATUS" = "404" ]; then
    echo -e "${GREEN}✅ Development server is running${NC}"
else
    echo -e "${RED}❌ Development server is not running on $BASE_URL (status: $HTTP_STATUS)${NC}"
    echo "Please run 'npm run dev' first"
    exit 1
fi

echo -e "\n${YELLOW}Testing Static Pages${NC}"
echo "========================"

# Test static pages
test_url "/ro" "Home Page (Romanian)"
test_url "/ru" "Home Page (Russian)"
test_url "/en" "Home Page (English)"

test_url "/ro/catalog" "Catalog Page (Romanian)"
test_url "/ru/katalog" "Catalog Page (Russian)"
test_url "/en/catalog" "Catalog Page (English)"

test_url "/ro/despre-noi" "About Us Page (Romanian)"
test_url "/ru/o-kompanii" "About Us Page (Russian)"
test_url "/en/about-us" "About Us Page (English)"

test_url "/ro/noutati" "Blogs Page (Romanian)"
test_url "/ru/novosti" "Blogs Page (Russian)"
test_url "/en/blogs" "Blogs Page (English)"

test_url "/ro/contacte" "Contacts Page (Romanian)"
test_url "/ru/kontakty" "Contacts Page (Russian)"
test_url "/en/contacts" "Contacts Page (English)"

test_url "/ro/termeni-si-conditii" "Terms Page (Romanian)"
test_url "/ru/usloviya" "Terms Page (Russian)"
test_url "/en/terms" "Terms Page (English)"

echo -e "\n${YELLOW}Testing Dynamic Pages (if products exist)${NC}"
echo "========================================="

# Note: These tests require actual product/blog IDs to exist
echo -e "${YELLOW}Note: Dynamic route tests require actual IDs in the database${NC}"

# Summary
echo -e "\n${YELLOW}=========================================${NC}"
echo -e "${YELLOW}           TEST SUMMARY                  ${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All hreflang tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please review the implementation.${NC}"
    exit 1
fi