# Food Delivery Application - Backend

A NestJS-based microservices architecture for a comprehensive food delivery platform built with Nx monorepo.

## 📚 Documentation

- **[PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md)** - Current implementation status and completed work
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed guide for implementing remaining services

## 🏗️ Architecture

### Microservices
- **Auth Service** (Port 3000, TCP 3001) ✅ COMPLETED
- **User Service** (Port 3010, TCP 3002) ✅ COMPLETED
- **Restaurant Service** (Port 3020, TCP 3003) ⏳ TO IMPLEMENT
- **Order Service** (Port 3030, TCP 3004) ⏳ TO IMPLEMENT
- **Payment Service** (Port 3040, TCP 3005) ⏳ TO IMPLEMENT
- **Delivery Service** (Port 3050, TCP 3006) ⏳ TO IMPLEMENT
- **Review Service** (Port 3060, TCP 3007) ⏳ TO IMPLEMENT
- **Notification Service** (Port 3070, TCP 3008) ⏳ TO IMPLEMENT
- **Promotion Service** (Port 3080, TCP 3009) ⏳ TO IMPLEMENT
- **API Gateway** (Port 8000) ⏳ TO IMPLEMENT

### Technology Stack
- **Framework:** NestJS with Nx monorepo
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (Access & Refresh tokens)
- **Communication:** TCP for inter-service, HTTP for clients
- **Caching:** Redis (to be configured)
- **Validation:** class-validator & class-transformer

## 🚀 Quick Start

### Installation
```bash
cd backend
npm install
```

### Database Setup
```bash
# Create PostgreSQL database
createdb food_delivery

# Configure environment variables
# Copy .env.example to .env and update values
```

### Run Services

```bash
# Auth Service
nx serve auth-service

# User Service
nx serve user-service

# Build for production
nx build auth-service
```

## 📁 Project Structure

```
backend/
├── apps/                          # Microservices
│   ├── auth-service/              ✅ Fully implemented
│   ├── user-service/              ✅ Fully implemented
│   ├── restaurant-service/        ⏳ To implement
│   ├── order-service/             ⏳ To implement
│   ├── payment-service/           ⏳ To implement
│   ├── delivery-service/          ⏳ To implement
│   ├── review-service/            ⏳ To implement
│   ├── notification-service/      ⏳ To implement
│   ├── promotion-service/         ⏳ To implement
│   └── api-gateway/               ⏳ To implement
│
├── libs/                          # Shared libraries
│   ├── common/                    ✅ Guards, decorators, filters, pipes
│   ├── contracts/                 ✅ Events and message patterns
│   ├── database/                  ✅ All entities created
│   └── shared/                    ✅ All DTOs and enums
│
├── IMPLEMENTATION_GUIDE.md        # Detailed implementation guide
├── PROGRESS_SUMMARY.md            # Current progress status
└── README.md                      # This file
```

## 🎯 Current Implementation Status

**Completed (30%):**
- ✅ Complete foundation (DTOs, Entities, Enums, Common utilities)
- ✅ Auth Service - Full authentication & authorization
- ✅ User Service - Profile, addresses, devices, favorites

**Remaining (70%):**
- ⏳ 7 additional microservices to implement
- ⏳ API Gateway for request routing
- ⏳ Redis configuration for caching & pub/sub
- ⏳ TypeORM migrations

## 🔧 Environment Variables

Create `.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=food_delivery

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🧪 Testing

```bash
# Unit tests
nx test auth-service
nx test user-service

# E2E tests
nx e2e auth-service-e2e

# Test with coverage
nx test auth-service --coverage
```

## 📖 API Examples

### Auth Service
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### User Service
```bash
# Get profile (replace TOKEN)
curl -X GET http://localhost:3010/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

## 📝 Next Steps

1. **Read Documentation**
   - Start with `PROGRESS_SUMMARY.md` to understand what's been done
   - Review `IMPLEMENTATION_GUIDE.md` for implementation patterns

2. **Implement Remaining Services**
   - Follow the established pattern from Auth & User services
   - Use the comprehensive guide for each service
   - Test incrementally as you build

3. **Integration**
   - Implement API Gateway to route requests
   - Configure Redis for caching and event pub/sub
   - Create TypeORM migrations

4. **Production Ready**
   - Add comprehensive tests
   - Set up Docker Compose
   - Configure CI/CD
   - Add monitoring and logging

## 💡 Tips for Implementation

- **Use Reference Services:** Auth and User services are complete examples
- **Follow the Pattern:** Each service has the same structure
- **Reuse Shared Code:** All DTOs, entities, and utilities are ready
- **Test Incrementally:** Don't wait until everything is done
- **Check Port Assignments:** Each service has designated HTTP and TCP ports

## 🤝 Contributing

When implementing services:
1. Follow the pattern in `IMPLEMENTATION_GUIDE.md`
2. Use existing DTOs from `libs/shared`
3. Use existing entities from `libs/database`
4. Write tests for new functionality
5. Update documentation

## 📞 Support

For implementation help:
- Refer to `IMPLEMENTATION_GUIDE.md` for detailed examples
- Check completed services (auth-service, user-service) for reference
- Ensure PostgreSQL is running
- Verify ports are not in use

---

**Overall Progress: ~30% Complete**

**Last Updated:** December 2025
