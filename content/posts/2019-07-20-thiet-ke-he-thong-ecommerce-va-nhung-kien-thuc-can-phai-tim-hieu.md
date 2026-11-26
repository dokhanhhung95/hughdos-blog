---
title: "Thiết kế hệ thống Ecommerce"
date: 2019-07-20
category: design
tags: ["chia sẻ", "Design"]
cover: /images/2019/07/0561b-1ozil58jfxpy_rqflqtqckq.webp
wp_url: /2019/07/20/thiet-ke-he-thong-ecommerce-va-nhung-kien-thuc-can-phai-tim-hieu/
---

*Trước đây khi nghe đến từ Ecommerce — Thương mại điện tử, trong đầu mình chỉ có đúng một định nghĩa, đó là trang web bán hàng. Thiết kế thương mại điện tử tốt là phải đẹp, dễ dùng, thuận tiện cho người mua. Sau này đi làm mới biết, cuộc sống không hề đơn giản như vậy…*

## Từ một giao diện đẹp…

Một phần không thể thiếu của hệ thống thương mại điện tử đó là giao diện website bán hàng. Nếu bạn đã từng thực hiện mua hàng trên website thì sẽ biết, đó là một dạng cửa hàng online:

<figure>
  <img src="/images/2019/07/ff90d-0ctwdpze8tlid25lj.webp" alt="Một ví dụ về trang web Ecommerce" loading="lazy">
  <figcaption>Một ví dụ về trang web Ecommerce</figcaption>
</figure>

Khung xương của website này bao gồm các trang chính như sau:

- Trang chủ
- Đăng ký / Đăng nhập
- Danh sách sản phẩm
- Chi tiết sản phẩm
- Danh sách bài viết
- Chi tiết bài viết
- Trang kết quả tìm kiếm
- Thông tin tài khoản
- Các trang nội dung: Contact, About Us, Policy…
- Giỏ hàng
- Thanh toán

Thông tin hiển thị lên website này là những gì customer (khách mua hàng) nhìn thấy. Đây là nơi họ thực hiện những hành động: Xem hàng, mua hàng, thanh toán…

Nhưng hệ thống Ecommerce không chỉ có như vậy.

---

## … đến cả một cỗ máy vận hành cồng kềnh

*(Mình hay gọi nôm na phần này là phần backend, còn website bán hàng kia là giao diện frontend, không biết có đúng không nhưng kệ vậy)*

Để có được những thông tin hiển thị lên website trên kia, và để hành động mua hàng của customer diễn ra trơn tru, merchant (người bán hàng) phải làm việc với một hệ thống vận hành vô cùng phức tạp. Bản thân mình cũng chưa hiểu hết được các luồng nghiệp vụ, nhưng mình sẽ viết ra những gì **cần phải biết**để dần dần dành thời gian tìm hiểu kỹ hơn.

Quản lý hệ thống Ecommerce có nghĩa là bạn phải quản lý tất cả những thứ sau đây:

- **Products** (Sản phẩm)
- **Orders** (Đơn hàng)
- **Customers** (Khách hàng)
- **Report / Analysis**(Báo cáo / Phân tích)
- **Payment method** (Phương thức thanh toán)
- **Shipping method** (Phương thức vận chuyển)
- **Store locations** (Địa chỉ cửa hàng)
- **Web builder** (Xây dựng nội dung web)

<figure>
  <img src="/images/2019/07/25eba-1wwgwlpooskbfv8n9nqgxiq.webp" alt="Ví dụ một giao diện quản lý hệ thống với nền tảng Shopify" loading="lazy">
  <figcaption>Ví dụ một giao diện quản lý hệ thống với nền tảng Shopify</figcaption>
</figure>

---

### 1. Sản phẩm

Để có được đầu ra là hình ảnh sản phẩm kèm theo thông tin chi tiết bán trên website, merchant cần phải:

**a. Nhập hàng & kiểm hàng**

Quản lý kho (Inventory Management) là một phần của Quản lý chuỗi cung ứng (Supply Chain Management). Hàng nhập về làm thay đổi số lượng trong kho. Kiểm hàng để biết tình trạng số lượng còn lại bao nhiêu, từ đó lên kế hoạch bán/ngừng bán hay nhập thêm hàng.

Một số tình huống:

- *Chuyển một số lượng sản phẩm từ kho 1 sang kho 2, tổng số lượng cả hai kho không đổi. Nên quản lý theo từng kho riêng hay quản lý gộp cả hai?*
- *Sản phẩm trong kho 1 đã hết, có cho phép tiếp tục bán trên website bằng cách lấy ở kho 2 bù vào hay không?*
- *Cùng một sản phẩm có hai phiên bản màu sắc, trong đó một phiên bản hết hàng, một phiên bản còn hàng. Hệ thống nên hiểu đây là hai sản phẩm hay một sản phẩm có hai variants thì tốt và dễ quản lý hơn?*
- *(…)*

**b. Thêm sản phẩm vào kho**

Các bạn đã mua hàng online đều thấy, một sản phẩm có rất nhiều thông tin chi tiết đi kèm: Tên, giá, nhà cung cấp, mô tả… Tất cả những cái đó đều phải thêm từ khi đưa sản phẩm vào kho. Cụ thể, các thông tin về sản phẩm bao gồm:

- Tên sản phẩm
- Nội dung mô tả chi tiết
- Đoạn mô tả ngắn
- Ảnh sản phẩm
- Giá sản phẩm
- Mã sản phẩm (SKU)
- Số lượng sản phẩm nhập vào kho
- Nhà cung cấp
- Khối lượng sản phẩm (hoặc thể tích — phục vụ vận chuyển)
- Phiên bản sản phẩm & ảnh phiên bản sản phẩm

Bên cạnh đó, merchant còn có nhu cầu gom những mặt hàng cùng loại vào thành một Collection (bộ sưu tập, hoặc danh mục sản phẩm). Hệ thống phải đáp ứng:

- Thêm sản phẩm vào danh mục một cách thủ công (Chọn sản phẩm rồi đưa vào danh mục)
- Thêm sản phẩm vào danh mục một cách tự động (danh mục thông minh — bằng cách lọc những thông tin mô tả để sắp xếp vào danh mục có điều kiện đã xác định sẵn, ví dụ: Danh mục “Các sản phẩm của Apple” — có chung nhà cung cấp là Apple,…)

### 2. Đơn hàng

Nhiệm vụ tiếp theo của hệ thống phải kể đến quản lý đơn hàng. Khi customer kết thúc quá trình checkout, một đơn hàng sẽ được sinh ra, từ đó merchant mới lên kế hoạch gói hàng, ship hàng, thu phí …

Trong một đơn hàng cần có những thông tin sau:

- Thông tin đầy đủ của khách hàng (Tên, liên lạc, địa chỉ nhận hàng…)
- Danh sách sản phẩm đã order + giá của chúng
- Giá vận chuyển
- Áp dụng chương trình khuyến mãi: Có / Không
- Hình thức thanh toán
- Trạng thái đơn hàng

Trong đó theo mình phần cần chú ý là Trạng thái đơn hàng. Hệ thống phải phân chia theo logic hợp lý để merchant có thể tracking tình trạng hiện tại của đơn hàng đang như thế nào. Ví dụ: *Đơn đã thanh toán chưa, đã vận chuyển chưa, khách hàng không nhận thì đơn bị hoàn lại, khách hàng nhận thì đơn hoàn thành. Nếu đơn COD thì khi shipper trả lại tiền cho shop thì mới tính là hoàn thành…*

Tuy nhiên không phải cứ checkout trên web xong là có một đơn hàng chính thức. Sẽ có tình huống khách gọi điện thoại và muốn thay đổi địa chỉ nhận, thay đổi sản phẩm mua trong đơn… Vì thế cần phải có chức năng chỉnh sửa đơn hàng. Cần cân nhắc khi đã chốt đơn thì có thể thay đổi nữa hay không? Nếu không thì làm cách nào để xử lý? (Mình xử lý bằng cách tạo đơn mới, đánh dấu đơn cũ không thành công và hoàn trả lại hàng vào kho).

### 3. Khách hàng

Những customer đã mua hàng, hoặc để lại thông tin cần tư vấn sẽ tạo ra nguồn data vô cùng quý giá, có thể phục vụ mục đích marketing, tăng chỉ số Retention, và nhiều hơn thế. Vì vậy merchant sẽ cần nơi lưu trữ những data này.

Thông tin khách hàng cần có:

- Họ tên
- Thông tin liên lạc
- Ngày sinh (có thể dùng để chúc mừng, sale-off nhân dịp sinh nhật)
- Địa chỉ
- Tổng số đơn hàng & Tổng chi tiêu
- Đơn hàng mới nhất
- Thiết lập tài khoản cho khách hàng đăng nhập vào website
- ...

### 4. Báo cáo / Phân tích

Khi đã kinh doanh được một khoảng thời gian nhất định, merchant sẽ có nhu cầu cập nhật chỉ số kinh doanh theo thời gian, qua đó đánh giá tình hình và điều chỉnh hướng, mục tiêu và hình thức tiếp cận sao cho phù hợp.

Cơ bản nhất, merchant cần có báo cáo về:

- Doanh số bán hàng (Theo tháng, ngày, giờ, sản phẩm, kênh quảng cáo, nhà cung cấp…)
- Số lượng khách hàng mới (Trong một khoảng thời gian)
- Top sản phẩm bán chạy (Trong một khoảng thời gian)
- Và các chỉ số nâng cao khác: Tỉ lệ chuyển đổi, hàng hóa nhập, giá trị trung bình của một đơn hàng, nhóm khách hàng theo khu vực, tỉ lệ thiết bị mua hàng (mobile, tablet, desktop)… dùng để phân tích chuyên sâu hơn.

### 5. Phương thức thanh toán

Là một trong những phần xương sống của bộ máy Ecommerce. Tất cả những gì bạn làm đều đặt mục tiêu: khiến khách hàng thanh toán. Vì vậy không có lý do gì để không đầu tư và làm cho việc thanh toán trở nên thuận tiện hơn.

Thông thường sẽ có hai phương thức thanh toán: **COD** (Cash on delivery) và **Chuyển khoản.**

COD thì dễ rồi, shipper chuyển hàng đến rồi cầm tiền đem về.

Còn chuyển khoản, merchant sẽ cần phải ứng soát xem thông tin chuyển khoản có chính xác hay không trước khi xác nhận đơn hàng đã thanh toán. Cách tốt nhất và đỡ mất công ứng soát nhất là tích hợp các cổng thanh toán trực tuyến vào hệ thống. Có thể kể đến: VNPay, VTCPay, Napas, Paypal…

> Cổng trung gian thanh toán là 1 hình thức bảo vệ merchant và customer. Tiền chuyển khoản của customer đến trung gian thanh toán (TGTT) sẽ được giam tại đó 1 thời gian nhất định. Merchant biết là customer đã chuyển tiền rồi nhưng chưa được nhận tiền, vì phải gửi hàng cho customer đã. Khi customer nhận được hàng, xác nhận lại thì bên TGTT mới trả lại số tiền đó cho bên bán.

Tuy nhiên khi tích hợp, cũng sẽ phát sinh một luồng nghiệp vụ kế toán. Còn luồng ra sao, mình cũng chưa được làm nên không biết. Mình sẽ tìm hiểu thêm và bổ sung vào bài trong thời gian tới.

*Một con số thống kê: **93% người mua hàng trực tuyến** tại **Việt Nam** sử dụng phương thức thanh toán COD (tháng 2/2019 theo báo cáo của Hiệp hội TMDT Việt Nam - VECOM)*

### 6. Phương thức vận chuyển

Cũng là một phần quan trọng không kém gì phương thức thanh toán. Thông thường merchant sẽ ký hợp đồng với các đơn vị vận chuyển, hoặc nếu có shipper in-house thì sẽ quản lý bằng cách khác.

Trường hợp shipper in-house, merchant cần:

- Quản lý khu vực ship hàng (quận huyện, tỉnh thành, bán kính bao nhiêu km quanh cửa hàng…)
- Giá ship hàng cho mỗi khu vực
- Giá ship hàng cho mỗi nấc khối lượng hàng hóa (hoặc nấc thể tích)
- Trạng thái đơn hàng đang ship

Trường hợp liên kết với các đơn vị vận chuyển, merchant chỉ cần thanh toán phí ship, bên vận chuyển sẽ lo phần còn lại. Các nền tảng Ecommerce bây giờ thường tích hợp API vận chuyển vào luôn cho tiện theo dõi. Các đơn vị vận chuyển có thể kể đến: DHL, GHN, Viettel Post, EMS, …

### 7. Địa chỉ cửa hàng

Trường hợp merchant có nhiều cửa hàng, chi nhánh, việc cập nhật địa chỉ và chọn đâu là kho hàng chính sẽ giúp cho các đơn vị vận chuyển có thể dễ dàng xác định địa điểm lấy hàng; nhà cung cấp có thể xác định địa chỉ giao hàng.

Thông tin cần thiết:

- Họ tên người đại diện kho hàng
- Thông tin liên hệ
- Địa chỉ cụ thể

### 8. Web Builder

Đây chính là sợi dây kết nối Backend và Frontend. Nếu bạn thắc mắc, làm thế nào để thay đổi danh sách sản phẩm khuyến mãi trên website; làm thế nào để thay một chiếc banner khác vào trang chủ… Thì Web Builder chính là câu trả lời.

<figure>
  <img src="/images/2019/07/31c5c-10tiqqsebhpsy8e2mhm_nsq.webp" alt="Giao diện web builder của Shopify" loading="lazy">
  <figcaption>Giao diện web builder của Shopify</figcaption>
</figure>

Web builder là một công cụ giúp merchant thay đổi cách thức hiển thị nội dung của website. Công cụ sẽ lấy dữ liệu mà merchant đã thêm vào backend để hiển thị lên frontend, sắp xếp chúng theo nhiều cách sao cho đẹp nhất.

Nói đúng hơn thì, đây là công cụ giúp merchant design (thiết kế) và customize (tùy chỉnh) web bán hàng tùy theo ý của họ.

Có vô vàn thứ có thể customize, tùy thuộc nền tảng mà merchant chọn để sử dụng. Nhưng tối thiểu phải đáp ứng được các tùy chỉnh về:

- Logo, fav icon
- Banner
- Lựa chọn sản phẩm hiển thị
- Navigation (Menu điều hướng)
- Header + Footer
- Màu sắc chủ đề, font chữ
- Thông tin liên hệ

---

## Rồi cả luồng nghiệp vụ mua bán - giao vận

Nghiệp vụ xuất nhập kho, mua bán, vận chuyển hàng hóa là kiến thức bắt buộc phải có nếu như bạn muốn làm sản phẩm giúp giải quyết vấn đề của user. ***"Get to know your user to make a perfect product"***

<figure>
  <img src="https://cdn-images-1.medium.com/max/1600/0*OjrSJipbcrRZ1g2N" alt="Luồng nghiệp vụ bán hàng của một hệ thống Ecommerce" loading="lazy">
  <figcaption>Luồng nghiệp vụ bán hàng của một hệ thống Ecommerce</figcaption>
</figure>

<figure>
  <img src="/images/2019/07/b2732-1z4_5dnljeeymnyycegtyrw.webp" alt="Luồng mua bán hàng hóa" loading="lazy">
  <figcaption>Luồng mua bán hàng hóa</figcaption>
</figure>

<figure>
  <img src="https://cdn-images-1.medium.com/max/1600/0*9TfJrTdiJLR0NKyV" alt="Luồng vận chuyển hàng hóa" loading="lazy">
  <figcaption>Luồng vận chuyển hàng hóa</figcaption>
</figure>

---

Cảm ơn bạn đã đọc đến dòng này.
