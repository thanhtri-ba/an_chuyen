interface Props {
  className?: string;
}

// Logo An Chuyến — hai đỉnh núi ghép negative-space thành dáng "M" (núi rừng,
// hành trình theo đúng ART_DIRECTION.md) kèm mặt trời vàng. Núi dùng
// currentColor để tự đổi màu theo nền (trắng khi header trong suốt, tối khi
// cuộn), mặt trời giữ cố định màu vàng gold thương hiệu.
export function BrandMark({ className }: Props) {
  return (
    <svg viewBox="0 0 340 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="245" cy="55" r="26" fill="#F2C118" />
      <path
        fill="currentColor"
        d="M20 250 L120 95 L168 178 L210 95 L300 250 Z"
      />
    </svg>
  );
}
