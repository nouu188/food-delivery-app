# Food Delivery Backend - Implementation Guide

## Overview
This guide provides the implementation pattern for completing all remaining microservices. Auth Service and User Service have been fully implemented as reference examples.

## Completed Services
- ✅ Auth Service (Port 3000, TCP 3001)
- ✅ User Service (Port 3010, TCP 3002)

## Service Port Assignments
| Service | HTTP Port | TCP Port |
|---------|-----------|----------|
| Auth Service | 3000 | 3001 |
| User Service | 3010 | 3002 |
| Restaurant Service | 3020 | 3003 |
| Order Service | 3030 | 3004 |
| Payment Service | 3040 | 3005 |
| Delivery Service | 3050 | 3006 |
| Review Service | 3060 | 3007 |
| Notification Service | 3070 | 3008 |
| Promotion Service | 3080 | 3009 |
| API Gateway | 8000 | N/A |

## Implementation Pattern

Each service follows this structure:

```
apps/{service-name}/src/
├── app/
│   ├── {service}.controller.ts    # HTTP and Message Pattern handlers
│   ├── {service}.service.ts        # Business logic
│   ├── app.module.ts               # Module configuration
│   └── strategies/                 # JWT strategy (if needed)
└── main.ts                         # Bootstrap configuration
```

### Step-by-Step Implementation

#### 1. Create Service File
```typescript
// apps/{service-name}/src/app/{service}.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { /* Entities */ } from '@backend/database';

@Injectable()
export class {Service}Service {
  constructor(
    @InjectRepository(Entity)
    private readonly repository: Repository<Entity>,
  ) {}

  // Implement business logic methods
}
```

#### 2. Create Controller File
```typescript
// apps/{service-name}/src/app/{service}.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { {Service}Service } from './{service}.service';

@Controller('{route}')
export class {Service}Controller {
  constructor(private readonly service: {Service}Service) {}

  @Get()
  @MessagePattern('{service}.list')
  async list() {
    return this.service.list();
  }

  // Add more endpoints
}
```

#### 3. Update app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { /* Entities */ } from '@backend/database';
import { {Service}Controller } from './{service}.controller';
import { {Service}Service } from './{service}.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'food_delivery',
      entities: [/* List entities */],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([/* List entities */]),
  ],
  controllers: [{Service}Controller],
  providers: [{Service}Service],
})
export class AppModule {}
```

#### 4. Update main.ts
```typescript
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: {TCP_PORT}, // See port table above
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  const port = process.env.PORT || {HTTP_PORT}; // See port table above
  await app.listen(port);

  Logger.log(`🚀 {Service} is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 {Service} Microservice is listening on TCP port {TCP_PORT}`);
}

bootstrap();
```

#### 5. Delete Default Files
```bash
rm apps/{service-name}/src/app/app.controller.ts
rm apps/{service-name}/src/app/app.service.ts
```

---

## Restaurant Service Implementation

### Entities
`Restaurant`, `RestaurantCategory`, `RestaurantCategoryMapping`, `OperatingHours`, `MenuCategory`, `MenuItem`, `MenuItemOption`

### Key Methods

**RestaurantService:**
- `findAll(query)` - List/search restaurants with filters
- `findOne(id)` - Get restaurant details
- `create(data)` - Create restaurant
- `update(id, data)` - Update restaurant
- `toggleStatus(id)` - Open/close restaurant
- `getMenu(id)` - Get full menu
- `createMenuCategory(data)` - Create menu category
- `updateMenuCategory(id, data)` - Update menu category
- `deleteMenuCategory(id)` - Delete menu category
- `createMenuItem(data)` - Create menu item
- `updateMenuItem(id, data)` - Update menu item
- `deleteMenuItem(id)` - Delete menu item
- `createMenuItemOption(data)` - Add option
- `updateMenuItemOption(id, data)` - Update option
- `deleteMenuItemOption(id)` - Delete option
- `getCategories()` - List cuisine categories
- `updateOperatingHours(id, data)` - Update hours

### Endpoints
- `GET /restaurants` - List/search
- `GET /restaurants/:id` - Get details
- `POST /restaurants` - Create (owner)
- `PUT /restaurants/:id` - Update (owner)
- `PUT /restaurants/:id/status` - Toggle open/close
- `GET /restaurants/:id/menu` - Get menu
- `POST /menu-categories` - Create category
- `PUT /menu-categories/:id` - Update category
- `DELETE /menu-categories/:id` - Delete category
- `POST /menu-items` - Create item
- `PUT /menu-items/:id` - Update item
- `DELETE /menu-items/:id` - Delete item
- `POST /menu-items/:id/options` - Add option
- `PUT /menu-item-options/:id` - Update option
- `DELETE /menu-item-options/:id` - Delete option
- `GET /restaurant-categories` - List categories
- `PUT /restaurants/:id/operating-hours` - Update hours

---

## Order Service Implementation

### Entities
`Cart`, `CartItem`, `Order`, `OrderItem`, `OrderStatusHistory`

### Key Methods

**OrderService:**
- `getCart(userId)` - Get current cart
- `addToCart(userId, data)` - Add item to cart
- `updateCartItem(userId, itemId, data)` - Update cart item
- `removeCartItem(userId, itemId)` - Remove cart item
- `clearCart(userId)` - Clear cart
- `createOrder(userId, data)` - Create order (checkout)
- `getUserOrders(userId, query)` - List user orders
- `getOrder(orderId)` - Get order details
- `cancelOrder(orderId, data)` - Cancel order
- `reorder(userId, orderId)` - Reorder previous order
- `getRestaurantOrders(restaurantId, query)` - List restaurant orders
- `updateOrderStatus(orderId, data)` - Update order status

### Endpoints
- `GET /cart` - Get cart
- `POST /cart/items` - Add to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove cart item
- `DELETE /cart` - Clear cart
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order
- `PUT /orders/:id/cancel` - Cancel order
- `POST /orders/:id/reorder` - Reorder
- `GET /restaurants/:id/orders` - Restaurant orders
- `PUT /orders/:id/status` - Update status

---

## Payment Service Implementation

### Entities
`Payment`, `Wallet`, `WalletTransaction`

### Key Methods

**PaymentService:**
- `processPayment(data)` - Process payment for order
- `getPayment(id)` - Get payment details
- `refundPayment(id, data)` - Process refund
- `getWallet(userId)` - Get wallet balance
- `topUpWallet(userId, data)` - Top up wallet
- `getWalletTransactions(userId, query)` - List transactions

### Endpoints
- `POST /payments/process` - Process payment
- `GET /payments/:id` - Get payment
- `POST /payments/:id/refund` - Refund
- `GET /wallet` - Get wallet
- `POST /wallet/top-up` - Top up
- `GET /wallet/transactions` - List transactions

---

## Delivery Service Implementation

### Entities
`Driver`, `DriverLocation`, `Delivery`

### Key Methods

**DeliveryService:**
- `registerDriver(userId, data)` - Driver registration
- `getDriverProfile(driverId)` - Get driver profile
- `updateDriverProfile(driverId, data)` - Update driver
- `setDriverStatus(driverId, isOnline)` - Set online/offline
- `updateDriverLocation(driverId, data)` - Update location
- `getAvailableDeliveries(driverId)` - List available deliveries
- `acceptDelivery(driverId, deliveryId)` - Accept delivery
- `updateDeliveryStatus(deliveryId, data)` - Update delivery status
- `trackDelivery(deliveryId)` - Get delivery tracking

### Endpoints
- `POST /drivers/register` - Register
- `GET /drivers/me` - Get profile
- `PUT /drivers/me` - Update profile
- `PUT /drivers/status` - Set status
- `PUT /drivers/location` - Update location
- `GET /deliveries/available` - Available deliveries
- `PUT /deliveries/:id/accept` - Accept delivery
- `PUT /deliveries/:id/status` - Update status
- `GET /deliveries/:id/track` - Track delivery

---

## Review Service Implementation

### Entities
`Review`, `ReviewImage`

### Key Methods

**ReviewService:**
- `createReview(userId, data)` - Submit review
- `getRestaurantReviews(restaurantId, query)` - List reviews
- `getReview(id)` - Get review details
- `replyToReview(restaurantId, reviewId, reply)` - Restaurant reply

### Endpoints
- `POST /reviews` - Submit review
- `GET /restaurants/:id/reviews` - List reviews
- `GET /reviews/:id` - Get review
- `PUT /reviews/:id/reply` - Reply to review

---

## Notification Service Implementation

### Entities
`Notification`, `NotificationTemplate`

### Key Methods

**NotificationService:**
- `sendNotification(data)` - Send notification (internal)
- `getUserNotifications(userId, query)` - List notifications
- `markAsRead(userId, notificationId)` - Mark as read
- `markAllAsRead(userId)` - Mark all as read
- `deleteNotification(userId, notificationId)` - Delete notification
- `sendPush(userId, data)` - Send push via FCM
- `sendEmail(userId, data)` - Send email
- `sendSMS(userId, data)` - Send SMS

### Endpoints
- `GET /notifications` - List notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

---

## Promotion Service Implementation

### Entities
`Voucher`, `VoucherUsage`

### Key Methods

**PromotionService:**
- `getAvailableVouchers(userId)` - List available vouchers
- `getVoucherByCode(code)` - Get voucher by code
- `validateVoucher(userId, data)` - Validate voucher for order
- `createVoucher(data)` - Create voucher (admin/restaurant)
- `updateVoucher(id, data)` - Update voucher
- `deactivateVoucher(id)` - Deactivate voucher

### Endpoints
- `GET /vouchers` - List available vouchers
- `GET /vouchers/:code` - Get by code
- `POST /vouchers/validate` - Validate voucher
- `POST /vouchers` - Create voucher
- `PUT /vouchers/:id` - Update voucher
- `DELETE /vouchers/:id` - Deactivate voucher

---

## API Gateway Implementation

The API Gateway routes requests to microservices and handles authentication.

### Configuration

**app.module.ts:**
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
    }),
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3001 } },
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
      { name: 'RESTAURANT_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
      { name: 'ORDER_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3004 } },
      { name: 'PAYMENT_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3005 } },
      { name: 'DELIVERY_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3006 } },
      { name: 'REVIEW_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3007 } },
      { name: 'NOTIFICATION_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3008 } },
      { name: 'PROMOTION_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3009 } },
    ]),
  ],
})
export class AppModule {}
```

### Gateway Controllers

Create controllers for each service that proxy requests to microservices:

```typescript
@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authClient.send('auth.register', data);
  }

  // Add more endpoints
}
```

---

## Redis Configuration

### Install Redis
```bash
npm install ioredis @nestjs/cache-manager cache-manager cache-manager-ioredis-yet
```

### Configure in Services

Add to app.module.ts imports:
```typescript
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    }),
  }),
}),
```

### Pub/Sub for Events

```typescript
import Redis from 'ioredis';

const publisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
});

const subscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
});

subscriber.subscribe('order-created', (err, count) => {
  if (err) console.error(err);
});

subscriber.on('message', (channel, message) => {
  console.log(`Received ${message} from ${channel}`);
});

publisher.publish('order-created', JSON.stringify({ orderId: '123' }));
```

---

## TypeORM Migrations

### Generate Migration

```bash
npm run typeorm migration:generate -- -n InitialSchema
```

### Create Migration Manually

```bash
npm run typeorm migration:create -- -n CreateUsersTable
```

### Migration File Structure

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
        email_verified_at TIMESTAMP,
        phone_verified_at TIMESTAMP,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_phone ON users(phone);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
```

### Run Migrations

```bash
npm run typeorm migration:run
```

### Revert Migration

```bash
npm run typeorm migration:revert
```

---

## Environment Variables

Create `.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=food_delivery

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Service Ports (Optional, defaults are set in main.ts)
AUTH_SERVICE_PORT=3000
USER_SERVICE_PORT=3010
RESTAURANT_SERVICE_PORT=3020
ORDER_SERVICE_PORT=3030
PAYMENT_SERVICE_PORT=3040
DELIVERY_SERVICE_PORT=3050
REVIEW_SERVICE_PORT=3060
NOTIFICATION_SERVICE_PORT=3070
PROMOTION_SERVICE_PORT=3080
API_GATEWAY_PORT=8000
```

---

## Next Steps

1. Implement remaining services following the pattern above
2. Configure Redis for caching and pub/sub
3. Create TypeORM migrations for all entities
4. Implement API Gateway to route requests
5. Add Swagger documentation to API Gateway
6. Set up Docker compose for local development
7. Add unit and integration tests
8. Configure CI/CD pipeline

---

## Testing

### Run Individual Service

```bash
nx serve auth-service
nx serve user-service
```

### Build

```bash
nx build auth-service
nx build user-service
```

### Test

```bash
nx test auth-service
nx test user-service
```
