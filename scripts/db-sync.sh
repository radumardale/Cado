#!/bin/bash

# Database Sync Script for Cado
# This script combines export and import to sync production data to local
# It's a convenient wrapper for both db-export.sh and db-import.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Cado Database Sync ===${NC}"
echo ""
echo "This script will:"
echo "1. Export the production database (read-only)"
echo "2. Import it to your local MongoDB"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if scripts exist
if [ ! -f "${SCRIPT_DIR}/db-export.sh" ]; then
    echo -e "${RED}Error: db-export.sh not found${NC}"
    exit 1
fi

if [ ! -f "${SCRIPT_DIR}/db-import.sh" ]; then
    echo -e "${RED}Error: db-import.sh not found${NC}"
    exit 1
fi

# Make scripts executable
chmod +x "${SCRIPT_DIR}/db-export.sh"
chmod +x "${SCRIPT_DIR}/db-import.sh"

# Parse flags
SKIP_EXPORT=false
SKIP_CONFIRM=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --skip-export) SKIP_EXPORT=true ;;
        -y|--yes) SKIP_CONFIRM=true ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --skip-export    Skip export and use existing backup"
            echo "  -y, --yes        Skip confirmation prompts"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# Confirmation
if [ "$SKIP_CONFIRM" = false ]; then
    echo -e "${YELLOW}⚠️  This will sync your local database with production${NC}"
    echo -e "${YELLOW}Your local database will be completely replaced${NC}"
    echo ""
    read -p "Do you want to continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Sync cancelled${NC}"
        exit 0
    fi
fi

# Step 1: Export from production
if [ "$SKIP_EXPORT" = false ]; then
    echo ""
    echo -e "${BLUE}Step 1: Exporting production database...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Run export with automatic confirmation if -y flag was passed
    if [ "$SKIP_CONFIRM" = true ]; then
        echo "y" | "${SCRIPT_DIR}/db-export.sh"
    else
        "${SCRIPT_DIR}/db-export.sh"
    fi

    if [ $? -ne 0 ]; then
        echo -e "${RED}Export failed. Aborting sync.${NC}"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}Skipping export, using existing backup${NC}"
fi

# Step 2: Import to local
echo ""
echo -e "${BLUE}Step 2: Importing to local MongoDB...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run import with automatic confirmation if -y flag was passed
if [ "$SKIP_CONFIRM" = true ]; then
    echo "y" | "${SCRIPT_DIR}/db-import.sh"
else
    "${SCRIPT_DIR}/db-import.sh"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Import failed.${NC}"
    exit 1
fi

# Success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Database sync completed successfully!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Your local database is now synchronized with production${NC}"
echo ""
echo "Quick tips:"
echo "• Run with --skip-export to use existing backup"
echo "• Run with -y to skip all confirmations"
echo "• Your app should now work with production data locally!"