import { Resend } from 'resend';
import { logger } from './logger';

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

// Single seam for outbound email — every module (identity/OTP, future
// booking-confirmation emails, etc.) should call sendMail() instead of
// talking to Resend/SMTP directly, so swapping providers later only touches
// this file. EMAIL_PROVIDER currently only supports 'resend'; anything else
// (or unset) logs instead of sending, so local dev never needs a real key.
const provider = process.env.EMAIL_PROVIDER || 'log';
const resendClient = provider === 'resend' && process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendMail({ to, subject, html }: SendMailParams): Promise<void> {
  if (!resendClient) {
    logger.warn('mailer: EMAIL_PROVIDER not configured — logging email instead of sending', {
      to,
      subject,
    });
    return;
  }

  const from = process.env.EMAIL_FROM || 'no-reply@anchuyen.vn';

  const { error } = await resendClient.emails.send({ from, to, subject, html });
  if (error) {
    logger.error('mailer: failed to send email', { to, subject, error });
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
}
