# ChatApp — Design System "Tín hiệu ấm"

**Brand essence:** một app chat realtime vừa "công nghệ" vừa thân thiện — nền giấy kem ấm, tín hiệu teal sống động, mọi khối nổi bật mang hình bong bóng chat.

## Ý tưởng

- **Ấm (friendly):** nền kem `#F6F4EF`, lời chào theo giờ + tên gọi, câu chữ tiếng Việt tự nhiên, minh hoạ bong bóng chat cho trạng thái rỗng.
- **Tín hiệu (tech):** teal đậm là "tín hiệu realtime". Người đang online được biểu diễn bằng chấm phát sóng (`PulseDot`) và vòng gradient (`Avatar ring`); thẻ "Nhịp hộp thư" và màn đăng nhập dùng gradient teal + các vòng sóng đồng tâm (`SignalBackdrop`). Số liệu dùng chữ số đều (`tabular-nums`).
- **Chữ ký hình khối — "góc bong bóng":** khối nổi bật bo tròn lớn nhưng chừa đúng **một góc nhỏ** (`radius.tail` = 6) như đuôi bong bóng chat: thẻ, nút chính, chip đếm, ô nhập, badge, ô chữ cái nhóm danh bạ.

## Tokens (`src/theme/index.ts`)

| Nhóm | Token | Giá trị | Dùng cho |
|---|---|---|---|
| Màu chính | `primary` / `primaryDeep` / `primaryBright` | `#0B7A7C` / `#064E50` / `#2BB5B0` | Hành động chính, gradient tín hiệu, vòng online |
| Nền teal nhạt | `primarySoft` / `primaryMist` | `#E3F4F4` / `#F0F9F8` | Nút phụ, dòng chưa đọc, ô đang focus |
| Nền | `background` / `surfaceMuted` / `card` | `#F6F4EF` / `#ECE8DF` / `#FFF` | Nền màn, skeleton & chip đếm, thẻ |
| Chữ | `text` / `textMuted` / `textOnPrimary(Muted)` | `#111827` / `#6B7280` / `#FFF` (`#CDEBEB`) | — |
| Viền | `border` / `borderWarm` | `#E5E7EB` / `#E4DFD3` | Kẻ trong nhóm / viền ô, chip, thẻ trên nền kem |
| Trạng thái | `online` / `onlineText` / `offline` / `danger` | `#22C55E` / `#15803D` / `#9CA3AF` / `#EF4444` | Chấm online, **chữ** online (đạt 4.5:1), lỗi |
| Trên nền teal | `glassOnPrimary` | `rgba(255,255,255,0.14)` | Chip kính trên thẻ gradient |
| Điểm nhấn ấm | `warm` | `#F2994A` | **Chỉ trang trí** (chấm lời chào, beacon); không dùng cho chữ |

- **Typography (Roboto hệ thống, đủ dấu tiếng Việt):** `display` 28/800 (-0.5), `screenTitle` 26/800 (-0.4), `name` 16/600, `body` 15, `bodyMuted` 14, `caption` 12/500, `overline` 11/700 IN HOA giãn 1.2, `numeric` = tabular-nums.
- **Spacing:** 4 · 8 · 12 · 16 · 24 · 32 (`xs`→`xxl`). Lề ngang màn hình 16.
- **Radius:** `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `xxl` 28 · `tail` 6 · `pill`.
- **Depth:** `shadowCard` cho thẻ trắng; `shadowGlow` (bóng teal) chỉ cho thứ "phát tín hiệu": thẻ Nhịp hộp thư, nút gửi đang bật, nút chính màn auth.
- **Motion (`motion`):** `fast` 150ms (nhấn), `base` 220ms (vào danh sách), `stagger` 35ms tối đa 8 mục, `pulse` 1600ms (sóng online), `pressScale` 0.97. Chỉ dùng `Animated` (native driver) + `LayoutAnimation`. Mọi chuyển động tắt khi bật "Giảm chuyển động" (`useReducedMotion`).

## Component rules

- **Danh sách = nhóm thẻ bo góc** trên nền kem: dòng đầu bo `xl` hai góc trên, dòng cuối bo `xl` trái + `tail` phải; phân cách bằng `InsetSeparator` (lùi sau avatar).
- **Home:** lời chào + avatar (mở Cài đặt) → ô tìm → thẻ "Nhịp hộp thư" (tin chưa đọc, số online, "Đọc ngay") → dải "Đang hoạt động" → chip Tất cả / Chưa đọc / Online → danh sách.
- **Danh bạ = danh bạ điện thoại:** xếp theo tên A→Z (`localeCompare('vi')`), nhóm theo chữ cái đầu của tên (bỏ dấu, **Đ là nhóm riêng sau D**, ký tự lạ vào `#`), tiêu đề nhóm dính khi cuộn, thanh chữ cái cạnh phải để nhảy nhóm (ẩn khi tìm kiếm). Không tách nhóm online; trạng thái online hiện trên từng dòng (chấm + chữ xanh).
- **Dòng chưa đọc:** nền `primaryMist`, vạch tín hiệu 3px bên trái, tên đậm 800, giờ teal, `UnreadBadge` nảy khi số tăng.
- **Online:** chấm xanh trên avatar; `pulse` chỉ cho người đang online thật hoặc chỗ ít phần tử (header, dải Đang hoạt động, ChatHeader).
- **Tin nhắn vị trí:** không hiển thị emoji thô — icon `mapPin` + "Đã chia sẻ vị trí".
- **Tìm kiếm:** ô pill, viền teal + nền `primaryMist` khi focus, nút xoá tròn (vùng chạm 44px), đoạn khớp được tô bằng `HighlightText`.
- **Trạng thái:** loading = `SkeletonList` (đúng bố cục dòng thật); rỗng = `EmptyState` minh hoạ bong bóng + một hành động gợi ý khi có bước tiếp theo rõ ràng.
- **Chạm:** vùng bấm ≥ 44×44 (dùng `hitSlop` khi phần nhìn thấy nhỏ hơn); phản hồi bằng `PressableScale`; icon-only luôn có `accessibilityLabel`.
- **Tab bar:** icon tab đang chọn nằm trong viên `primarySoft` có góc đuôi.

## Voice & tone

- Xưng "bạn", câu ngắn, ấm áp, không kỹ thuật: "Chào buổi chiều, An", "Hộp thư gọn gàng — nhắn cho ai đó nhé!", "Chọn một người trong Danh bạ để gửi lời chào đầu tiên."
- Trạng thái nói rõ sự thật realtime: "3 người đang hoạt động", "Hoạt động 5 phút trước".
- Luôn đủ dấu tiếng Việt; không dùng emoji làm icon.

## Do / Don't

| Do | Don't |
|---|---|
| Lấy mọi màu/khoảng cách/bo góc từ token | Viết hex/rgba trực tiếp trong component |
| Một góc "đuôi" cho khối nổi bật | Bo đuôi cả 4 góc hoặc mọi phần tử nhỏ |
| Teal cho hành động, trạng thái, lựa chọn | Dùng `warm` cho chữ hay nút |
| Pulse cho vài điểm nhấn realtime | Cho cả danh sách cùng nhấp nháy |
| Chuyển động 150–320ms, có bản giảm chuyển động | Animation trang trí chặn thao tác |
