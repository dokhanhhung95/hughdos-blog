---
title: AI vẽ được UI rồi, vậy Designer còn làm gì?
date: 2026-11-27T23:45
category: design
tags:
  - design
  - UXUI
  - AI
cover: ''
excerpt: ''
draft: false
archived: false
---

chu có thể ngốn của Designer cả buổi sáng. Giờ thì vài dòng prompt là đủ: AI gợi ý luồng người dùng, phối màu, đẻ ra hàng loạt phương án UI, thậm chí xuất thẳng ra code chạy được, tất cả trong vài chục giây.

Vậy nên câu hỏi "Designer có bị thay thế không?" là hoàn toàn chính đáng. Kỷ nguyên của "thợ vẽ giao diện" (pixel pusher) đang khép lại. Khi một giao diện "đẹp và đúng chuẩn" không còn là lợi thế độc quyền, giá trị của Designer dịch chuyển sang 4 năng lực mà AI chưa với tới.

## 1. Thấu cảm và đọc vị bối cảnh

AI tổng hợp dữ liệu từ hàng triệu sản phẩm có sẵn để đưa ra phương án "hợp lý nhất về mặt xác suất". Nhưng nó không ngồi cạnh người dùng, không thấy họ ngập ngừng, không nghe họ thở dài.

Lấy ví dụ app ngân hàng số cho khách hàng lớn tuổi. AI sẽ đề xuất cỡ chữ to, độ tương phản cao, đúng chuẩn accessibility. Nhưng chỉ khi ngồi xem họ chuyển khoản, Designer mới thấy điều thật sự cản trở họ: nỗi sợ gõ nhầm số tài khoản là mất tiền, khiến họ chần chừ mãi ở màn hình xác nhận. Lời giải không nằm ở cỡ chữ, mà ở cách hiển thị và câu chữ (UX Writing): hiện rõ tên người nhận để họ đối chiếu, ghi số tiền bằng chữ, và nói bằng giọng trấn an thay vì giọng cảnh báo.

AI trả lời tốt câu hỏi _"Người dùng thường làm gì?"_. Còn _"Tại sao họ lại cảm thấy như vậy?"_ vẫn là câu hỏi của con người.

## 2. Tư duy sản phẩm và trách nhiệm đánh đổi

Thiết kế chưa bao giờ chỉ là bài toán làm cho đẹp. Đó là việc cân bằng liên tục giữa ba thứ: nhu cầu người dùng, mục tiêu kinh doanh và giới hạn kỹ thuật.

Một tình huống quen thuộc ở ngân hàng số: team muốn tăng tỷ lệ mở tài khoản online nên đề xuất rút gọn luồng eKYC, bớt một bước chụp giấy tờ hay quét khuôn mặt. Tỷ lệ hoàn thành sẽ đẹp ngay, nhưng rủi ro tài khoản giả, tài khoản bị mua bán để lừa đảo cũng tăng theo, chưa kể có những bước là quy định bắt buộc. AI có thể liệt kê các phương án kèm ưu nhược điểm rất gọn gàng. Thậm chí nó còn tóm tắt buổi họp hay hơn cả người ghi biên bản.

Nhưng AI không **chịu trách nhiệm** cho quyết định. Người chọn phương án, đứng ra bảo vệ nó trước PM, kỹ sư và đội quản trị rủi ro, rồi nhận phần sai nếu số liệu xấu đi, vẫn là Designer. Đặt đúng vấn đề, nhìn ra bức tranh tổng thể và dám quyết một đánh đổi: đó mới là tầm vóc của một Designer giỏi.

## 3. Gu thẩm mỹ và bản sắc

Một nghịch lý của thời AI: càng nhiều sản phẩm được AI thiết kế, thị trường càng dễ chìm vào "biển giao diện na ná nhau" (The Sea of Sameness). AI học từ mức trung bình cộng của quá khứ, nên thứ nó tạo ra thường dừng ở "an toàn" và "trung bình khá".

Thử hình dung màn hình chuyển khoản thành công. Hỏi AI, gần như chắc chắn sẽ nhận về một dấu tích xanh, số tiền và nút "Về trang chủ": đúng, đủ, và giống hệt mọi app khác.

Một lời giải đáng giá hơn: thêm một lớp vân chìm ẩn trên nền, kiểu hoa văn trên tờ tiền. Nhìn qua chỉ thấy một nền đẹp, có chiều sâu. Nhưng nó còn làm một việc khác: khiến ảnh chụp biên lai rất khó bị photoshop sửa số tiền, một chiêu lừa quen thuộc khi người ta gửi ảnh "đã chuyển khoản" cho nhau. Một chi tiết vừa là thẩm mỹ, vừa là bảo mật, vừa mang dấu ấn thương hiệu. Một mô hình tối ưu cho "phương án hợp lý nhất" rất khó tự nghĩ ra lời giải như vậy, vì nó đòi hỏi hiểu cùng lúc cả người dùng, kẻ gian lẫn bản sắc sản phẩm.

Khi AI có thể đẻ ra mười phương án trong một phút, kỹ năng quan trọng không còn là vẽ ra phương án thứ mười một. Nó là biết chọn đúng một, biết vì sao chín cái kia không ổn, và dám phá một quy tắc cũ khi có lý do. Đó là bản sắc.

## 4. Dẫn dắt AI

Nếu gu là biết cái gì đúng, thì dẫn dắt AI là biết cách khiến nó làm ra cái đúng đó. AI không tự biết thế nào là một trải nghiệm tốt. Nó chỉ giỏi đúng bằng đề bài nó nhận được.

**Đặt đề bài chuẩn xác.** So sánh hai prompt cho cùng một màn hình:

| Prompt mơ hồ | Prompt có ràng buộc |
| --- | --- |
| "Thiết kế màn hình chuyển tiền hiện đại, dễ dùng." | "Màn hình chuyển tiền cho người trên 60 tuổi. Mỗi bước chỉ một hành động chính. Bước xác nhận phải hiển thị tên người nhận, số tiền bằng chữ, và nói rõ có thể huỷ. Dùng component từ design system hiện có." |

Prompt bên trái cho ra một màn hình "đẹp" bất kỳ. Prompt bên phải cho ra một màn hình giải quyết đúng nỗi sợ ở phần 1. Việc biến yêu cầu mơ hồ của khách hàng thành những ràng buộc như vậy chính là thiết kế.

**Phản biện và kiểm duyệt.** Đọc output của AI như đọc bài của một bạn junior rất nhanh tay nhưng hay ẩu: tìm lỗi logic trong luồng, chỗ thiếu accessibility, và những "bẫy trải nghiệm" (dark pattern) nó vô tình học theo từ dữ liệu.

**Kiểm chứng với người thật.** Phương án AI đưa ra nhanh đến đâu cũng chỉ là giả thuyết. Nhờ AI tiết kiệm thời gian vẽ, Designer có thời gian đem nó đi test với người dùng sớm hơn và nhiều vòng hơn.

## Lời kết

AI không lấy đi công việc của Designer. Nó lấy đi phần việc lặp đi lặp lại, và đẩy tiêu chuẩn của nghề lên cao hơn.

Đừng chạy đua với máy về tốc độ vẽ màn hình hay kéo thả component. Hãy để AI làm trợ lý thực thi siêu tốc, còn mình dành thời gian cho ba việc không thuật toán nào làm thay được: hiểu sâu con người, giải đúng bài toán kinh doanh, và thổi hồn vào sản phẩm.
