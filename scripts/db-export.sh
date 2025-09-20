#!/bin/bash

# Database Export Script for Cado
# This script safely exports the production database without affecting it
# The export is read-only and will not modify any production data

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cado Database Export ===${NC}"
echo ""

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    echo -e "${RED}Error: mongodump is not installed.${NC}"
    echo "Please install MongoDB Database Tools:"
    echo "  macOS: brew install mongodb-database-tools"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb-database-tools"
    echo "  Other: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Load production environment variables
ENV_FILE="$(dirname "$0")/../.env.production.local"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: .env.production.local not found${NC}"
    echo "Please ensure .env.production.local exists with production credentials"
    exit 1
fi

# Parse MongoDB URI from env file
MONGO_URI=$(grep "^MONGO_URI" "$ENV_FILE" | cut -d '=' -f2- | sed 's/^ *//;s/ *$//')

if [ -z "$MONGO_URI" ]; then
    echo -e "${RED}Error: MONGO_URI not found in .env.production.local${NC}"
    exit 1
fi

# Set backup directory with timestamp
BACKUP_DIR="$(dirname "$0")/../db-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"

# Confirm before proceeding
echo -e "${YELLOW}This will export the production database to:${NC}"
echo "  ${BACKUP_PATH}"
echo ""
echo -e "${YELLOW}Production URI (masked):${NC}"
echo "  ${MONGO_URI:0:30}..."
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Export cancelled${NC}"
    exit 0
fi

# Create backup directory
mkdir -p "$BACKUP_PATH"

# Export database
echo ""
echo -e "${GREEN}Starting database export...${NC}"
echo "This may take a few minutes depending on database size"
echo ""

if mongodump --uri="$MONGO_URI" --out="$BACKUP_PATH" 2>&1 | grep -v "WARNING"; then
    echo ""
    echo -e "${GREEN}✓ Database exported successfully!${NC}"
    echo ""
    echo "Backup location: ${BACKUP_PATH}"

    # Create symlink to latest backup
    ln -sfn "$(basename "$BACKUP_PATH")" "${BACKUP_DIR}/latest"
    echo "Latest backup symlink: ${BACKUP_DIR}/latest"

    # Show backup size
    SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
    echo "Backup size: ${SIZE}"

    # Count collections
    COLLECTIONS=$(find "$BACKUP_PATH" -name "*.bson" | wc -l | tr -d ' ')
    echo "Collections exported: ${COLLECTIONS}"

else
    echo ""
    echo -e "${RED}✗ Export failed${NC}"
    echo "Please check your connection and credentials"
    exit 1
fi

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Run ./scripts/db-import.sh to import to local MongoDB"
echo "2. Or run ./scripts/db-sync.sh to do both export and import"