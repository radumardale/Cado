# Local Development Setup Guide

This guide will help you set up a local development environment for the Cado e-commerce platform that mirrors production as closely as possible.

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **MongoDB Database Tools** (for database sync)

### Installing Prerequisites

#### macOS
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install MongoDB Database Tools
brew install mongodb-database-tools
```

#### Ubuntu/Debian
```bash
# Install MongoDB
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# Install MongoDB Database Tools
sudo apt-get install mongodb-database-tools
```

## Quick Start

### 1. Automated Setup (Recommended)

Run the setup script to configure everything automatically:

```bash
npm run setup
# Or directly:
./scripts/setup-local.sh
```

This script will:
- ✅ Check all prerequisites
- ✅ Start MongoDB locally
- ✅ Create `.env.local` with correct settings
- ✅ Install npm dependencies
- ✅ Optionally sync production database

### 2. Manual Setup

If you prefer to set up manually:

#### Step 1: Environment Variables

Your `.env.local` has been configured with:
- `MONGO_URI=mongodb://localhost:27017/cado` (local MongoDB)
- `BASE_URL=http://localhost:3000` (local URL)
- AWS credentials (for CDN images)
- Email settings (can be mocked)
- Payment gateway settings (can be mocked)

#### Step 2: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Or manually
mongod --dbpath /usr/local/var/mongodb
```

#### Step 3: Sync Database

```bash
npm run db:sync
# Or separately:
npm run db:export  # Export from production
npm run db:import  # Import to local
```

#### Step 4: Install Dependencies

```bash
npm install
```

#### Step 5: Start Development

```bash
npm run dev
```

## Database Management

### Available Commands

```bash
# Complete sync (export + import)
npm run db:sync

# Export production database only
npm run db:export

# Import to local MongoDB only
npm run db:import

# Skip export and use existing backup
npm run db:sync -- --skip-export

# Run with automatic confirmations
npm run db:sync -- -y
```

### Database Scripts

All database scripts are located in `/scripts/`:

- **`db-export.sh`** - Safely exports production database (read-only)
- **`db-import.sh`** - Imports backup to local MongoDB
- **`db-sync.sh`** - Combines export and import
- **`setup-local.sh`** - Complete environment setup

### How It Works

1. **Export** creates a timestamped backup in `/db-backup/`
2. **Import** restores the latest backup to local MongoDB
3. Scripts are **safe** - production is never modified
4. Local database can be freely modified without affecting production

## Environment Configuration

### Key Differences: Local vs Production

| Setting | Production | Local |
|---------|------------|-------|
| `MONGO_URI` | MongoDB Atlas | `mongodb://localhost:27017/cado` |
| `BASE_URL` | `https://cado.md` | `http://localhost:3000` |
| AWS S3 | Production bucket | Same (images via CDN) |
| Email | Real SMTP | Can mock or use test service |
| Payments | Live Paynet API | Can mock or use sandbox |

### Assets Strategy

Images and files are served from the production CloudFront CDN:
- ✅ No need to download assets locally
- ✅ Always up-to-date with production
- ✅ Saves disk space and bandwidth
- ✅ Images load from `d3rus23k068yq9.cloudfront.net`

## Troubleshooting

### MongoDB Issues

**MongoDB not starting:**
```bash
# Check if MongoDB is installed
which mongod

# Check if already running
ps aux | grep mongod

# Start manually
mongod --dbpath /usr/local/var/mongodb

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

**Port 27017 already in use:**
```bash
# Find what's using the port
lsof -i :27017

# Kill the process if needed
kill -9 <PID>
```

### Database Sync Issues

**"mongodump not found":**
```bash
# Install MongoDB Database Tools
brew install mongodb-database-tools  # macOS
```

**Connection timeout during export:**
- Check your internet connection
- Verify production credentials in `.env.production.local`
- Try using a VPN if behind a firewall

**Import fails:**
- Ensure MongoDB is running locally
- Check available disk space
- Verify local MongoDB connection: `mongosh mongodb://localhost:27017`

### Application Issues

**"Cannot connect to database":**
- Verify MongoDB is running
- Check `MONGO_URI` in `.env.local`
- Ensure database was imported successfully

**Images not loading:**
- Check AWS credentials in `.env.local`
- Verify CloudFront CDN is accessible
- Check browser console for CORS errors

## Best Practices

### Daily Workflow

```bash
# Morning: sync latest data
npm run db:sync -- --skip-export  # Use yesterday's backup
# or
npm run db:sync  # Fresh export from production

# Start development
npm run dev

# Before major changes
npm run db:export  # Backup production state
```

### Safety Guidelines

1. **Never commit `.env.production.local`** - Contains sensitive credentials
2. **Always use read-only exports** - Scripts are designed to be safe
3. **Test locally first** - Your local database is isolated
4. **Keep backups** - Timestamped backups in `/db-backup/`

### Performance Tips

- Use `--skip-export` flag when data hasn't changed
- Run sync during off-peak hours for faster exports
- Keep only recent backups to save disk space
- Use MongoDB indexes for better local performance

## Additional Features

### Mock Services (Optional)

For complete isolation from production:

**Email Testing:**
- Use [Mailtrap](https://mailtrap.io/) for email testing
- Or [MailHog](https://github.com/mailhog/MailHog) locally
- Update email credentials in `.env.local`

**Payment Testing:**
- Request Paynet sandbox credentials
- Or create mock API endpoints
- Update API URLs in `.env.local`

### Local S3 Alternative (Optional)

To avoid using production AWS:
- Install [LocalStack](https://localstack.cloud/)
- Or use [MinIO](https://min.io/)
- Update AWS endpoints in code

## Support

If you encounter issues:

1. Check this documentation first
2. Review script output for error messages
3. Verify all prerequisites are installed
4. Check MongoDB and Node.js versions

## Summary

Your local environment now:
- ✅ Uses production data locally
- ✅ Isolated from production systems
- ✅ Images load from CDN
- ✅ Easy database refresh anytime
- ✅ Safe to experiment and develop

Run `npm run dev` and visit http://localhost:3000 to start developing!