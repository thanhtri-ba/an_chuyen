// Renders the OTP verification email. Kept separate from mailer.ts so new
// templates (booking confirmation, etc.) can be added the same way later
// without growing that file.
export function otpEmailTemplate(code: string, ttlMinutes: number): { subject: string; html: string } {
  return {
    subject: `${code} là mã xác minh An Chuyến của bạn`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a1a;">Mã xác minh An Chuyến</h2>
        <p style="color: #444; font-size: 15px;">Nhập mã dưới đây để xác minh email của bạn:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #f4f4f5; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #777; font-size: 13px;">Mã có hiệu lực trong ${ttlMinutes} phút và chỉ dùng được 1 lần. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</p>
      </div>
    `,
  };
}
