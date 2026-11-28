---
title: 'Dùng AI hiệu quả trong thiết kế: đừng coi nó là máy bán hàng tự động'
date: 2026-08-21T00:24
category: design
tags:
  - AI
  - UXUI
  - design
cover: ''
excerpt: ''
draft: false
archived: false
---

Một kịch bản rất quen của nhiều Designer khi mới thử dùng AI: mở công cụ lên, gõ lệnh thiết kế màn hình Trang chủ hay luồng chuyển tiền cho app ngân hàng, chờ mười lăm giây và nhận về một bản UI bóng bẩy: thẻ đen ánh kim, biểu đồ phát sáng mượt mà. Mừng thầm định bê vào dự án, nhưng nhìn kỹ lại: không khớp Design System, số dư toàn để "$12,450.00", thiếu sạch các trạng thái lỗi và chẳng ăn nhập gì với luồng nghiệp vụ hiện tại. Cuối cùng vẫn phải xóa đi vẽ lại từ đầu, rồi chép miệng: "AI chỉ làm màu cho đẹp thôi."

Vấn đề không nằm ở việc AI yếu. Vấn đề là chúng ta đang dùng AI như một cái máy bán hàng tự động: thả một câu prompt vào và đòi nó nhả ra thành phẩm đem đi code ngay.

[Ở bài trước](https://hughdo.com/2026/07/30/ai-v%E1%BA%BD-%C4%91%C6%B0%E1%BB%A3c-ui-r%E1%BB%93i-v%E1%BA%ADy-designer-c%C3%B2n-l%C3%A0m-g%C3%AC/), mình đã nói về _vì sao_ Designer vẫn còn chỗ đứng khi AI đã biết vẽ UI. Bài này nói về _làm thế nào_: với những sản phẩm đặc thù và nhiều ràng buộc như app ngân hàng, AI chỉ thực sự phát huy sức mạnh khi được đặt vào đúng 4 điểm chạm trong quy trình thiết kế.

## 1. Bắt AI đi "vét" góc khuất, đừng chỉ bắt nó vẽ đường đẹp

Designer nào cũng thích vẽ happy path: kịch bản lý tưởng khi mạng khỏe, tài khoản dư dả, mã OTP về trong ba giây và tiền đi cái rụp. Nhưng thứ ngốn nhiều thời gian nhất khi làm app ngân hàng lại nằm ở edge case (các trường hợp ngoại lệ):

- Mất mạng đúng lúc bấm xác nhận, giao dịch rơi vào trạng thái "đang xử lý" (pending).
- Khách chuyển vượt hạn mức ngày, hoặc ngân hàng thụ hưởng đang bảo trì.
- Giao dịch trên 10 triệu nhưng tài khoản chưa xác thực sinh trắc học.
- Khó hơn nữa: từng lệnh đều nhỏ, nhưng cộng dồn trong ngày vượt 20 triệu. Khách không hiểu vì sao lệnh thứ ba bỗng dưng bị đòi quét mặt, trong khi hai lệnh trước thì không.

Trước khi mở Figma, hãy mô tả luồng tính năng bạn định làm (ví dụ: mở sổ tiết kiệm online hoặc chuyển tiền liên ngân hàng) và giao cho AI đúng một việc: phá nó đi. Yêu cầu AI liệt kê toàn bộ tình huống lỗi, trạng thái chờ, và những điểm người dùng dễ hoang mang nhất.

Thay vì mất nửa ngày tự ngồi rà rồi vẫn sót, để đến lúc Dev hay đội Nghiệp vụ hỏi mới cuống cuồng vẽ bù, bạn có ngay một danh sách kiểm tra khá đầy đủ chỉ sau vài phút. AI giúp bạn nhìn thấy hết ổ gà trên đường trước khi bắt đầu lăn bánh.

## 2. Nói chuyện bằng "ràng buộc", đừng nói bằng "tính từ"

Designer rất ghét khi nhận góp ý kiểu "làm sao cho trông sang trọng, hiện đại và đáng tin cậy hơn". Trớ trêu là khi làm việc với AI, chính chúng ta lại hay gõ y hệt những tính từ mơ hồ đó. Như bài trước đã nói, AI chỉ giỏi đúng bằng đề bài nó nhận được. Hai thứ làm đề bài chặt lại:

**Ràng buộc hệ thống.** Đưa thẳng các quy tắc cơ bản của Design System (hệ màu thương hiệu, cấu trúc component, khoảng cách) làm ngữ cảnh, thay vì để AI tự sáng tác một phong cách xa lạ.

**Dữ liệu sát thực tế.** Bỏ Lorem Ipsum hay mấy con số kiểu "$50" gọn gàng. Một màn hình xác nhận chuyển tiền trông rất thoáng khi để tên "John Doe", nhưng sẽ vỡ vụn ngay khi gặp thực tế Việt Nam: người nhận là "CÔNG TY TNHH MTV THƯƠNG MẠI VÀ DỊCH VỤ...", số tiền là "1.250.500.000 VNĐ", kèm nội dung chuyển khoản dài ba dòng. Hãy bắt AI sinh luôn bộ dữ liệu tiếng Việt giả lập nhưng sát thực tế nhất (từ siêu ngắn đến siêu dài) để đổ thẳng vào thiết kế.

Ràng buộc càng chặt, phương án AI trả về càng ít "ảo" và càng gần với thứ đội kỹ thuật có thể đưa lên production.

> **Một lưu ý sống còn:** làm sản phẩm tài chính thì chỉ dùng công cụ AI đã được công ty phê duyệt. Không đưa dữ liệu khách hàng thật, ảnh chụp màn hình hay tài liệu nội bộ chưa công bố vào công cụ bên ngoài.

## 3. Biến AI thành người phản biện trước giờ họp

Một cách dùng AI rất hiệu quả nhưng hay bị bỏ qua: dùng nó để tự soi lỗ hổng của chính mình trước khi bước vào buổi Design Review với PM, Dev và đội Rủi ro. Giới bảo mật gọi vai trò này là "đội đỏ" (red team): người được giao nhiệm vụ tấn công chính hệ thống của mình.

Khi đã có bản nháp luồng thiết kế, hãy đưa cho AI và yêu cầu nó đóng vai:

**Một kỹ sư Backend khó tính:**

> Hãy soi xem màn hình xác nhận chuyển tiền này đang thiếu trạng thái loading, xử lý lỗi timeout hay ràng buộc dữ liệu nào? Nếu giao dịch bị treo, nút bấm hiển thị thế nào để khách không bấm chuyển lại lần hai?

**Một khách hàng đang vội thanh toán ở quầy thu ngân:**

> Nhìn vào màn hình quét QR này trong 5 giây, tên người nhận, số tiền và tài khoản nguồn có rõ ràng không? Có câu chữ hay nút bấm nào khiến bạn khựng lại hoặc dễ bấm nhầm không?

AI không thể thay thế một buổi họp thật với đồng đội hay một phiên test với người dùng thật. Nhưng nó là một người phản biện sẵn sàng 24/7 mà không sợ mất lòng. Tự vá trước phần lớn lỗ hổng trong im lặng bao giờ cũng dễ chịu hơn là bị hỏi vặn giữa phòng họp.

## 4. Dựng bản "chạy thật" để test sớm, thay vì vất vả nối dây Figma prototype

Có những tương tác trên app ngân hàng mà prototype tĩnh trong Figma gần như không thể diễn tả đúng: cảm giác nhập số tiền (tự động nhảy dấu chấm phân cách hàng nghìn, hiện số tiền bằng chữ, gợi ý nhanh mệnh giá), lọc lịch sử giao dịch theo từ khóa và khoảng thời gian, hay đổi tài khoản nguồn ngay trong lúc thanh toán. Để mô phỏng tạm mấy thứ đó trên Figma, Designer đôi khi phải nhân bản vài chục khung hình và nối một mạng nhện dây chằng chịt, tốn cả buổi chiều mà người test vẫn thấy sượng.

Đây là lúc nên tận dụng khả năng viết code của AI. Chỉ cần đưa wireframe kèm mô tả logic tương tác, AI có thể dựng ra một bản prototype chạy thật trên trình duyệt (HTML/React) trong chưa tới một buổi.

Khi đưa cho người dùng hoặc PM một bản nháp mà họ có thể tự gõ số tiền, tự lọc sao kê, tự bấm thật tay, chất lượng phản hồi nhận về sẽ khác hoàn toàn so với việc ngồi xem slide tĩnh. Sai ở đâu, sửa ngay bằng vài dòng lệnh, không tiếc công.

Chỉ cần nhớ: đây là bản dùng để test rồi bỏ, không phải code để đưa lên production. Phần đó vẫn là việc của đội kỹ thuật, với đầy đủ quy trình bảo mật và kiểm thử.

## Lời kết

AI thực chất là một bộ khuếch đại. Nếu quy trình làm việc đang lỏng lẻo và tư duy nghiệp vụ còn mơ hồ, đưa AI vào chỉ giúp bạn tạo ra những bản thiết kế sai với tốc độ nhanh hơn.

Đừng cố ép AI làm thay phần "chốt hạ" ở phút cuối. Hãy dùng nó để vét sạch góc khuất lúc mở đầu, phản biện logic ở đoạn giữa, và dựng bản chạy thử thật nhanh để kiểm chứng. Khi đặt đúng chỗ, AI không còn là món đồ chơi làm màu, mà trở thành đòn bẩy thực sự giúp Designer làm ra những sản phẩm tài chính chắc tay và an toàn hơn hẳn.
