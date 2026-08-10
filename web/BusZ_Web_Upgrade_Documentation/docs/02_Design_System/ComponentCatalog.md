# 4. Danh mục component dùng chung

## 4.1 Component nền tảng

- Button: primary, secondary, outline, ghost, danger.
- Input: text, password, phone, search, date.
- Select, Combobox, Checkbox, Radio, Switch.
- Card, Badge, Chip, Tag, Divider.
- Modal, Drawer, Popover, Tooltip.
- Tabs, Accordion, Breadcrumb, Pagination.
- Skeleton, Spinner, Progress, Toast.

## 4.2 Component nghiệp vụ BusZ

- LocationPicker.
- DateTripPicker.
- PassengerCounter.
- TripCard.
- BusOperatorBadge.
- RouteTimeline.
- PickupDropoffSelector.
- SeatMap.
- SeatLegend.
- FareBreakdown.
- CouponInput.
- BookingStatusTimeline.
- TicketQRCode.
- RatingSummary.

## 4.3 Quy tắc component

- Không gọi API trực tiếp trong component UI thuần.
- Nhận dữ liệu qua props hoặc hook domain.
- Có đầy đủ trạng thái disabled, loading và error.
- Có thể sử dụng bằng bàn phím.
- Không hardcode màu nếu đã có token.
- Không tạo component mới nếu component hiện có chỉ cần mở rộng variant.
