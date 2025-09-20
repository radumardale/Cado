#!/bin/bash

# Database Import Script for Cado
# This script imports the exported database to your local MongoDB instance
# It will drop and recreate the local database with production data

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cado Database Import ===${NC}"
echo ""

# Check if mongorestore is installed
if ! command -v mongorestore &> /dev/null; then
    echo -e "${RED}Error: mongorestore is not installed.${NC}"
    echo "Please install MongoDB Database Tools:"
    echo "  macOS: brew install mongodb-database-tools"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb-database-tools"
    echo "  Other: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Check if MongoDB is running locally
if ! nc -z localhost 27017 2>/dev/null; then
    echo -e "${YELLOW}MongoDB doesn't appear to be running on localhost:27017${NC}"
    echo ""
    echo "To start MongoDB:"
    echo "  macOS with Homebrew: brew services start mongodb-community"
    echo "  Manual start: mongod --dbpath /usr/local/var/mongodb"
    echo ""
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set paths
BACKUP_DIR="$(dirname "$0")/../db-backup"
LOCAL_URI="mongodb://localhost:27017"
DATABASE_NAME="cado"

# Check for backup
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: No backup found${NC}"
    echo "Please run ./scripts/db-export.sh first to create a backup"
    exit 1
fi

# Find the latest backup
if [ -L "${BACKUP_DIR}/latest" ]; then
    BACKUP_PATH="${BACKUP_DIR}/latest"
    echo -e "${GREEN}Using latest backup: ${BACKUP_PATH}${NC}"
elif [ ! -z "$(ls -A ${BACKUP_DIR} 2>/dev/null)" ]; then
    # Get most recent backup if no symlink exists
    BACKUP_PATH=$(ls -dt ${BACKUP_DIR}/backup_* 2>/dev/null | head -1)
    if [ -z "$BACKUP_PATH" ]; then
        echo -e "${RED}Error: No valid backup found in ${BACKUP_DIR}${NC}"
        echo "Please run ./scripts/db-export.sh first"
        exit 1
    fi
    echo -e "${GREEN}Using backup: ${BACKUP_PATH}${NC}"
else
    echo -e "${RED}Error: No backup found in ${BACKUP_DIR}${NC}"
    echo "Please run ./scripts/db-export.sh first"
    exit 1
fi

# Show backup info
if [ -d "$BACKUP_PATH/$DATABASE_NAME" ]; then
    COLLECTIONS=$(find "$BACKUP_PATH/$DATABASE_NAME" -name "*.bson" 2>/dev/null | wc -l | tr -d ' ')
    SIZE=$(du -sh "$BACKUP_PATH/$DATABASE_NAME" 2>/dev/null | cut -f1)
    echo "Database: ${DATABASE_NAME}"
    echo "Collections: ${COLLECTIONS}"
    echo "Size: ${SIZE}"
else
    echo -e "${RED}Error: Database '${DATABASE_NAME}' not found in backup${NC}"
    echo "Backup path: ${BACKUP_PATH}"
    exit 1
fi

# Confirm before proceeding
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will DROP and RECREATE your local '${DATABASE_NAME}' database${NC}"
echo -e "${YELLOW}All existing local data will be lost!${NC}"
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Import cancelled${NC}"
    exit 0
fi

# Import database
echo ""
echo -e "${GREEN}Starting database import...${NC}"
echo "This may take a few minutes depending on database size"
echo ""

if mongorestore --uri="$LOCAL_URI" --drop --nsInclude="${DATABASE_NAME}.*" "$BACKUP_PATH" 2>&1 | grep -v "WARNING"; then
    echo ""
    echo -e "${GREEN}✓ Database imported successfully!${NC}"
    echo ""
    echo "Local database: ${DATABASE_NAME}"
    echo "MongoDB URI: ${LOCAL_URI}/${DATABASE_NAME}"

    # Test connection
    if command -v mongosh &> /dev/null; then
        COLLECTION_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('${DATABASE_NAME}').getCollectionNames().length" "$LOCAL_URI" 2>/dev/null || echo "0")
        if [ "$COLLECTION_COUNT" != "0" ]; then
            echo "Collections in database: ${COLLECTION_COUNT}"
        fi
    fi

else
    echo ""
    echo -e "${RED}✗ Import failed${NC}"
    echo "Please check that MongoDB is running on localhost:27017"
    exit 1
fi

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update your .env.local with: MONGO_URI=mongodb://localhost:27017/cado"
echo "2. Run: npm run dev"
echo "3. Your local environment will use production data!"