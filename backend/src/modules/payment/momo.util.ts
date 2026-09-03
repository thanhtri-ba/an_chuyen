import crypto from 'crypto';

// Cài đặt theo tài liệu tích hợp chính thức của MoMo (payWithMethod, sandbox +
// production dùng chung 1 luồng, chỉ khác MOMO_PARTNER_CODE/MOMO_ACCESS_KEY/
// MOMO_SECRET_KEY/MOMO_ENDPOINT trong .env).
// Tham khảo: https://developers.momo.vn/v3/docs/payment/api/wallet/onetime

export interface MomoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  endpoint: string; // POST .../v2/gateway/api/create
  redirectUrl: string; // trình duyệt khách được MoMo đưa về đây sau khi thanh toán
  ipnUrl: string; // MoMo gọi server-to-server tới đây
}

export function getMomoConfig(): MomoConfig | null {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const redirectUrl = process.env.MOMO_REDIRECT_URL;
  const ipnUrl = process.env.MOMO_IPN_URL;
  const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
  if (!partnerCode || !accessKey || !secretKey || !redirectUrl || !ipnUrl) return null;
  return { partnerCode, accessKey, secretKey, endpoint, redirectUrl, ipnUrl };
}

function sign(secretKey: string, rawSignature: string): string {
  return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
}

// requestId/orderId phải duy nhất — dùng bookingId + timestamp để cho phép
// khách thử lại thanh toán nhiều lần trên cùng 1 booking mà không đụng ràng
// buộc unique phía MoMo (giống buildTxnRef của VNPay).
export function buildOrderId(bookingId: string): string {
  return `${bookingId}-${Date.now()}`;
}

export function bookingIdFromOrderId(orderId: string): string {
  return orderId.slice(0, orderId.lastIndexOf('-'));
}

export async function createPaymentUrl(config: MomoConfig, params: {
  orderId: string;
  amount: number; // VND, số nguyên
  orderInfo: string;
}): Promise<{ payUrl: string } | { error: string }> {
  const requestId = params.orderId;
  const requestType = 'payWithMethod';
  const extraData = '';

  const rawSignature = `accessKey=${config.accessKey}&amount=${params.amount}&extraData=${extraData}`
    + `&ipnUrl=${config.ipnUrl}&orderId=${params.orderId}&orderInfo=${params.orderInfo}`
    + `&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = sign(config.secretKey, rawSignature);

  const body = {
    partnerCode: config.partnerCode,
    partnerName: 'An Chuyến',
    storeId: 'AnChuyenStore',
    requestId,
    amount: params.amount,
    orderId: params.orderId,
    orderInfo: params.orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: 'vi',
    extraData,
    requestType,
    signature,
    autoCapture: true,
  };

  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json() as { payUrl?: string; resultCode?: number; message?: string };

  if (data.resultCode !== 0 || !data.payUrl) {
    return { error: data.message || 'MoMo không tạo được giao dịch' };
  }
  return { payUrl: data.payUrl };
}

// Xác thực chữ ký MoMo trả về (dùng chung cho cả redirect và IPN) — KHÔNG
// được tin bất kỳ trường nào (số tiền, mã đơn, resultCode) nếu chữ ký sai.
export function verifySignature(config: MomoConfig, query: Record<string, any>): boolean {
  const receivedSignature = query.signature;
  if (!receivedSignature) return false;

  const rawSignature = `accessKey=${config.accessKey}&amount=${query.amount}&extraData=${query.extraData ?? ''}`
    + `&message=${query.message}&orderId=${query.orderId}&orderInfo=${query.orderInfo}&orderType=${query.orderType}`
    + `&partnerCode=${query.partnerCode}&payType=${query.payType}&requestId=${query.requestId}`
    + `&responseTime=${query.responseTime}&resultCode=${query.resultCode}&transId=${query.transId}`;
  const computed = sign(config.secretKey, rawSignature);

  return computed === receivedSignature;
}
