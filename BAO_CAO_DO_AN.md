# BÁO CÁO ĐỒ ÁN CUỐI KỲ

## ỨNG DỤNG ĐẶT ĐỒ ÁN TRỰC TUYẾN

---

## TRANG BÌA

**ĐẠI HỌC QUỐC GIA TP.HCM**  
**TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN**

---

**BÁO CÁO ĐỒ ÁN CUỐI KỲ**

**MÔN: [TÊN MÔN HỌC - MÃ MÔN]**

**ĐỀ TÀI:**

# ỨNG DỤNG ĐẶT ĐỒ ÁN TRỰC TUYẾN

---

**GIẢNG VIÊN HƯỚNG DẪN:**  
[Tên giảng viên]

**NHÓM SINH VIÊN THỰC HIỆN:**

| STT | Họ và tên  | MSSV   | Email   |
| --- | ---------- | ------ | ------- |
| 1   | [Tên SV 1] | [MSSV] | [Email] |
| 2   | [Tên SV 2] | [MSSV] | [Email] |
| 3   | [Tên SV 3] | [MSSV] | [Email] |

**LỚP:** [Mã lớp]

**TP. HỒ CHÍ MINH, THÁNG 12/2024**

---

## MỤC LỤC

1. [GIỚI THIỆU](#1-giới-thiệu)

    - 1.1. [Lý do chọn đề tài](#11-lý-do-chọn-đề-tài)
    - 1.2. [Mục tiêu đề tài](#12-mục-tiêu-đề-tài)
    - 1.3. [Phạm vi nghiên cứu](#13-phạm-vi-nghiên-cứu)
    - 1.4. [Đối tượng nghiên cứu](#14-đối-tượng-nghiên-cứu)

2. [CÁC CÔNG NGHỆ SỬ DỤNG](#2-các-công-nghệ-sử-dụng)

    - 2.1. [Công nghệ Backend](#21-công-nghệ-backend)
    - 2.2. [Công nghệ Frontend](#22-công-nghệ-frontend)
    - 2.3. [Cơ sở dữ liệu và Infrastructure](#23-cơ-sở-dữ-liệu-và-infrastructure)

3. [PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG](#3-phân-tích-và-thiết-kế-hệ-thống)

    - 3.1. [Yêu cầu chức năng](#31-yêu-cầu-chức-năng)
    - 3.2. [Yêu cầu phi chức năng](#32-yêu-cầu-phi-chức-năng)
    - 3.3. [Kiến trúc hệ thống](#33-kiến-trúc-hệ-thống)
    - 3.4. [Thiết kế cơ sở dữ liệu](#34-thiết-kế-cơ-sở-dữ-liệu)

4. [KẾT QUẢ THỰC HIỆN](#4-kết-quả-thực-hiện)

    - 4.1. [Kết quả Backend](#41-kết-quả-backend)
    - 4.2. [Kết quả Frontend](#42-kết-quả-frontend)
    - 4.3. [Giao diện ứng dụng](#43-giao-diện-ứng-dụng)

5. [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#5-kết-luận-và-hướng-phát-triển)

    - 5.1. [Kết quả đạt được](#51-kết-quả-đạt-được)
    - 5.2. [Hạn chế và hướng cải thiện](#52-hạn-chế-và-hướng-cải-thiện)

6. [TÀI LIỆU THAM KHẢO](#6-tài-liệu-tham-khảo)

---

## DANH MỤC HÌNH ẢNH

-   Hình 3.1: Kiến trúc Microservices tổng quan
-   Hình 3.2: Sơ đồ luồng xác thực JWT
-   Hình 3.3: Mô hình cơ sở dữ liệu
-   Hình 4.1: Màn hình đăng nhập
-   Hình 4.2: Danh sách nhà hàng
-   Hình 4.3: Chi tiết menu và đặt món
-   Hình 4.4: Giỏ hàng
-   Hình 4.5: Theo dõi đơn hàng
-   Hình 4.6: Đánh giá nhà hàng

---

## DANH MỤC BẢNG BIỂU

-   Bảng 2.1: Tổng hợp công nghệ Backend
-   Bảng 2.2: Tổng hợp công nghệ Frontend
-   Bảng 3.1: Danh sách các microservices
-   Bảng 3.2: Các thực thể chính trong cơ sở dữ liệu
-   Bảng 4.1: API endpoints của các services

---

## DANH MỤC CÁC TỪ VIẾT TẮT

| Từ viết tắt | Nghĩa đầy đủ                      |
| ----------- | --------------------------------- |
| API         | Application Programming Interface |
| CORS        | Cross-Origin Resource Sharing     |
| CRUD        | Create, Read, Update, Delete      |
| DTO         | Data Transfer Object              |
| ERD         | Entity Relationship Diagram       |
| HTTP        | Hypertext Transfer Protocol       |
| JWT         | JSON Web Token                    |
| MVC         | Model-View-Controller             |
| ORM         | Object-Relational Mapping         |
| OTP         | One-Time Password                 |
| REST        | Representational State Transfer   |
| RN          | React Native                      |
| SDK         | Software Development Kit          |
| SQL         | Structured Query Language         |
| TCP         | Transmission Control Protocol     |
| UI/UX       | User Interface/User Experience    |

---

## BẢNG PHÂN CÔNG CÔNG VIỆC

| Thành viên | Nhiệm vụ                                                     | Tỷ lệ đóng góp |
| ---------- | ------------------------------------------------------------ | -------------- |
| [Tên SV 1] | [Backend: Auth, User, Restaurant services / Database design] | [%]            |
| [Tên SV 2] | [Backend: Order, Payment, Delivery services / API Gateway]   | [%]            |
| [Tên SV 3] | [Frontend: UI/UX, State management, API integration]         | [%]            |

_Ghi chú: Điều chỉnh theo thực tế phân công của nhóm_

---

# NỘI DUNG BÁO CÁO

## 1. GIỚI THIỆU

### 1.1. Lý do chọn đề tài

Ngành công nghiệp giao đồ ăn tại Việt Nam đang phát triển mạnh mẽ với giá trị thị trường đạt hàng tỷ USD. Các ứng dụng đặt món trực tuyến đã trở thành giải pháp thiết yếu, đáp ứng nhu cầu tiện lợi và tiết kiệm thời gian của người dùng hiện đại.

Nhóm chọn đề tài "Ứng dụng đặt đồ ăn trực tuyến" nhằm:

-   Áp dụng kiến thức lập trình di động và phát triển Backend
-   Nghiên cứu kiến trúc Microservices trong hệ thống thực tế
-   Giải quyết bài toán quản lý đơn hàng, thanh toán và giao nhận phức tạp
-   Tạo nền tảng cho việc phát triển sản phẩm thương mại trong tương lai

### 1.2. Mục tiêu đề tài

**Mục tiêu chung:** Xây dựng hệ thống đặt đồ ăn trực tuyến hoàn chỉnh, bao gồm ứng dụng di động và hệ thống Backend phân tán.

**Mục tiêu cụ thể:**

-   Phát triển ứng dụng mobile đa nền tảng (iOS/Android) với React Native và Expo
-   Xây dựng kiến trúc Microservices với 9 services độc lập
-   Thiết kế cơ sở dữ liệu quan hệ tối ưu với 30+ bảng
-   Triển khai hệ thống xác thực bảo mật JWT và quản lý phiên
-   Tích hợp các tính năng: đặt món, thanh toán ví, theo dõi giao hàng, đánh giá
-   Containerize toàn bộ hệ thống với Docker

### 1.3. Phạm vi nghiên cứu

**Phạm vi thực hiện:**

-   **Platform:** Ứng dụng di động iOS và Android
-   **Người dùng:** Khách hàng, Chủ nhà hàng, Tài xế giao hàng, Quản trị viên
-   **Chức năng chính:** Quản lý nhà hàng, đặt món, thanh toán, giao hàng, đánh giá, khuyến mãi
-   **Công nghệ:** NestJS, PostgreSQL, React Native, Expo, Docker

**Ngoài phạm vi:**

-   Thanh toán qua cổng VNPay/Momo (chỉ hỗ trợ ví nội bộ)
-   Tính toán định tuyến tối ưu cho tài xế
-   Hệ thống quản trị web (Web Admin)

### 1.4. Đối tượng nghiên cứu

-   **Kiến trúc Microservices:** Nghiên cứu cách thiết kế, triển khai và giao tiếp giữa các services
-   **Mobile Development:** Phát triển ứng dụng đa nền tảng với React Native
-   **Bảo mật:** Cơ chế JWT authentication, refresh token, role-based authorization
-   **Quản lý trạng thái:** State management với Zustand và AsyncStorage
-   **Event-driven Architecture:** Sử dụng EventEmitter cho giao tiếp bất đồng bộ

---

## 2. CÁC CÔNG NGHỆ SỬ DỤNG

### 2.1. Công nghệ Backend

**Bảng 2.1: Tổng hợp công nghệ Backend**

| Công nghệ           | Phiên bản | Mục đích sử dụng                                       |
| ------------------- | --------- | ------------------------------------------------------ |
| **NestJS**          | 11.0.0    | Framework chính xây dựng Backend, hỗ trợ Microservices |
| **Nx**              | 22.1.0    | Quản lý monorepo, build optimization, code sharing     |
| **TypeScript**      | 5.9.0     | Ngôn ngữ lập trình, type safety                        |
| **PostgreSQL**      | 16        | Cơ sở dữ liệu quan hệ chính                            |
| **TypeORM**         | 0.3.28    | ORM mapping, query builder, migrations                 |
| **Redis**           | 7         | Caching, session storage, pub/sub                      |
| **Passport JWT**    | 10.1.0    | Authentication và authorization                        |
| **bcrypt**          | 5.1.1     | Mã hóa mật khẩu                                        |
| **class-validator** | 0.15.1    | Validation DTOs                                        |

**Đặc điểm kiến trúc:**

-   **Microservices Pattern:** 9 services độc lập giao tiếp qua TCP transport
-   **API Gateway:** Single entry point cho tất cả HTTP requests
-   **Event-driven:** Services phát và lắng nghe events để xử lý logic bất đồng bộ
-   **Shared Libraries:** Common modules cho database entities, DTOs, utilities

### 2.2. Công nghệ Frontend

**Bảng 2.2: Tổng hợp công nghệ Frontend**

| Công nghệ           | Phiên bản | Mục đích sử dụng               |
| ------------------- | --------- | ------------------------------ |
| **React Native**    | 0.81.5    | Framework phát triển mobile    |
| **Expo SDK**        | 54.0.0    | Toolchain, modules, deployment |
| **Expo Router**     | 6.0.0     | File-based navigation          |
| **Tamagui**         | 1.140.2   | UI component library, theming  |
| **NativeWind**      | 4.1.23    | Tailwind CSS cho React Native  |
| **Zustand**         | 5.0.8     | State management               |
| **Axios**           | 1.13.0    | HTTP client, interceptors      |
| **React Hook Form** | 7.68.0    | Form handling                  |
| **Zod**             | 4.2.0     | Schema validation              |

**Đặc điểm kỹ thuật:**

-   **Cross-platform:** Build iOS và Android từ 1 codebase
-   **Type-safe Routing:** Expo Router với TypeScript
-   **Hybrid Styling:** Kết hợp Tamagui và Tailwind CSS
-   **Automatic Token Refresh:** Axios interceptor xử lý 401 và refresh token
-   **Persistent State:** Zustand với AsyncStorage cho user và notifications

### 2.3. Cơ sở dữ liệu và Infrastructure

**Database:**

-   PostgreSQL 16 với 30+ tables
-   TypeORM cho migrations và seeding
-   Indexes trên các trường tìm kiếm và foreign keys
-   Soft delete cho các entities quan trọng

**Caching & Messaging:**

-   Redis cho session storage
-   Cache query results của restaurant listings
-   Pub/Sub cho real-time notifications (future)

**Containerization:**

-   Docker Compose cho development environment
-   Separate containers cho PostgreSQL, Redis, API Gateway, 9 microservices
-   Hot reload configuration với webpack-hmr
-   Volume mounts cho database persistence

---

## 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Yêu cầu chức năng

Hệ thống được chia thành 9 nhóm chức năng chính:

**A. Quản lý xác thực và phân quyền**

-   Đăng ký tài khoản với xác thực email/OTP
-   Đăng nhập và cấp JWT access/refresh token
-   Quên mật khẩu, reset password qua OTP
-   Phân quyền 4 roles: CUSTOMER, RESTAURANT_OWNER, DRIVER, ADMIN

**B. Quản lý người dùng**

-   Cập nhật profile (tên, ảnh, số điện thoại)
-   Quản lý địa chỉ giao hàng (CRUD, set default)
-   Đăng ký thiết bị nhận push notification
-   Quản lý danh sách nhà hàng yêu thích

**C. Quản lý nhà hàng và thực đơn**

-   Tìm kiếm, lọc nhà hàng theo tên, danh mục, rating, khoảng cách
-   Hiển thị trạng thái mở/đóng cửa theo giờ hoạt động
-   Quản lý menu phân cấp: Categories → Menu Items → Options/Add-ons
-   Cập nhật tình trạng món (available/unavailable)

**D. Quản lý giỏ hàng**

-   Thêm món vào giỏ (validate cùng nhà hàng)
-   Cập nhật số lượng, xóa món
-   Tính tổng tiền tự động
-   Clear giỏ khi tạo đơn thành công

**E. Quản lý đơn hàng**

-   Tạo đơn từ giỏ hàng với validation
-   Sinh mã đơn hàng tự động (ORD-YYYYMMDD-XXXX)
-   Theo dõi trạng thái: PENDING → CONFIRMED → PREPARING → READY → PICKED_UP → DELIVERED → COMPLETED
-   Hủy đơn (chỉ khi PENDING/CONFIRMED)
-   Đặt lại đơn cũ (reorder)
-   Lưu lịch sử thay đổi trạng thái

**F. Quản lý thanh toán**

-   Tạo và nạp tiền vào ví nội bộ
-   Thanh toán đơn hàng bằng ví
-   Hoàn tiền tự động khi hủy đơn
-   Transaction history với status (PENDING, COMPLETED, FAILED, REFUNDED)

**G. Quản lý giao hàng**

-   Đăng ký tài xế với thông tin xe
-   Cập nhật vị trí real-time (latitude, longitude, heading, speed)
-   Tự động gán đơn cho tài xế gần nhất
-   Tính khoảng cách Haversine
-   Trạng thái delivery: PENDING → ASSIGNED → PICKED_UP → ON_THE_WAY → DELIVERED

**H. Quản lý đánh giá**

-   Đánh giá nhà hàng (food rating, delivery rating, comment)
-   Upload hình ảnh đính kèm
-   Chủ nhà hàng reply đánh giá
-   Tự động cập nhật average rating của restaurant
-   Hỗ trợ anonymous reviews

**I. Quản lý khuyến mãi**

-   Tạo voucher với các loại: PERCENTAGE, FIXED_AMOUNT, FREE_DELIVERY
-   Validate voucher: thời gian, usage limits, per-user limits, min order
-   Apply voucher tự động khi tạo đơn
-   Tính toán discount chính xác

### 3.2. Yêu cầu phi chức năng

**Bảo mật:**

-   Mật khẩu được hash với bcrypt (salt rounds = 10)
-   JWT với access token (15 phút) và refresh token (7 ngày)
-   Role-based guards cho tất cả protected endpoints
-   CORS configuration cho phép frontend origin

**Hiệu năng:**

-   API Gateway forward requests với timeout cấu hình
-   Database indexing trên search fields
-   Redis caching cho frequent queries
-   Pagination cho list endpoints (default 10 items/page)

**Khả năng mở rộng:**

-   Microservices có thể scale độc lập
-   Stateless services (session trong Redis)
-   Event-driven giảm coupling giữa services

**Độ tin cậy:**

-   Transaction support cho payment operations
-   Soft delete cho data recovery
-   Error handling và logging chuẩn hóa
-   Global exception filters

### 3.3. Kiến trúc hệ thống

**Bảng 3.1: Danh sách các Microservices**

| Service                  | Port | Chức năng chính                                 |
| ------------------------ | ---- | ----------------------------------------------- |
| **API Gateway**          | 3000 | HTTP entry point, forward requests đến services |
| **Auth Service**         | 4001 | Authentication, JWT, OTP, password management   |
| **User Service**         | 4002 | User profile, addresses, devices, favorites     |
| **Restaurant Service**   | 4003 | Restaurants, menu, categories, operating hours  |
| **Order Service**        | 4004 | Shopping cart, orders, order lifecycle          |
| **Payment Service**      | 4005 | Wallet, transactions, payments, refunds         |
| **Delivery Service**     | 4006 | Drivers, location tracking, assignments         |
| **Review Service**       | 4007 | Reviews, ratings, replies                       |
| **Notification Service** | 4008 | User notifications, event listeners             |
| **Promotion Service**    | 4009 | Vouchers, discounts, validation                 |

**Luồng hoạt động:**

1. **Client → API Gateway:** Mobile app gửi HTTP request với JWT token
2. **API Gateway → Service:** Forward request qua TCP transport
3. **Service → Database:** Query PostgreSQL qua TypeORM
4. **Service → Service:** Emit/listen events qua EventEmitter
5. **Service → API Gateway:** Trả response về gateway
6. **API Gateway → Client:** HTTP response về mobile app

**Event-driven Examples:**

-   `ORDER_EVENTS.CREATED` → Payment Service apply voucher, Notification Service tạo thông báo
-   `PAYMENT_EVENTS.COMPLETED` → Notification Service thông báo thanh toán thành công
-   `ORDER_EVENTS.CANCELLED` → Payment Service tự động refund
-   `REVIEW_EVENTS.CREATED` → Notification Service thông báo chủ nhà hàng

### 3.4. Thiết kế cơ sở dữ liệu

**Bảng 3.2: Các thực thể chính trong cơ sở dữ liệu**

| Entity              | Mô tả                | Relationships                                                         |
| ------------------- | -------------------- | --------------------------------------------------------------------- |
| **users**           | Thông tin người dùng | 1-N với addresses, orders, reviews, notifications                     |
| **restaurants**     | Nhà hàng             | 1-N với menu_items, orders, reviews, operating_hours                  |
| **menu_categories** | Danh mục món         | 1-N với menu_items                                                    |
| **menu_items**      | Món ăn               | N-N với menu_options, cart_items, order_items                         |
| **cart_items**      | Sản phẩm trong giỏ   | N-1 với users, menu_items                                             |
| **orders**          | Đơn hàng             | N-1 với users, restaurants; 1-N với order_items, order_status_history |
| **order_items**     | Chi tiết đơn hàng    | N-1 với orders, menu_items                                            |
| **payments**        | Giao dịch thanh toán | N-1 với users, wallets, orders                                        |
| **wallets**         | Ví tiền              | 1-1 với users                                                         |
| **deliveries**      | Thông tin giao hàng  | 1-1 với orders; N-1 với drivers                                       |
| **drivers**         | Tài xế               | 1-N với deliveries, driver_locations                                  |
| **reviews**         | Đánh giá             | N-1 với users, restaurants, orders                                    |
| **notifications**   | Thông báo            | N-1 với users                                                         |
| **vouchers**        | Mã khuyến mãi        | 1-N với voucher_usage, orders                                         |

**Đặc điểm thiết kế:**

-   **Timestamps:** Tất cả entities có `created_at`, `updated_at`
-   **Soft Delete:** Các bảng quan trọng có `deleted_at` (users, restaurants, orders)
-   **Indexes:** Tạo index trên `email`, `phone_number`, `restaurant_id`, `user_id`, `order_id`
-   **Foreign Keys:** Cascade delete/update phù hợp
-   **Enums:** Sử dụng TypeScript enums cho OrderStatus, PaymentStatus, DeliveryStatus, UserRole

---

## 4. KẾT QUẢ THỰC HIỆN

### 4.1. Kết quả Backend

Backend được xây dựng theo kiến trúc **microservices (NestJS)** trong **Nx monorepo**, gồm **API Gateway** làm entry-point HTTP và các service nghiệp vụ tách biệt theo từng domain. Toàn bộ API tại Gateway sử dụng prefix `/api` và cơ chế forward request sang các microservice thông qua **TCP transport + message patterns**.

**Bảng 4.1: Các nhóm API chính tại API Gateway (prefix `/api`)**

| Service          | Endpoints tiêu biểu                                                                                                                                                                                                             | Methods                | Bảo mật                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------- |
| **Auth**         | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh-token`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-otp`, `/auth/resend-otp`                                                                 | POST                   | Public + JwtAuth (logout)                                 |
| **User**         | `/users/me`, `/users/addresses`, `/users/addresses/:id`, `/users/devices`, `/users/favorites`, `/users/favorites/:restaurantId`                                                                                                 | GET, POST, PUT, DELETE | JwtAuth                                                   |
| **Restaurant**   | `/restaurants`, `/restaurants/categories/all`, `/restaurants/:id`, `/restaurants/:id/menu`, `/restaurants/:id/operating-hours`, `/restaurants/menu-categories`, `/restaurants/menu-items`, `/restaurants/menu-item-options/:id` | GET, POST, PUT, DELETE | Public + JwtAuth + RolesGuard (owner)                     |
| **Order**        | `/cart`, `/cart/items`, `/cart/items/:id`, `/orders`, `/orders/:id`, `/orders/:id/cancel`, `/orders/:id/reorder`, `/restaurants/:id/orders`, `/orders/:id/status`                                                               | GET, POST, PUT, DELETE | JwtAuth (+ RolesGuard cho chủ quán ở route theo nhà hàng) |
| **Payment**      | `/payments/process`, `/payments/:id`, `/payments/:id/refund`, `/payments/wallet/balance`, `/payments/wallet/top-up`, `/payments/wallet/transactions`                                                                            | GET, POST              | JwtAuth                                                   |
| **Delivery**     | `/deliveries/drivers/register`, `/deliveries/drivers/me`, `/deliveries/drivers/status`, `/deliveries/drivers/location`, `/deliveries/available`, `/deliveries/:id/accept`, `/deliveries/:id/status`, `/deliveries/:id/track`    | GET, POST, PUT         | JwtAuth + RolesGuard (driver) cho nghiệp vụ tài xế        |
| **Review**       | `/reviews`, `/reviews/restaurants/:id`, `/reviews/:id`, `/reviews/:id/reply`                                                                                                                                                    | GET, POST, PUT         | JwtAuth (+ RolesGuard cho chủ quán khi reply)             |
| **Notification** | `/notifications`, `/notifications/:id/read`, `/notifications/read-all`, `/notifications/:id`                                                                                                                                    | GET, PUT, DELETE       | JwtAuth                                                   |
| **Promotion**    | `/vouchers`, `/vouchers/:code`, `/vouchers/validate`, `/vouchers/:id`                                                                                                                                                           | GET, POST, PUT, DELETE | JwtAuth (+ RolesGuard cho tạo/cập nhật/vô hiệu)           |

**Các kết quả/nhóm chức năng Backend đã triển khai:**

-   **Xác thực & phân quyền:** đăng ký/đăng nhập, cấp JWT access token và refresh token, refresh-token rotation, logout (thu hồi token), OTP cho xác minh/khôi phục mật khẩu; triển khai `JwtAuthGuard`, `RolesGuard` và decorator `Roles`.

    -   Tham khảo: [backend/apps/auth-service/src/app/auth.service.ts](backend/apps/auth-service/src/app/auth.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/auth.controller.ts](backend/apps/api-gateway/src/app/controllers/auth.controller.ts)

-   **Quản lý người dùng:** lấy/cập nhật hồ sơ (`/users/me`), CRUD địa chỉ nhận hàng, đăng ký device token, và quản lý danh sách yêu thích (favorites) kèm quan hệ `restaurant`.

    -   Tham khảo: [backend/apps/user-service/src/app/user.service.ts](backend/apps/user-service/src/app/user.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/user.controller.ts](backend/apps/api-gateway/src/app/controllers/user.controller.ts)

-   **Nhà hàng & thực đơn:** danh sách nhà hàng có filter/sort/pagination, lấy chi tiết, danh mục nhà hàng, lấy menu theo nhà hàng; CRUD menu categories/menu items/options và cập nhật giờ hoạt động (phân quyền chủ quán).

    -   Tham khảo: [backend/apps/restaurant-service/src/app/restaurant.service.ts](backend/apps/restaurant-service/src/app/restaurant.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/restaurant.controller.ts](backend/apps/api-gateway/src/app/controllers/restaurant.controller.ts)

-   **Giỏ hàng & đơn hàng:** tạo/đọc giỏ hàng, ràng buộc giỏ hàng chỉ chứa món của 1 nhà hàng, tạo đơn, xem danh sách đơn theo user/nhà hàng, hủy đơn, reorder, và cập nhật trạng thái đơn.

    -   Tham khảo: [backend/apps/order-service/src/app/order.service.ts](backend/apps/order-service/src/app/order.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/order.controller.ts](backend/apps/api-gateway/src/app/controllers/order.controller.ts)

-   **Thanh toán & ví:** xử lý thanh toán (có transaction qua `QueryRunner`), quản lý ví (tạo ví khi chưa có), top-up, hoàn tiền và lịch sử giao dịch.

    -   Tham khảo: [backend/apps/payment-service/src/app/payment.service.ts](backend/apps/payment-service/src/app/payment.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/payment.controller.ts](backend/apps/api-gateway/src/app/controllers/payment.controller.ts)

-   **Giao hàng:** đăng ký tài xế, cập nhật trạng thái/định vị, nhận chuyến, cập nhật trạng thái giao hàng và theo dõi (tracking).

    -   Tham khảo: [backend/apps/delivery-service/src/app/delivery.service.ts](backend/apps/delivery-service/src/app/delivery.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/delivery.controller.ts](backend/apps/api-gateway/src/app/controllers/delivery.controller.ts)

-   **Đánh giá:** tạo review theo đơn, truy vấn review theo nhà hàng, reply từ chủ quán; đồng thời cập nhật thống kê rating/reviews của nhà hàng.

    -   Tham khảo: [backend/apps/review-service/src/app/review.service.ts](backend/apps/review-service/src/app/review.service.ts)
    -   Gateway routes: [backend/apps/api-gateway/src/app/controllers/review.controller.ts](backend/apps/api-gateway/src/app/controllers/review.controller.ts)

-   **Thông báo & khuyến mãi:** CRUD thông báo theo user (read/read-all/delete) và hệ thống voucher (lấy danh sách, validate, tạo/cập nhật/vô hiệu).
    -   Tham khảo: [backend/apps/notification-service/src/app/notification.service.ts](backend/apps/notification-service/src/app/notification.service.ts)
    -   Tham khảo: [backend/apps/promotion-service/src/app/promotion.service.ts](backend/apps/promotion-service/src/app/promotion.service.ts)

**Ghi chú kỹ thuật:** API Gateway cấu hình CORS, `ValidationPipe` (whitelist/transform/forbidNonWhitelisted), filter xử lý exception và interceptor logging.
Tham khảo: [backend/apps/api-gateway/src/main.ts](backend/apps/api-gateway/src/main.ts)

### 4.2. Kết quả Frontend

Ứng dụng mobile đã hoàn thiện các màn hình và tính năng chính:

**Authentication Screens:**

-   **Login:** Email/password, "Remember me", navigation to Sign Up/Forgot Password
-   **Sign Up:** Form validation với Zod schema (email, password, confirm password, phone)
-   **Forgot Password:** Nhập email → Verify OTP (6 digits) → Set new password
-   **OTP Verification:** Auto-focus inputs, resend OTP countdown

Tham khảo:

-   [frontend/app/(auth)/login.tsx](<frontend/app/(auth)/login.tsx>)
-   [frontend/app/(auth)/sign-up.tsx](<frontend/app/(auth)/sign-up.tsx>)
-   [frontend/app/(auth)/forgot-password.tsx](<frontend/app/(auth)/forgot-password.tsx>)

**Main App Screens:**

-   **Home:** Featured restaurants, categories filter
-   **Menu/Restaurant List:** Search bar, category filters, restaurant cards
-   **Restaurant Detail:** Menu display, add to cart
-   **Cart:** Item list với quantity controls, remove item, checkout button, total calculation
-   **Orders:** Danh sách đơn hàng với status, order detail navigation
-   **Order Detail:** Items, status tracking, cancel/reorder actions
-   **Review:** Star rating (1-5), comment textarea, submit review

Tham khảo:

-   [frontend/app/(main)/(screens)/cart/index.tsx](<frontend/app/(main)/(screens)/cart/index.tsx>)
-   [frontend/app/(main)/(screens)/review/index.tsx](<frontend/app/(main)/(screens)/review/index.tsx>)
-   [frontend/src/store/useCartStore.ts](frontend/src/store/useCartStore.ts)

**State Management Implementation:**

✅ **useUserStore:**

-   User profile, login/logout actions
-   AsyncStorage persistence
-   Token management

✅ **useCartStore:**

-   Cart operations (fetch, add, update, remove, clear)
-   Computed subtotal và itemCount

✅ **useOrderStore:**

-   Fetch orders với status filter
-   Create, cancel, reorder methods

✅ **useNotificationStore:**

-   Notifications list với unread count
-   Mark as read, delete actions
-   AsyncStorage persistence

**API Services:**

-   Axios client với base URL configuration
-   Automatic Bearer token injection
-   401 Interceptor → Refresh token flow → Retry failed request
-   Error handling chuẩn hóa

Tham khảo: [frontend/src/services/api/client.ts](frontend/src/services/api/client.ts)

### 4.3. Giao diện ứng dụng

_[Chèn screenshots thực tế ở đây - 6-8 màn hình chính]_

**Hình 4.1:** Màn hình đăng nhập  
**Hình 4.2:** Danh sách nhà hàng với tìm kiếm  
**Hình 4.3:** Chi tiết thực đơn  
**Hình 4.4:** Giỏ hàng  
**Hình 4.5:** Theo dõi trạng thái đơn hàng  
**Hình 4.6:** Màn hình đánh giá

_Ghi chú: Vui lòng thêm screenshots từ ứng dụng thực tế hoặc Figma design_

**Link Figma Design (nếu có):** [URL]

---

## 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 5.1. Kết quả đạt được

**Thành tựu kỹ thuật:**

✅ **Kiến trúc Microservices hoàn chỉnh:**

-   9 services độc lập với ranh giới rõ ràng
-   API Gateway làm single entry point
-   Event-driven communication giảm coupling
-   Shared libraries tái sử dụng code hiệu quả

✅ **Ứng dụng mobile đa nền tảng:**

-   Build và chạy trên cả iOS và Android
-   Navigation flow hoàn chỉnh với Expo Router
-   UI/UX nhất quán với Tamagui component system
-   State management tối ưu với Zustand

✅ **Bảo mật và hiệu năng:**

-   JWT authentication với refresh token mechanism
-   Role-based authorization cho 4 user types
-   Password hashing an toàn với bcrypt
-   API caching và pagination

✅ **Tính năng nghiệp vụ:**

-   Hoàn thành 9/9 nhóm chức năng core
-   Order lifecycle đầy đủ với status tracking
-   Payment processing với wallet system
-   Real-time delivery tracking
-   Review và rating system

**Kỹ năng phát triển:**

-   Nắm vững NestJS và React Native ecosystems
-   Hiểu sâu về Microservices patterns
-   Database design và optimization
-   Docker containerization
-   Git workflow và team collaboration

### 5.2. Hạn chế và hướng cải thiện

**Hạn chế hiện tại:**

⚠️ **API Contract mismatch:**

-   Backend pagination format: `{data, total, page, limit, total_pages}`
-   Frontend expects: `{items, ...}`
-   **Giải pháp:** Chuẩn hóa DTOs trong shared library

⚠️ **Thiếu database migrations:**

-   Chưa có migration files quản lý schema changes
-   **Giải pháp:** Tạo migrations với TypeORM CLI

⚠️ **Push notifications chưa thực tế:**

-   Chỉ có in-app notifications
-   **Giải pháp:** Tích hợp Firebase Cloud Messaging

⚠️ **Payment gateway giả lập:**

-   Chưa tích hợp VNPay/Momo
-   **Giải pháp:** Implement payment provider adapters

**Hướng phát triển tương lai:**

🚀 **Ngắn hạn (1-2 tháng):**

-   Sync frontend/backend DTOs
-   Thêm unit tests cho services (coverage > 80%)
-   Real-time order tracking với WebSocket
-   Admin web dashboard

🚀 **Trung hạn (3-6 tháng):**

-   Tích hợp payment gateways thực
-   Firebase push notifications
-   Map integration (Google Maps API)
-   Advanced search với Elasticsearch

🚀 **Dài hạn (6-12 tháng):**

-   Microservices scale với Kubernetes
-   Message queue với RabbitMQ/Kafka
-   CDN cho images
-   Analytics và reporting
-   AI recommendations

---

## 6. TÀI LIỆU THAM KHẢO

[1] NestJS Documentation, "Microservices," NestJS, 2024. [Online]. Available: https://docs.nestjs.com/microservices/basics

[2] Meta Open Source, "React Native Documentation," React Native, 2024. [Online]. Available: https://reactnative.dev/docs/getting-started

[3] Expo Documentation, "Expo SDK 54," Expo, 2024. [Online]. Available: https://docs.expo.dev/

[4] TypeORM, "TypeORM Documentation," TypeORM, 2024. [Online]. Available: https://typeorm.io/

[5] PostgreSQL Global Development Group, "PostgreSQL 16 Documentation," PostgreSQL, 2024. [Online]. Available: https://www.postgresql.org/docs/16/

[6] Redis Labs, "Redis Documentation," Redis, 2024. [Online]. Available: https://redis.io/documentation

[7] Tamagui, "Tamagui UI Kit," Tamagui, 2024. [Online]. Available: https://tamagui.dev/

[8] Zustand, "Zustand State Management," GitHub, 2024. [Online]. Available: https://github.com/pmndrs/zustand

[9] Docker Inc., "Docker Compose Documentation," Docker, 2024. [Online]. Available: https://docs.docker.com/compose/

[10] Auth0, "JWT Introduction," Auth0, 2024. [Online]. Available: https://jwt.io/introduction

---

## PHỤ LỤC

### PHỤ LỤC A: Cấu trúc thư mục dự án

```
food-delivery-app/
├── backend/                    # NestJS Nx Monorepo
│   ├── apps/
│   │   ├── api-gateway/       # HTTP Gateway (port 3000)
│   │   ├── auth-service/      # Authentication Service
│   │   ├── user-service/      # User Management Service
│   │   ├── restaurant-service/# Restaurant & Menu Service
│   │   ├── order-service/     # Order & Cart Service
│   │   ├── payment-service/   # Payment & Wallet Service
│   │   ├── delivery-service/  # Delivery & Driver Service
│   │   ├── review-service/    # Review & Rating Service
│   │   ├── notification-service/
│   │   └── promotion-service/ # Voucher Service
│   ├── libs/
│   │   ├── common/           # Shared utilities
│   │   ├── database/         # TypeORM entities
│   │   ├── contracts/        # Event patterns
│   │   └── shared/           # DTOs, guards, decorators
│   ├── docker-compose.yml
│   └── package.json
├── frontend/                  # Expo React Native App
│   ├── app/
│   │   ├── (auth)/           # Auth screens
│   │   ├── (main)/           # Main app screens
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API clients
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   └── package.json
└── README.md
```

### PHỤ LỤC B: Environment Variables

**Backend (.env):**

```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=food_delivery

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend (.env):**

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_TIMEOUT=30000
```

### PHỤ LỤC C: Lệnh chạy dự án

**Backend:**

```bash
# Install dependencies
cd backend && npm install

# Start PostgreSQL + Redis
docker-compose up -d postgres redis

# Start all services in development mode
npm run dev

# hoặc start từng service
npm run start:api-gateway
npm run start:auth-service
# ...
```

**Frontend:**

```bash
# Install dependencies
cd frontend && npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

---

**KẾT THÚC BÁO CÁO**
