# VIRAL DOJO — Product Blueprint v1.0

**Ứng dụng Learn-to-Ship: học xây kênh viral bằng cách tạo ra kênh thật, AI chấm bằng rubric thật, đo tiến bộ bằng đơn hàng thật.**

*Build từ: giáo trình COREVIRAL (6 module + rubric 100đ + SKULD 9 bước) + hệ ~30 skill engine sản xuất content + data flywheel 2,1 tỷ GMV TikTok và 12 tháng Meta Ads của Deman International.*

---

## 1. Nỗi đau thị trường & vị trí sản phẩm

Thị trường đào tạo ecom/content Việt Nam đang đứt gãy ở đúng một chỗ: khoảng cách giữa HỌC và LÀM. Người học mua khoá vài triệu, nhận về slide và file mẫu, rồi tắc ở bài thực hành đầu tiên vì không ai chấm, không ai sửa, không biết output của mình đạt hay chưa. Tri thức nằm chết trong Google Sheet — như chính thread nội bộ "1 người đi học cả nhóm được nhờ": tri thức chỉ nhân bản được khi có người giỏi ngồi kèm, mà người giỏi thì không scale. Phía còn lại, AI generic (ChatGPT) cho output tức thì nhưng không có phương pháp và không có chuẩn chất lượng — người dùng không phân biệt được script tốt hay dở, nên không tiến bộ và rời bỏ. Agency thì giải được output nhưng giá 15–50 triệu/tháng, ngoài tầm của hộ kinh doanh và seller TikTok Shop — nhóm đang chiếm phần lớn 5+ triệu seller TMĐT Việt Nam.

Viral Dojo đứng đúng giao điểm ba nhu cầu đó: một ứng dụng nơi người dùng **học theo lộ trình đã kiểm chứng, thực hành ngay trong app với AI chấm điểm định lượng, và bước ra với một kênh TikTok hoàn chỉnh kèm 30 ngày content sẵn đăng** — không phải chứng chỉ.

Câu định vị: **"Đừng học về viral. Hãy ship một kênh viral."**

## 2. Vì sao là mình — 4 moat

Thứ nhất, **rubric chấm điểm định lượng có sẵn**: COREVIRAL là giáo trình hiếm hoi có rubric 100đ chi tiết từng tiêu chí cho cả 6 bài (vd Module 5: đúng nguồn nước ngoài 10đ, dạng series/thử thách 50đ...). Rubric định lượng = AI chấm được ngay, không cần xây chuẩn từ đầu. Thứ hai, **benchmark từ dữ liệu thật**: 27.653 video / 2,1 tỷ GMV đã phân cụm thành 6 công thức win + 10 insight Meta Ads — AI grader không chấm chay mà đối chiếu "ý tưởng của bạn giống winner cụm nào, GPM benchmark bao nhiêu". Thứ ba, **execution engine đã chạy thực chiến**: viral-grid-master, koc-virtual-builder, content-vo-han, vsl-engine, LP factory + deploy agent — nút "Generate" của app không phải vaporware, nó là các skill đang sản xuất content cho Oniiz hằng ngày. Thứ tư, **distribution sẵn**: cộng đồng EcomLegend dogfood nội bộ, sau đó là tệp seller/học viên sẵn có.

## 3. User flow — 6 Trạm + Cổng Generate

Nguyên tắc xuyên suốt: output của trạm trước là input của trạm sau; mọi bài nộp được lưu thành **Channel DNA** — một file JSON sống lớn dần qua từng trạm, và là nguyên liệu cho cổng Generate cuối cùng.

**Onboarding (10 phút).** Người dùng khai: ngành hàng, sản phẩm, link shop/kênh hiện có (nếu có). App tự gợi ý chiến lược kênh sơ bộ. Kết nối connector tối thiểu (Gemini key — miễn phí tier đủ dùng).

**Trạm 1 — Chiến lược & Định dạng kênh.** Học 10': 3 chiến lược (Thương hiệu/Ẩn thương hiệu/Nhân hiệu) × 3 định dạng (Kiến thức/Hình thức/Kết hợp) + tư duy 2 lớp Chủ đề × Cách thể hiện. Thực hành: matrix builder kéo-thả — 1 chủ đề → ≥5 cách thể hiện → ≥3 ý tưởng/cách. AI chấm theo rubric (cấu trúc 20 · sáng tạo 20 · thực tiễn 30 · số lượng 10 · đa dạng 20), trả feedback từng ô và gợi ý nâng điểm. Đạt ≥70đ mở Trạm 2.

**Trạm 2 — Đọc vị Series.** Học: series là vũ khí — khán giả nhớ format. Thực hành: paste link 4 kênh (app cào qua Apify connector, tự lấy danh sách video + view) → user gom video thành series, gắn nhãn Chủ đề + Cách thể hiện → AI verify đúng/sai series (rubric: đúng series 50đ).

**Trạm 3 — Keyword Brand & Insight Sale.** Thực hành: điền ≥3 keyword brand + bản đồ Insight Sale 5 tầng (Nỗi đau → Rào cản → Mong đợi → Tự hào → Thúc đẩy) + signature kênh. AI đối chiếu với VoC thật nếu user đã cào comment (Apify) — "tầng Nỗi đau của bạn có xuất hiện trong 500 comment khách thật không?"

**Trạm 4 — Kho đạn Keyword.** Thực hành: bảng 8 danh mục × ≥5 keyword (tổng ≥30). AI chấm độ sát insight + khả năng triển khai, tự gợi ý keyword còn thiếu từ data ngành.

**Trạm 5 — Săn video viral.** Đây là trạm "ăn tiền" của Connection Hub: user chọn keyword → app gọi Apify cào TikTok/Douyin, lọc tự động theo ngưỡng viral (≥500K view / ≥35K tim), kéo transcript + dịch bằng Gemini → bảng research ≥20 video tự điền đến 80%, user chỉ chọn lọc và ghi nhận xét. Rubric ưu tiên 50đ cho dạng series/thử thách/xếp hạng được AI gắn nhãn sẵn.

**Trạm 6 — Phân tích & Nâng cấp.** User chọn 5 video tốt nhất → app hiển thị phân tích timestamp cạnh khung "điểm thành công" → user viết phần nâng cấp ghép insight sản phẩm mình → AI chấm + đối chiếu 6 công thức win từ data 2,1 tỷ GMV ("ý tưởng của bạn thuộc cụm Drama Couple — benchmark 4,5M GMV/video").

**Cổng GENERATE (trả phí).** Channel DNA đã đầy → một nút bấm gọi execution engine: 30-day calendar + script 5-beat từng video + prompt ảnh (Nano Banana) + prompt video (Veo 3 chain) + voice spec + landing page COD deploy Cloudflare. Người học bước ra với kênh sẵn chạy. Vòng lặp sau-tốt-nghiệp: connector kéo số đơn/GMV về dashboard → video ≥20 đơn được gắn nhãn winner → app nhắc "nhân bản 10 biến thể" → người dùng quay lại app hằng tuần (retention engine).

## 4. Connection Hub — tầng dữ liệu sống

Triết lý: **mọi connector là 1 MCP server** — app nói chuyện với thế giới qua một chuẩn duy nhất, thêm nguồn mới không sửa core. Key lưu phía user (localStorage/máy user ở bản MVP; vault mã hoá ở bản SaaS), app không giữ key trên server — vừa an toàn vừa nhẹ pháp lý.

| Connector | Giao thức | Nuôi trạm | Vai trò |
|---|---|---|---|
| Gemini API | REST (key user) | Tất cả | AI grader + dịch + generate. Free tier đủ cho học viên |
| Apify | REST API token | 2, 3, 5 | Cào TikTok/Douyin/FB: video theo keyword, comment VoC, profile kênh. 3 gói budget ($5 demo / $29 / $99) theo method apify-research-engine |
| Pipeboard / Meta Ads MCP | MCP | Sau tốt nghiệp | Kéo insights ads thật — chấm "tốt nghiệp" bằng cost/đơn thật |
| TikTok Shop export | Upload xlsx | 6 + dashboard | Parse GMV/đơn/GPM từng video (như file Video_List) — không cần API chính thức |
| Google Sheets | OAuth/Apps Script | 1–6 | Sync 2 chiều với file bài tập Lark/Sheet sẵn có của team |
| Cloudflare Pages | CLI/API | Generate | Deploy LP COD một nút |
| Claude API / MCP client | MCP | Generate | Gọi skill engines (viral-grid, koc-builder...) cho user pro |

Pipeline real-time: cron 6h/lần kéo metrics các kênh đã connect → cập nhật dashboard winner/loser → đẩy notification "video X vừa đạt ngưỡng nhân bản". Đây là điểm khác biệt chí mạng so với mọi khoá học: **app biết học viên có ra đơn thật hay không.**

## 5. Mô hình kinh doanh

Freemium 3 tầng. **FREE**: học 6 trạm + AI chấm 3 lần/trạm (key Gemini của user) — mục tiêu viral hoá trong cộng đồng seller. **PRO 499K/tháng**: chấm không giới hạn, Connection Hub đầy đủ (Apify proxy quota, dashboard real-time), hook bank + benchmark data win. **STUDIO 1.990K/tháng**: cổng Generate đầy đủ (30-day pack + LP deploy), chế độ Agency nhiều kênh, white-label cho người dạy lại. Doanh thu phụ: cohort có mentor chấm tay (học phí 3–5 triệu, app làm xương sống), revenue-share affiliate Apify/hosting.

Unit economics MVP: chi phí biến đổi ≈ 0 (key phía user); chi phí thật là Apify proxy cho gói Pro (~$5–10/user/tháng) — biên >70%.

## 6. GTM — 3 vòng

**Vòng 1 (tuần 1–4) Dogfood:** team EcomLegend dùng thay file Lark; 5–10 người hoàn thành lộ trình, đo: thời gian hoàn thành/trạm, điểm trung bình, tỷ lệ đến Trạm 6. Case study nội bộ: kênh Oniiz build bằng chính app. **Vòng 2 (tháng 2–3) Cohort beta:** mở 50–100 slot trả phí sớm trong cộng đồng + nội dung của Hải VN (FB/TikTok về hành trình build app — content chính là marketing). **Vòng 3 (tháng 3+) Self-serve:** mở free tier, phễu: video "AI chấm bài content của bạn miễn phí" → free user → Pro khi chạm giới hạn chấm → Studio khi cần Generate.

North-star metric: **số kênh tốt nghiệp có ≥1 video ra đơn trong 30 ngày** (không phải số user đăng ký).

## 7. Roadmap 90 ngày

**Tuần 1–2 — MVP (đã build kèm blueprint này):** 1 file HTML — Trạm 1 đầy đủ (học + matrix builder + AI grader Gemini + rubric 100đ), Connection Hub khung (Gemini/Apify/xlsx), Channel DNA export JSON, progress localStorage. **Tuần 3–4:** Trạm 2–4 + Apify cào thật ở Trạm 2; chuyển Next.js + Supabase (auth, lưu Channel DNA server). **Tháng 2:** Trạm 5–6 với pipeline Apify+Gemini dịch; dashboard TikTok xlsx parser; thanh toán (SePay/Casso QR). **Tháng 3:** Cổng Generate v1 (calendar + script + prompt pack — chưa cần render video); Pipeboard connector; mở cohort beta. **Sau 90 ngày:** Generate v2 gọi skill engines qua MCP, chế độ Agency, mobile PWA.

## 8. Rủi ro chính & đối sách

Apify đổi giá/TikTok chặn cào → trừu tượng hoá qua MCP, luôn có 2 actor dự phòng + chế độ nhập tay (app vẫn dùng được không có connector). Người học bỏ giữa chừng → mỗi trạm ≤45 phút, gamification điểm + leaderboard cohort, output từng trạm có giá trị độc lập (Trạm 4 xong là có kho keyword dùng được ngay). Bản quyền giáo trình → COREVIRAL là tài liệu nội bộ team đã mua; khi thương mại hoá cần thoả thuận license/hợp tác với bên bán khoá gốc hoặc viết lại curriculum bằng ngôn ngữ + case data riêng (data Oniiz là của mình — khuyến nghị đi hướng này từ tháng 2). AI chấm sai → luôn hiện breakdown điểm theo tiêu chí + nút "phúc khảo" gửi mentor (cohort).

---
*Viral Dojo Blueprint v1.0 · 11/06/2026 · Đi kèm: viral-dojo-mvp.html (Trạm 1 chạy được)*
