# Tài liệu Kiến trúc Backend - Ứng dụng Giao đồ ăn

## 1. Nguyên tắc Kiến trúc Cốt lõi (Core Architectural Principles)

Hệ thống được xây dựng dựa trên 5 nguyên tắc chính:

### 1.1. Quản lý Code tập trung với Monorepo
- Tất cả source code của các microservice và các thư viện chia sẻ đều được đặt trong một kho chứa duy nhất (monorepo).  
- **Lý do**: Đơn giản hóa việc quản lý phiên bản, chia sẻ code (types, configs, utils), và thực hiện các thay đổi liên quan đến nhiều service trong một lần commit (atomic commit).  
- **Công cụ**: Turborepo hoặc Nx.

### 1.2. Domain-Driven Design (DDD) & Clean Architecture
- Logic nghiệp vụ là trái tim của hệ thống. Kiến trúc được thiết kế để bảo vệ và cô lập lớp Domain khỏi các chi tiết kỹ thuật của các lớp khác.  
- **Lý do**: Giúp hệ thống dễ hiểu hơn vì code phản ánh đúng ngôn ngữ nghiệp vụ. Logic cốt lõi không bị phụ thuộc vào database, framework hay API bên ngoài, giúp việc thay đổi công nghệ trong tương lai trở nên dễ dàng.

### 1.3. Tách biệt Đọc/Ghi với CQRS (Command Query Responsibility Segregation)
- Các hoạt động thay đổi trạng thái hệ thống (**Commands - Ghi**) được tách biệt hoàn toàn khỏi các hoạt động truy vấn dữ liệu (**Queries - Đọc**).  
- **Lý do**: Cho phép tối ưu hóa riêng biệt cho từng luồng. Luồng Ghi có thể phức tạp với nhiều validation và event, trong khi luồng Đọc có thể được tối ưu để truy xuất dữ liệu nhanh nhất có thể, thậm chí từ một bản sao dữ liệu (read replica) hoặc cache.

### 1.4. Giao tiếp Bất đồng bộ với Event-Driven Architecture (EDA)
- Các microservice giao tiếp với nhau một cách lỏng lẻo (loosely coupled) thông qua việc phát và lắng nghe các sự kiện qua một message broker trung tâm.  
- **Lý do**: Tăng khả năng phục hồi và mở rộng. Nếu một service xử lý sự kiện bị lỗi, các service khác không bị ảnh hưởng. Việc thêm một tính năng mới thường chỉ cần tạo một service mới lắng nghe các sự kiện có sẵn mà không cần sửa đổi các service hiện có.  
- **Công nghệ**: Apache Kafka.

### 1.5. Đóng gói và Điều phối với Docker & Kubernetes (K8s)
- Mỗi microservice được đóng gói thành một container Docker độc lập. Toàn bộ hệ thống được triển khai và điều phối trên một cụm Kubernetes.  
- **Lý do**: Đảm bảo tính nhất quán giữa các môi trường (development, staging, production). Kubernetes cung cấp khả năng tự động co giãn (auto-scaling), tự phục hồi (self-healing) và triển khai không gián đoạn (zero-downtime deployment).

---

## 2. Cấu trúc Chi tiết các Lớp (Detailed Layered Architecture)

Kiến trúc ứng dụng được chia thành 4 lớp theo nguyên tắc Clean Architecture.  
Hướng phụ thuộc luôn hướng vào trong: **Presentation → Application → Domain**.  
Lớp **Infrastructure** sẽ implement các interface được định nghĩa ở lớp Domain.

### 2.1. Lớp Domain (`src/domain`)
Lớp trung tâm, không phụ thuộc vào bất kỳ lớp nào khác. Chứa toàn bộ logic và quy tắc nghiệp vụ.

- **Entities (`entities/`)**: Các thực thể nghiệp vụ cốt lõi như `Order`, `Restaurant`, `User`, `MenuItem`.  
- **Events (`events/`)**: Các sự kiện quan trọng xảy ra trong domain. Ví dụ: `OrderPlacedEvent`, `OrderDeliveredEvent`.  
- **Services (`services/`)**: Logic nghiệp vụ không thuộc về một entity cụ thể nào. Ví dụ: `DeliveryFeeCalculatorService`.  
- **Interfaces (`interfaces/`)**: Các "hợp đồng" mà lớp Infrastructure phải tuân theo. Ví dụ: `IOrderRepository`, `IUserRepository`.  
- **Exceptions (`exceptions/`)**: Các lỗi nghiệp vụ tùy chỉnh. Ví dụ: `RestaurantIsClosedException`, `InvalidMenuItemException`.

### 2.2. Lớp Application (`src/application`)
Lớp điều phối, chứa các kịch bản sử dụng của ứng dụng (use cases). Đây là nơi triển khai CQRS.

- **Commands (`commands/`)**  
  - `CreateOrder.command.ts`: DTO chứa dữ liệu để tạo đơn hàng.  
  - `handlers/CreateOrder.command.handler.ts`: Logic xử lý command.  

- **Queries (`queries/`)**  
  - `FindNearbyRestaurants.query.ts`: DTO chứa tọa độ và bán kính tìm kiếm.  
  - `handlers/FindNearbyRestaurants.query.handler.ts`: Logic xử lý query.  

- **Event Handlers (`event-handlers/`)**  
  - `OrderPlaced.event.handler.ts`: Lắng nghe `OrderPlacedEvent` và kích hoạt việc gửi thông báo, thanh toán, tìm tài xế.

### 2.3. Lớp Infrastructure (`src/infrastructure`)
Cung cấp các cài đặt cụ thể cho công nghệ bên ngoài.

- **Repositories (`repositories/`)**: Cài đặt các interface repository, sử dụng PostgreSQL + PostGIS.  
- **Event Bus (`event-bus/`)**: Gửi và nhận sự kiện, sử dụng Kafka.  
- **Services (`services/`)**: Tích hợp payment (Stripe, MoMo), lưu trữ (S3), caching (Redis).  
- **ORM/Database (`database/`)**: Cấu hình TypeORM/Prisma và schema.

### 2.4. Lớp Presentation (`src/presentation`)
Giao tiếp với thế giới bên ngoài (HTTP API).

- **Controllers (`http/controllers/`)**: Nhận request, xác thực, ủy quyền xử lý cho Application.  
- **DTOs (`http/dtos/`)**: Xác định cấu trúc dữ liệu request/response.  
- **Middleware/Guards (`http/guards/`)**: Xử lý Authentication và Authorization.

---

## 3. Luồng Hoạt động (Operational Flows)

### 3.1. Luồng Ghi (Command Flow): Đặt một đơn hàng
1. Client gửi `POST /orders` với thông tin giỏ hàng.  
2. API Gateway → `OrdersController`.  
3. Controller → `CreateOrderCommand`.  
4. Command → Command Bus.  
5. `CreateOrderCommandHandler` xử lý:
   - Kiểm tra nhà hàng mở cửa.  
   - Tạo `Order` entity.  
   - Tính phí giao hàng bằng `DeliveryFeeCalculatorService`.  
   - Lưu vào DB (`IOrderRepository`).  
   - Phát `OrderPlacedEvent` lên Kafka.  
6. Controller trả về `201 Accepted` với ID đơn hàng.

### 3.2. Luồng Sự kiện (Event Flow): Sau khi đơn hàng được đặt
- `OrderPlacedEvent` publish lên Kafka (`order.placed`).  
- Các service lắng nghe:  
  - **Notification Service**: Gửi push notification.  
  - **Payment Service**: Bắt đầu thanh toán online.  
  - **Driver Service**: Đưa đơn hàng vào hàng đợi tìm tài xế.

---

## Hướng dẫn: Các tài liệu cần thiết khác

### Tài liệu Đặc tả API (API Specification)
- **Nội dung**: Mô tả endpoint (URL, method, headers, body, response, error codes).  
- **Công cụ**: OpenAPI (Swagger).  
- **Mục đích**: Cho Frontend, Mobile, QA.

### Thiết kế Lược đồ Dữ liệu (Database Schema Design)
- **Nội dung**: ERD, chi tiết bảng/cột, constraints, indexes, giải thích thiết kế.  
- **Mục đích**: Backend đảm bảo tính nhất quán và hiệu năng.

### Tài liệu Thiết kế CI/CD Pipeline
- **Nội dung**: Build → Lint → Test → Build Docker → Push Registry → Deploy K8s.  
- **Công cụ**: Helm/ArgoCD.  
- **Mục đích**: Tự động hóa triển khai.

### Tài liệu về Hạ tầng (Infrastructure as Code - IaC)
- **Nội dung**: Quản lý K8s, DB, Kafka cluster bằng code.  
- **Công cụ**: Terraform hoặc Ansible.  
- **Mục đích**: Tự động hóa hạ tầng, tránh lỗi thủ công.

### Chiến lược Logging, Monitoring và Alerting
- **Nội dung**: Structured logging, metrics (CPU, memory, latency, error rate), alerting.  
- **Công cụ**: Prometheus & Grafana (monitoring), ELK/Loki (logging).  
- **Mục đích**: Đảm bảo observability.

### Quy ước Viết Code và Hướng dẫn Style (Coding Conventions & Style Guide)
- **Nội dung**: Quy tắc naming, format code, xử lý lỗi, best practice.  
- **Công cụ**: ESLint + Prettier.  
- **Mục đích**: Code sạch, nhất quán, dễ đọc.

---
