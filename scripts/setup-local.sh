#!/bin/bash

# Local Development Setup Script for Cado
# This script automates the setup of your local development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}╔══════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║     Cado Local Development Setup         ║${NC}"
echo -e "${MAGENTA}╚══════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print step
print_step() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Step 1: Check prerequisites
print_step "Checking prerequisites"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: ${NODE_VERSION}"
else
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: ${NPM_VERSION}"
else
    print_error "npm is not installed"
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    print_success "MongoDB installed"
else
    print_warning "MongoDB is not installed"
    echo ""
    echo "To install MongoDB on macOS:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo ""
    echo "For other systems, visit:"
    echo "  https://www.mongodb.com/docs/manual/installation/"
    echo ""
    read -p "Do you want to continue without MongoDB? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check MongoDB tools
if ! command_exists mongodump || ! command_exists mongorestore; then
    print_warning "MongoDB Database Tools not installed"
    echo ""
    echo "To install on macOS:"
    echo "  brew install mongodb-database-tools"
    echo ""
    echo "These are required for database sync functionality"
    read -p "Do you want to continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Start MongoDB
print_step "Starting MongoDB"

if command_exists mongod; then
    # Check if MongoDB is already running
    if nc -z localhost 27017 2>/dev/null; then
        print_success "MongoDB is already running on port 27017"
    else
        # Try to start MongoDB
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                echo "Starting MongoDB with Homebrew..."
                brew services start mongodb-community 2>/dev/null || true
                sleep 2
                if nc -z localhost 27017 2>/dev/null; then
                    print_success "MongoDB started successfully"
                else
                    print_warning "Could not start MongoDB automatically"
                    echo "Please start MongoDB manually:"
                    echo "  brew services start mongodb-community"
                    echo "Or:"
                    echo "  mongod --dbpath /usr/local/var/mongodb"
                fi
            else
                print_warning "Please start MongoDB manually"
            fi
        else
            # Linux/Other
            print_warning "Please start MongoDB manually"
            echo "Usually: sudo systemctl start mongodb"
        fi
    fi
else
    print_warning "MongoDB not found, skipping"
fi

# Step 3: Setup environment variables
print_step "Setting up environment variables"

ENV_LOCAL="${PROJECT_DIR}/.env.local"
ENV_PROD="${PROJECT_DIR}/.env.production.local"

if [ -f "$ENV_PROD" ]; then
    print_success "Found .env.production.local"

    if [ -f "$ENV_LOCAL" ]; then
        print_warning ".env.local already exists"
        read -p "Do you want to overwrite it? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Keeping existing .env.local"
        else
            # Create .env.local from production with local modifications
            cp "$ENV_PROD" "$ENV_LOCAL"

            # Update MongoDB URI to local
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS sed
                sed -i '' 's|^MONGO_URI.*|MONGO_URI=mongodb://localhost:27017/cado|' "$ENV_LOCAL"
                sed -i '' 's|^BASE_URL.*|BASE_URL=http://localhost:3000|' "$ENV_LOCAL"
            else
                # Linux sed
                sed -i 's|^MONGO_URI.*|MONGO_URI=mongodb://localhost:27017/cado|' "$ENV_LOCAL"
                sed -i 's|^BASE_URL.*|BASE_URL=http://localhost:3000|' "$ENV_LOCAL"
            fi

            print_success "Created .env.local with local settings"
        fi
    else
        # Create new .env.local
        cp "$ENV_PROD" "$ENV_LOCAL"

        # Update MongoDB URI to local
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS sed
            sed -i '' 's|^MONGO_URI.*|MONGO_URI=mongodb://localhost:27017/cado|' "$ENV_LOCAL"
            sed -i '' 's|^BASE_URL.*|BASE_URL=http://localhost:3000|' "$ENV_LOCAL"
        else
            # Linux sed
            sed -i 's|^MONGO_URI.*|MONGO_URI=mongodb://localhost:27017/cado|' "$ENV_LOCAL"
            sed -i 's|^BASE_URL.*|BASE_URL=http://localhost:3000|' "$ENV_LOCAL"
        fi

        print_success "Created .env.local from production template"
    fi
else
    print_error ".env.production.local not found"
    echo "Please create .env.production.local with your production credentials"
    exit 1
fi

# Step 4: Install dependencies
print_step "Installing npm dependencies"

cd "$PROJECT_DIR"
if [ -f "package-lock.json" ]; then
    print_success "Found package-lock.json"
    npm ci
else
    npm install
fi
print_success "Dependencies installed"

# Step 5: Sync database (optional)
print_step "Database synchronization"

if [ -f "${SCRIPT_DIR}/db-sync.sh" ]; then
    echo ""
    echo "Would you like to sync the production database to local?"
    echo "This will replace your local database with production data"
    read -p "Sync database now? (Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_warning "Skipping database sync"
        echo "You can run './scripts/db-sync.sh' later"
    else
        chmod +x "${SCRIPT_DIR}/db-sync.sh"
        "${SCRIPT_DIR}/db-sync.sh" -y
    fi
else
    print_warning "Database sync script not found"
fi

# Step 6: Final status
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${MAGENTA}Ready to start development:${NC}"
echo ""
echo "  npm run dev        # Start development server"
echo "  npm run build      # Build for production"
echo "  npm run lint       # Run linter"
echo "  npm test           # Run tests"
echo ""
echo -e "${MAGENTA}Database commands:${NC}"
echo ""
echo "  ./scripts/db-export.sh    # Export production database"
echo "  ./scripts/db-import.sh    # Import to local MongoDB"
echo "  ./scripts/db-sync.sh      # Sync production to local"
echo ""
echo -e "${MAGENTA}Your app will be available at:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"