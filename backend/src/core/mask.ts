// Che bớt CCCD/CMND khi trả về qua API — dữ liệu cá nhân nhạy cảm theo Nghị
// định 13/2023, không nên hiển thị đầy đủ ở bất kỳ đâu ngoài chính chủ tài
// khoản tự xem hồ sơ của mình (auth.routes.ts GET/PUT /profile không dùng
// hàm này — đó là tự xem, không phải "lộ"). Dùng ở mọi nơi khác trả CCCD ra
// (đặc biệt admin CRUD, xem admin.routes.ts::deepStrip).
export function maskIdCard(idCard: string | null | undefined): string | null {
  if (!idCard) return idCard ?? null;
  if (idCard.length <= 6) return '*'.repeat(idCard.length);
  const head = idCard.slice(0, 3);
  const tail = idCard.slice(-3);
  return `${head}${'*'.repeat(idCard.length - 6)}${tail}`;
}
