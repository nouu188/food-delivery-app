# Database Seeder

This directory contains scripts to seed the database with comprehensive test data for the food delivery application.

## Overview

The seeder populates the database with realistic data for all entities, with at least 50 records for each major entity.

## Data Summary

The seeder creates:

- **100 Users** (60 customers, 30 restaurant owners, 9 drivers, 1 admin)
- **10 Restaurant Categories** (Fast Food, Vietnamese, Japanese, etc.)
- **50 Restaurants** with complete information
- **350 Operating Hours** (7 days for each restaurant)
- **Restaurant Category Mappings** (linking restaurants to categories)
- **150+ Menu Categories** (~3 per restaurant)
- **500+ Menu Items** with realistic names and prices
- **1000+ Menu Item Options** (sizes, add-ons, toppings, etc.)
- **50 Drivers** with vehicle information
- **100 User Addresses** for customers
- **50 Vouchers** (discount codes and promotions)
- **60 Wallets** for customers and drivers
- **200 Wallet Transactions** (top-ups, payments, refunds)
- **50 Carts** with active items
- **150 Cart Items**
- **100 Orders** with various statuses
- **250+ Order Items**
- **70 Deliveries** with driver assignments
- **100 Payments** with different methods
- **60 Reviews** with ratings and comments
- **100 Review Images**
- **100 User Favorites**

## Prerequisites

1. Ensure PostgreSQL is running
2. Database migrations have been executed
3. Environment variables are properly configured

## Usage

### Method 1: Using ts-node

```bash
# From the backend directory
npx ts-node libs/database/src/lib/seeds/run-seed.ts
```

### Method 2: Add npm script

Add this to your `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node libs/database/src/lib/seeds/run-seed.ts",
    "seed:fresh": "npm run migration:revert && npm run migration:run && npm run seed"
  }
}
```

Then run:

```bash
npm run seed
```

### Method 3: Import and use in your code

```typescript
import { DataSource } from 'typeorm';
import { seedDatabase } from '@backend/database/seeds/data-seed';

// In your application initialization
await seedDatabase(dataSource);
```

## Default Credentials

All users are created with the password: `password123`

### Sample Accounts

**Admin:**
- Email: `admin@example.com`
- Password: `password123`
- Phone: `0940000000`

**Customers:**
- Email: `customer1@example.com` to `customer60@example.com`
- Password: `password123`
- Phone: `0900000001` to `0900000060`

**Restaurant Owners:**
- Email: `owner1@example.com` to `owner30@example.com`
- Password: `password123`
- Phone: `0920000001` to `0920000030`

**Drivers:**
- Email: `driver1@example.com` to `driver50@example.com`
- Password: `password123`
- Phone: `0930000001` to `0930000050`

## Sample Data Features

### Restaurants
- Realistic names (Golden Dragon, Pho Saigon, Sushi Paradise, etc.)
- Complete addresses in Ho Chi Minh City
- Various cuisines and categories
- Operating hours for all 7 days
- Average ratings between 3.5-5.0
- Different delivery fees and minimum order amounts

### Menu Items
- Diverse cuisine items (Vietnamese, Japanese, Korean, Italian, etc.)
- Realistic pricing (30,000 - 200,000 VND)
- Item images using placeholder services
- Availability and featured status
- Preparation times

### Orders
- Various order statuses (Pending, Confirmed, Delivered, etc.)
- Different payment methods (COD, Wallet, Card, Momo, VNPay)
- Realistic order amounts
- Voucher applications
- Special instructions

### Reviews
- Ratings from 4-5 stars
- Realistic comments
- Review images
- Restaurant replies
- Anonymous reviews

## Important Notes

1. **Run migrations first**: Ensure all database tables exist before seeding
2. **Clear data**: If re-seeding, consider clearing existing data first
3. **Foreign keys**: The seeder respects all foreign key constraints
4. **Realistic data**: All data is realistic and suitable for testing
5. **Performance**: Seeding 2000+ records may take 30-60 seconds

## Troubleshooting

### Connection Error
Ensure your `.env` file has the correct database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=food_delivery
```

### Duplicate Key Error
If you get unique constraint violations, the database may already have data. Clear the database or use a fresh database instance.

### Memory Error
If seeding fails due to memory issues, consider reducing the number of records in `data-seed.ts`.

## Customization

You can modify `data-seed.ts` to:
- Change the number of records for each entity
- Add more realistic data
- Include custom business logic
- Add additional entities
- Modify default values

## Development Workflow

```bash
# 1. Reset database (optional)
npm run migration:revert

# 2. Run migrations
npm run migration:run

# 3. Seed database
npm run seed

# 4. Verify data
# Check your database using a GUI tool or psql
```

## Production Warning

⚠️ **DO NOT run this seeder in production!**

This seeder is for development and testing purposes only. Running it in production will create test data and potentially interfere with real user data.
