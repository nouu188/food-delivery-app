# TÓM TẮT VẤN ĐÁP (Mobile-first) – Food Delivery App

> Mục tiêu: tóm tắt nhanh những điểm quan trọng để vấn đáp theo yêu cầu môn **Công nghệ lập trình đa nền tảng cho ứng dụng di động**. Nội dung ưu tiên các vấn đề **trên nền tảng mobile**: kiến trúc app, điều hướng, quản lý trạng thái, xử lý mạng, bảo mật token, UX/luồng người dùng.

---

## 1) Tổng quan đồ án

-   **Bài toán**: ứng dụng đặt đồ ăn (khách hàng) + backend quản lý nghiệp vụ (auth/user/restaurant/order/payment/delivery/review/notification/promotion).
-   **Nền tảng chính**: mobile (iOS/Android) dùng 1 codebase.
-   **Kiến trúc backend**: NestJS microservices trong Nx monorepo, giao tiếp **HTTP (client ↔ gateway)** và **TCP (gateway ↔ services)**.

---

## 2) Công nghệ sử dụng

### Frontend (Mobile)

-   **React Native + Expo** (Expo Router) để chạy đa nền tảng.
-   UI: **Tamagui** + **NativeWind**.
-   Form & validation: **react-hook-form** + **zod**.
-   HTTP: **Axios** (có interceptor refresh-token).
-   State: **Zustand** (một số store persist bằng AsyncStorage).

### Backend

-   **NestJS** (microservices + event emitter), **Nx monorepo**.
-   DB: **PostgreSQL** + **TypeORM**.
-   Auth: **JWT** access/refresh, guards/strategies.
-   Notification: **firebase-admin** (FCM) + lưu notification DB.
-   Infra: Docker Compose (postgres/redis + các service + api-gateway).

---

## 3) Kiến trúc & luồng chính trên Mobile (trọng tâm vấn đáp)

### 3.1 Điều hướng (navigation) – Expo Router

Cấu trúc route theo nhóm:

-   `launch/*`: splash/welcome.
-   `(onboarding)/*`: onboarding.
-   `(auth)/*`: Login/SignUp/ForgotPassword/VerifyOTP/SetPassword.
-   `(main)/*`: app chính.
    -   `(tabs)/*`: tab Home/Menu/Favourite/Orders/Contact.
    -   `(screens)/*`: cart, checkout, delivery-address, restaurant, order-details, …

Điểm cần nói khi vấn đáp:

-   Chọn Expo Router vì **file-based routing** dễ tổ chức màn hình, phù hợp app vừa/nhỏ, ít boilerplate.
-   Nhóm route giúp tách luồng (auth vs main) rõ ràng.

### 3.2 App-level providers & “khung chạy” của ứng dụng

Tại `frontend/app/_layout.tsx`:

-   `ErrorBoundary`: tránh crash toàn app.
-   `TamaguiProvider`: theming/UI.
-   `AuthProvider`: điều phối đăng nhập + bảo vệ route.
-   `ToastHost`, `ConfirmHost`: hiển thị toast và dialog confirm theo kiểu “global overlay”.

### 3.3 Auth & bảo vệ route (điểm hỏi rất hay)

Tại `frontend/src/contexts/AuthContext.tsx`:

-   Khi app mount: `checkAuth()`
    -   đọc access token từ AsyncStorage
    -   nếu có token → gọi `/users/me` để **verify token thật sự** và nạp profile.
-   Dựa vào `useSegments()` của Expo Router:
    -   Nếu chưa auth mà truy cập `(main)` → redirect sang `/(auth)/Login`.
    -   Nếu đã auth mà vẫn ở `(auth)` hoặc `launch` → redirect sang `/(main)/(tabs)/Home`.
-   Có **Guest mode** (flag `guest_mode` trong AsyncStorage):
    -   `continueAsGuest()` cho phép vào app (tuỳ màn hình) mà không có token.

Điểm cần nói:

-   Đây là giải pháp “mobile-first”: app hay bị kill/reopen → cần persist token và tự restore session.

### 3.4 HTTP client & Refresh token (câu hỏi kinh điển)

Tại `frontend/src/services/api/client.ts`:

-   Request interceptor:
    -   tự gắn header `Authorization: Bearer <access_token>`.
-   Response interceptor:
    -   nếu gặp **401** và request chưa retry:
        -   gọi `/auth/refresh-token` với `refresh_token`.
        -   lưu token mới vào AsyncStorage.
        -   retry request cũ.
    -   có cơ chế **queue** (`failedQueue`) để nhiều request cùng dính 401 không refresh trùng.
-   Tích hợp toast:
    -   auto-toast success cho request non-GET (nếu backend trả `message`).
    -   auto-toast error (trừ lỗi “expected” như 400/409).

Điểm cần nói:

-   Token refresh là bài toán thực tế trên mobile do request nhiều + app resume.
-   Queue tránh “bão refresh-token”.

### 3.5 Xử lý API URL cho Android emulator / thiết bị thật

Tại `frontend/src/config/env.ts`:

-   Nếu `EXPO_PUBLIC_API_URL` là `http://localhost:3000/api`:
    -   **Android emulator**: đổi `localhost` → `10.0.2.2`.
    -   Nếu chạy trên thiết bị thật / LAN: lấy IP máy dev từ `expoConfig.hostUri` để thay hostname.

Điểm cần nói:

-   Đây là “pain-point” đa nền tảng: `localhost` trên mobile **không phải localhost máy dev**.

### 3.6 Quản lý trạng thái (Zustand) + Persist

Một số store tiêu biểu:

-   `useUserStore` (persist) – profile.
-   `useCartStore` – cart + chọn item checkout + apply voucher.
-   `useOrderStore` – danh sách đơn + tạo/hủy/reorder.
-   `useNotificationStore` (persist) – danh sách notification, unreadCount.
-   `useToastStore`, `useOverlayStore` – UI overlay.

Điểm cần nói:

-   Zustand nhẹ, ít boilerplate hơn Redux cho đồ án.
-   Persist giúp UX tốt hơn: mở lại app vẫn có profile/notification (tuỳ store).

---

## 4) Luồng chức năng chính (nhìn theo trải nghiệm mobile)

### 4.1 Browse nhà hàng + Favorites

-   Home gọi:
    -   danh sách nhà hàng best seller/recommended
    -   favorites của user
-   Toggle favorite: optimistic update (update UI trước, fail thì rollback).

### 4.2 Cart (giỏ hàng)

-   Fetch cart từ backend.
-   Update quantity, remove item có **confirm dialog**.
-   Cart support “xem chi tiết item” bằng modal.

Ràng buộc nghiệp vụ quan trọng (có cả FE/BE):

-   **Giỏ hàng chỉ chứa món của 1 nhà hàng**.
    -   Backend trả **409** nếu khác nhà hàng.
    -   FE xử lý 409 bằng toast “clear cart để order nhà hàng khác”.

### 4.3 Checkout

-   Confirm order:
    -   bắt buộc có địa chỉ giao hàng.
    -   chọn item checkout (selectedItemIds).
    -   apply voucher theo restaurant.
-   Payment:
    -   chọn payment method (COD/CARD/MOMO/VNPAY/WALLET…)
    -   tạo order → sau đó xoá các items đã checkout khỏi cart.

### 4.4 Orders

-   Fetch orders theo status.
-   Cancel order: set status CANCELLED ở UI sau khi API thành công.
-   Reorder: tạo đơn mới từ đơn cũ.

### 4.5 Notifications

-   Mobile: gọi `/notifications`, mark read, mark all, delete.
-   Store persist để giữ list/unread.

Ghi chú: phần **push token lấy từ thiết bị (Expo Notifications)** chưa thấy được gọi trong UI; backend đã chuẩn bị luồng FCM (xem phần 6.4).

---

## 5) Backend – Kiến trúc & điểm cần nói (đủ để trả lời câu hỏi)

### 5.1 API Gateway

-   Gateway chạy HTTP, prefix `/api`.
-   CORS + ValidationPipe + logging + exception filter.
-   Dùng `ClientsModule.register()` tạo TCP client cho từng microservice.
-   Mỗi controller gateway:
    -   nhận HTTP request
    -   `ClientProxy.send(pattern, payload)`
    -   map lỗi RPC → HttpException tương ứng.

### 5.2 Common auth/roles

Trong `backend/libs/common`:

-   `JwtAuthGuard` (AuthGuard('jwt'))
-   `RolesGuard` đọc metadata `roles`.
-   `CommonModule` global export JwtStrategy/guards.

### 5.3 Microservices pattern

Mỗi service:

-   expose TCP microservice (port `MICROSERVICE_PORT`)
-   có controller với `@MessagePattern(PATTERN)`
-   xử lý business trong service + TypeORM repositories.

### 5.4 Event-driven

Có 2 kiểu event:

-   **EventEmitter2** nội bộ service.
-   **@EventPattern(EVENT)** trong controller để nhận event.

Ví dụ:

-   Payment lắng nghe `ORDER_EVENTS.CREATED` và tự xử lý payment.
-   Notification lắng nghe `ORDER_EVENTS.*`, `PAYMENT_EVENTS.COMPLETED`, `REVIEW_EVENTS.CREATED`.

---

## 6) Backend – Các service chính (nhớ ý + điểm nhấn)

### Auth Service

-   Register/Login.
-   Hash password bằng bcrypt.
-   Issue JWT access/refresh.
-   Forgot/reset password qua OTP (OTP lưu DB dạng hash + expiry).
-   Refresh token: verify JWT refresh + check token hash trong DB.

Điểm cần nói:

-   Lý do cần refresh token trên mobile: giảm thời gian sống access token mà không bắt user login lại.

### User Service

-   `/users/me` (profile)
-   `/users/addresses` (CRUD)
-   `/users/favorites` (favourite restaurants)
-   `/users/devices` (device token cho push)

### Order Service

-   Cart: get/add/update/remove/clear.
-   Business rule: cart 1 restaurant.
-   Create order từ cart items.
-   Status history.
-   Voucher apply (liên quan voucher/voucher_usage).

### Payment Service

-   Wallet + transactions.
-   `processPayment()` dùng **TypeORM QueryRunner transaction**.
-   Refund khi cancel (event-driven).

### Notification Service (DB + FCM)

-   Lưu notification vào DB.
-   Khi tạo notification → emit `NOTIFICATION_EVENTS.SENT`.
-   Listener `FcmListener`:
    -   fetch notification từ DB
    -   lấy device tokens từ bảng `user_devices`
    -   gửi FCM multicast
    -   tự vô hiệu hoá token invalid.

### Các service khác

-   Restaurant: list/filter/menu/categories/options/operating hours.
-   Delivery: driver register/location/status/track.
-   Review: create/reply.
-   Promotion: vouchers/validate.

---

## 7) Database model (đủ để nói khi bị hỏi)

Tài liệu sơ đồ:

-   `backend/docs/erd-diagram.md`
-   `backend/docs/class-diagram.md`

Các entity trung tâm:

-   User ↔ Address/Device/Favorite/Wallet/Cart/Order/Review/Notification
-   Restaurant ↔ MenuCategory/MenuItem/OperatingHours/Order/Review/Voucher
-   Order ↔ OrderItem/Payment/Delivery/Review/StatusHistory

---

## 8) Kịch bản demo nhanh (trên lớp)

### Backend

-   Chạy docker: (tuỳ máy)
    -   vào `backend/` rồi chạy docker compose.
-   API Gateway mặc định: `http://<host>:3000/api`.

### Mobile

-   Chạy Expo: `npm run start` trong `frontend/`.
-   Nếu Android emulator: API URL nên dùng `http://10.0.2.2:3000/api` (đã được tự xử lý trong env resolver nếu để `localhost`).
-   Flow demo gợi ý:
    1. Launch → Welcome
    2. Login
    3. Home → vào 1 restaurant → add to cart
    4. Cart → Confirm order → Payment → Place order
    5. Orders → cancel/reorder
    6. Notifications → fetch/mark read

---

## 9) Bộ câu hỏi vấn đáp “hay gặp” (kèm đáp án gợi ý)

1. **Vì sao chọn React Native + Expo?**

-   1 codebase cho iOS/Android, dev nhanh, phù hợp đồ án.
-   Expo giúp giảm cấu hình native, dễ chạy demo.

2. **Vì sao dùng Expo Router?**

-   File-based routing → tổ chức màn hình rõ, ít boilerplate.
-   Dễ tách nhóm route auth/main/onboarding.

3. **Cách bạn bảo vệ màn hình cần login?**

-   Dựa `useSegments()` trong AuthContext để redirect.
-   verify token bằng gọi `/users/me`.

4. **Xử lý access token hết hạn thế nào?**

-   Axios interceptor bắt 401 → gọi refresh-token.
-   Có queue để tránh nhiều refresh đồng thời.

5. **Vì sao cần xử lý `localhost` khác nhau trên Android emulator?**

-   `localhost` trên emulator là chính emulator.
-   `10.0.2.2` map về máy host.

6. **Zustand dùng để giải quyết gì?**

-   Quản lý state toàn cục (cart, order, profile, notification).
-   Persist một phần state (AsyncStorage) để restore session/UI.

7. **Vì sao backend dùng microservices?**

-   Tách domain (auth/order/payment/…)
-   Dễ mở rộng theo service, giảm coupling.
-   Gateway làm single entry point.

8. **Làm sao đảm bảo nhất quán khi thanh toán?**

-   Payment service dùng transaction (QueryRunner).
-   Nếu lỗi → rollback + set status FAILED.

9. **Notification end-to-end hoạt động ra sao?**

-   Event (order/payment/review) → notification service tạo record DB.
-   Listener gửi FCM (nếu bật FCM).
-   Mobile có API fetch/mark read.

10. **Các rủi ro/điểm có thể bị hỏi thêm**

-   Token revoke/logout: nếu lưu refresh token dạng bcrypt hash, cần so sánh đúng cách (hash lại sẽ không match do salt). Nếu thầy hỏi, giải thích hướng chuẩn: lưu tokenId hoặc hash + compare.
-   Push token mobile: hiện chưa thấy phần lấy Expo push token và gọi `/users/devices` trong UI; có thể nói “backend đã sẵn sàng, phần mobile có thể bổ sung bước xin permission + register token”.

---

## 10) “Ghi nhớ nhanh” đúng yêu cầu môn

-   Điểm mạnh: **mobile routing + auth guard + refresh token + xử lý localhost + state management + UX confirm/toast**.
-   Tránh sa đà backend quá sâu khi vấn đáp (backend là cộng điểm), nhưng vẫn cần nắm: gateway↔microservice, transaction payment, event-driven notifications.
