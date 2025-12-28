# BÁO CÁO ĐỒ ÁN CUỐI KỲ

## ỨNG DỤNG ĐẶT ĐỒ ĂN TRỰC TUYẾN

---

## 1. MỞ ĐẦU

### 1.1. Lý do chọn đề tài

Trong những năm gần đây, sự phát triển mạnh mẽ của công nghệ thông tin cùng với sự phổ biến của điện thoại thông minh đã làm thay đổi đáng kể thói quen sinh hoạt và tiêu dùng của người dân. Đặc biệt, lĩnh vực dịch vụ ăn uống đã có sự chuyển mình rõ rệt khi các ứng dụng đặt đồ ăn trực tuyến ngày càng được sử dụng rộng rãi. Người dùng có thể dễ dàng tìm kiếm nhà hàng, lựa chọn món ăn, thanh toán và theo dõi quá trình giao hàng chỉ với vài thao tác đơn giản.

Xuất phát từ thực tế đó, nhóm quyết định lựa chọn đề tài **“Ứng dụng đặt đồ ăn trực tuyến”** nhằm áp dụng các kiến thức đã học về phát triển ứng dụng di động, thiết kế hệ thống backend và cơ sở dữ liệu. Đề tài không chỉ mang tính thực tiễn cao mà còn giúp sinh viên tiếp cận với các mô hình kiến trúc hiện đại đang được sử dụng phổ biến trong các hệ thống lớn hiện nay.

### 1.2. Mục đích nghiên cứu

Mục đích chính của đề tài là xây dựng một hệ thống đặt đồ ăn trực tuyến hoàn chỉnh, bao gồm ứng dụng di động cho người dùng và hệ thống backend xử lý nghiệp vụ. Thông qua đồ án này, nhóm hướng đến việc:

-   Vận dụng kiến thức về lập trình di động đa nền tảng để xây dựng ứng dụng chạy trên cả Android và iOS.
-   Thiết kế và triển khai hệ thống backend theo kiến trúc microservices nhằm đảm bảo tính mở rộng và dễ bảo trì.
-   Xây dựng các chức năng nghiệp vụ cơ bản của một ứng dụng đặt đồ ăn như quản lý người dùng, nhà hàng, đơn hàng, thanh toán và đánh giá.

### 1.3. Đối tượng và phạm vi nghiên cứu

Đối tượng nghiên cứu của đề tài bao gồm các thành phần chính trong một hệ thống đặt đồ ăn trực tuyến, cụ thể là người dùng (khách hàng), nhà hàng, tài xế giao hàng và hệ thống quản trị.

Phạm vi nghiên cứu của đề tài tập trung vào việc xây dựng ứng dụng di động cho khách hàng và hệ thống backend xử lý nghiệp vụ. Một số chức năng nâng cao như tích hợp cổng thanh toán bên thứ ba hoặc hệ thống quản trị web chưa được triển khai đầy đủ mà chỉ dừng lại ở mức mô phỏng hoặc định hướng phát triển.

---

## 2. CÁC CÔNG NGHỆ SỬ DỤNG

Trong quá trình thực hiện đề tài, nhóm đã lựa chọn và sử dụng các công nghệ phổ biến, phù hợp với yêu cầu của hệ thống, đồng thời đảm bảo khả năng mở rộng và bảo trì trong tương lai.

### 2.1. Công nghệ Backend

Hệ thống backend được xây dựng dựa trên **NestJS**, một framework Node.js hỗ trợ mạnh mẽ cho việc phát triển ứng dụng theo kiến trúc module và microservices. NestJS cho phép tổ chức mã nguồn rõ ràng, dễ quản lý và phù hợp với các hệ thống có quy mô lớn.

Cơ sở dữ liệu chính được sử dụng là **PostgreSQL**, một hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn và hiệu năng cho hệ thống. Việc ánh xạ giữa cơ sở dữ liệu và mã nguồn được thực hiện thông qua **TypeORM**, giúp giảm thiểu thao tác SQL thủ công và hỗ trợ migration dữ liệu.

Ngoài ra, **Redis** được sử dụng để hỗ trợ lưu trữ tạm thời và quản lý session, góp phần cải thiện hiệu năng của hệ thống. Toàn bộ backend được triển khai và quản lý thông qua **Docker**, giúp việc cấu hình môi trường và triển khai trở nên thuận tiện hơn.

### 2.2. Công nghệ Frontend

Ứng dụng di động được phát triển bằng **React Native** kết hợp với **Expo**, cho phép xây dựng ứng dụng đa nền tảng chỉ với một mã nguồn duy nhất. Việc sử dụng Expo giúp đơn giản hóa quá trình cấu hình, build và chạy ứng dụng trên nhiều thiết bị khác nhau.

Quản lý trạng thái của ứng dụng được thực hiện bằng **Zustand**, một thư viện gọn nhẹ nhưng hiệu quả, phù hợp với các ứng dụng có quy mô vừa và nhỏ. Giao tiếp giữa frontend và backend được thực hiện thông qua các API REST sử dụng thư viện **Axios**.

### 2.3. Cách áp dụng công nghệ trong đề tài

Các công nghệ được lựa chọn không chỉ dựa trên tính phổ biến mà còn dựa trên mức độ phù hợp với đề tài. Backend sử dụng kiến trúc microservices để tách biệt các chức năng như xác thực, quản lý người dùng, đơn hàng và thanh toán. Frontend tập trung vào trải nghiệm người dùng, đảm bảo giao diện trực quan, dễ sử dụng và phản hồi nhanh.

---

## 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Phân tích yêu cầu chức năng

Hệ thống cần đáp ứng các yêu cầu chức năng cơ bản của một ứng dụng đặt đồ ăn trực tuyến. Người dùng có thể đăng ký, đăng nhập, tìm kiếm nhà hàng, xem thực đơn, thêm món ăn vào giỏ hàng và tạo đơn đặt hàng. Sau khi đặt hàng, người dùng có thể theo dõi trạng thái đơn hàng và thực hiện đánh giá chất lượng dịch vụ.

Bên cạnh đó, hệ thống cần hỗ trợ quản lý thanh toán thông qua ví điện tử nội bộ, cho phép hoàn tiền khi đơn hàng bị hủy. Các vai trò khác như chủ nhà hàng và tài xế cũng được định nghĩa để phục vụ cho việc mở rộng hệ thống trong tương lai.

### 3.2. Yêu cầu phi chức năng

Ngoài các chức năng nghiệp vụ, hệ thống còn cần đáp ứng các yêu cầu phi chức năng như bảo mật, hiệu năng và khả năng mở rộng. Việc xác thực và phân quyền được thực hiện thông qua JWT nhằm đảm bảo an toàn thông tin người dùng. Hệ thống được thiết kế theo hướng module hóa để có thể dễ dàng mở rộng khi số lượng người dùng tăng lên.

### 3.3. Thiết kế giao diện

Giao diện ứng dụng được thiết kế trên Figma với tiêu chí đơn giản, dễ sử dụng và thân thiện với người dùng. Trong phạm vi báo cáo, nhóm tập trung trình bày các màn hình chính như đăng nhập, danh sách nhà hàng, chi tiết thực đơn, giỏ hàng và theo dõi đơn hàng. Các màn hình này phản ánh rõ luồng nghiệp vụ cốt lõi của hệ thống.

### 3.4. Thiết kế cơ sở dữ liệu

Cơ sở dữ liệu được thiết kế theo mô hình quan hệ, bao gồm các bảng chính như người dùng, nhà hàng, món ăn, đơn hàng, chi tiết đơn hàng và thanh toán. Các bảng được liên kết với nhau thông qua khóa ngoại nhằm đảm bảo tính nhất quán của dữ liệu. Thiết kế này đáp ứng tốt các yêu cầu truy vấn và mở rộng trong tương lai.

---

## 4. KẾT QUẢ THỰC HIỆN

Sau quá trình phân tích và thiết kế, nhóm đã triển khai thành công các chức năng chính của hệ thống.

Về phía backend, các dịch vụ đã được xây dựng đầy đủ để xử lý xác thực, quản lý người dùng, nhà hàng, đơn hàng và thanh toán. Các API hoạt động ổn định và có thể được sử dụng để tích hợp với ứng dụng di động.

Về phía frontend, ứng dụng di động đã hoàn thiện các màn hình cơ bản và cho phép người dùng thực hiện đầy đủ quy trình đặt đồ ăn, từ đăng nhập đến tạo đơn hàng và theo dõi trạng thái. Giao diện ứng dụng hoạt động ổn định trên cả Android và iOS trong môi trường thử nghiệm.

---

## 5. KẾT LUẬN VÀ KHUYẾN NGHỊ

### 5.1. Kết luận

Thông qua đồ án này, nhóm đã xây dựng được một hệ thống đặt đồ ăn trực tuyến ở mức độ hoàn chỉnh, đáp ứng được các yêu cầu cơ bản về chức năng và kỹ thuật. Đề tài giúp nhóm củng cố kiến thức về lập trình di động, thiết kế backend và làm quen với kiến trúc microservices.

### 5.2. Khuyến nghị và hướng phát triển

Trong tương lai, hệ thống có thể được mở rộng bằng cách tích hợp các cổng thanh toán thực tế, bổ sung hệ thống quản trị web cho nhà hàng và quản trị viên, cũng như cải thiện hiệu năng và bảo mật. Ngoài ra, việc áp dụng các công nghệ như WebSocket hoặc bản đồ số sẽ giúp nâng cao trải nghiệm người dùng và tính thực tiễn của ứng dụng.

---

**KẾT THÚC BÁO CÁO**
