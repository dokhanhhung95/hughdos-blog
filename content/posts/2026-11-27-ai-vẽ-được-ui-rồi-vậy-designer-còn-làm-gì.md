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

Chỉ vài năm trước, dựng một bộ wireframe hoàn chỉnh hay một màn hình onboarding chỉn chu có thể ngốn của Designer cả buổi sáng. Giờ thì vài dòng prompt là đủ: AI gợi ý luồng người dùng, phối màu, đẻ ra hàng loạt phương án UI, thậm chí xuất thẳng ra code chạy được, tất cả trong vài chục giây.

Vậy nên câu hỏi "Designer có bị thay thế không?" là hoàn toàn chính đáng. Kỷ nguyên của "thợ vẽ giao diện" (pixel pusher) đang khép lại. Khi một giao diện "đẹp và đúng chuẩn" không còn là lợi thế độc quyền, giá trị của Designer dịch chuyển sang 4 năng lực mà AI chưa với tới.

## Thấu cảm và đọc vị bối cảnh

AI tổng hợp dữ liệu từ hàng triệu sản phẩm có sẵn để đưa ra phương án "hợp lý nhất về mặt xác suất". Nhưng nó không ngồi cạnh người dùng, không thấy họ ngập ngừng, không nghe họ thở dài.

Lấy ví dụ một ứng dụng tài chính cho người lớn tuổi. AI sẽ đề xuất cỡ chữ to, độ tương phản cao, đúng chuẩn accessibility. Nhưng chỉ khi ngồi quan sát họ thao tác, Designer mới thấy điều thật sự cản trở họ: nỗi sợ bấm nhầm là mất tiền, khiến họ chần chừ mãi ở bước xác nhận. Lời giải không nằm ở cỡ chữ, mà ở câu chữ (UX Writing): viết lại sao cho gần gũi, trấn an, nói rõ "bạn vẫn có thể huỷ giao dịch".

AI trả lời tốt câu hỏi _"Người dùng thường làm gì?"_. Còn _"Tại sao họ lại cảm thấy như vậy?"_ vẫn là câu hỏi của con người.

## Tư duy sản phẩm và trách nhiệm đánh đổi

Thiết kế chưa bao giờ chỉ là bài toán làm cho đẹp. Đó là việc cân bằng liên tục giữa ba thứ: nhu cầu người dùng, mục tiêu kinh doanh và giới hạn kỹ thuật.

Một tình huống quen thuộc: team muốn tăng tỷ lệ đăng ký nên đề xuất bỏ bước xác minh email. Số đăng ký sẽ đẹp ngay, nhưng tài khoản rác và lỗi quên mật khẩu cũng tăng theo, và đội CSKH sẽ là người gánh. AI có thể liệt kê cả hai phương án kèm ưu nhược điểm rất gọn gàng. Thậm chí nó còn tóm tắt buổi họp hay hơn cả người ghi biên bản.

Nhưng AI không **chịu trách nhiệm** cho quyết định. Người chọn phương án, đứng ra bảo vệ nó trước PM và kỹ sư, rồi nhận phần sai nếu số liệu xấu đi, vẫn là Designer. Đặt đúng vấn đề, nhìn ra bức tranh tổng thể và dám quyết một đánh đổi: đó mới là tầm vóc của một Designer giỏi.

## Gu thẩm mỹ và bản sắc

Một nghịch lý của thời AI: càng nhiều sản phẩm được AI thiết kế, thị trường càng dễ chìm vào "biển giao diện na ná nhau" (The Sea of Sameness). AI học từ mức trung bình cộng của quá khứ, nên thứ nó tạo ra thường dừng ở "an toàn" và "trung bình khá".

Nhớ lại hiệu ứng nảy ngược khi cuộn quá cuối danh sách trên chiếc iPhone đầu tiên. Về chức năng, không ai cần nó: chỉ cần danh sách dừng lại là đủ. Nhưng cú nảy nhỏ đó khiến màn hình có cảm giác như vật thật, và trở thành một phần cá tính của iOS. Một mô hình tối ưu cho "phương án hợp lý nhất" rất khó tự nghĩ ra một chi tiết "thừa" như vậy.

Khi AI có thể đẻ ra mười phương án trong một phút, kỹ năng quan trọng không còn là vẽ ra phương án thứ mười một. Nó là biết chọn đúng một, biết vì sao chín cái kia không ổn, và dám phá một quy tắc cũ khi có lý do. Đó là gu, hay nói cách khác là năng lực biên tập (curation).

## Dẫn dắt AI (AI Orchestration)

Nếu gu là biết cái gì đúng, thì dẫn dắt AI là biết cách khiến nó làm ra cái đúng đó. AI không tự biết thế nào là một trải nghiệm tốt. Nó chỉ giỏi đúng bằng đề bài nó nhận được.

**Đặt đề bài chuẩn xác.** So sánh hai prompt cho cùng một màn hình:

| Prompt mơ hồ | Prompt có ràng buộc |
| "Thiết kế màn hình chuyển tiền hiện đại, dễ dùng." | "Màn hình chuyển tiền cho người trên 60 tuổi. Mỗi bước chỉ một hành động chính. Bước xác nhận phải hiển thị tên người nhận, số tiền bằng chữ, và nói rõ có thể huỷ. Dùng component từ design system hiện có." |

Prompt bên trái cho ra một màn hình "đẹp" bất kỳ. Prompt bên phải cho ra một màn hình giải quyết đúng nỗi sợ ở phần thấu cảm phía trên. Việc biến yêu cầu mơ hồ của khách hàng thành những ràng buộc như vậy chính là thiết kế.

**Phản biện và kiểm duyệt.** Đọc output của AI như đọc bài của một bạn junior rất nhanh tay nhưng hay ẩu: tìm lỗi logic trong luồng, chỗ thiếu accessibility, và những "bẫy trải nghiệm" (dark pattern) nó vô tình học theo từ dữ liệu.

**Kiểm chứng với người thật.** Phương án AI đưa ra nhanh đến đâu cũng chỉ là giả thuyết. Nhờ AI tiết kiệm thời gian vẽ, Designer có thời gian đem nó đi test với người dùng sớm hơn và nhiều vòng hơn.

## Lời kết

AI không lấy đi công việc của Designer. Nó lấy đi phần việc lặp đi lặp lại, và đẩy tiêu chuẩn của nghề lên cao hơn.

Đừng chạy đua với máy về tốc độ vẽ màn hình hay kéo thả component. Hãy để AI làm trợ lý thực thi siêu tốc, còn mình dành thời gian cho ba việc không thuật toán nào làm thay được: hiểu sâu con người, giải đúng bài toán kinh doanh, và thổi hồn vào sản phẩm.
