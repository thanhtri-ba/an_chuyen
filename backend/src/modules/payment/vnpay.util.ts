import crypto from 'crypto';
import qs from 'qs';

// Cài đặt theo tài liệu tích hợp chính thức của VNPay (sandbox + production
// dùng chung 1 luồng, chỉ khác vnp_TmnCode/HashSecret/vnp_Url trong .env).
// Tham khảo: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {};
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

export interface VnpayConfig {
  tmnCode: string;
  hashSecret: string;
  vnpUrl: string;
  returnUrl: string;
}

export function getVnpayConfig(): VnpayConfig | null {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = process.env.VNPAY_RETURN_URL;
  if (!tmnCode || !hashSecret || !returnUrl) return null;
  return { tmnCode, hashSecret, vnpUrl, returnUrl };
}

// vnp_TxnRef phải duy nhất — dùng bookingId + timestamp để cho phép khách thử
// lại thanh toán nhiều lần trên cùng 1 booking (mỗi lần thử là 1 giao dịch
// VNPay riêng) mà không đụng ràng buộc unique phía VNPay.
export function buildTxnRef(bookingId: string): string {
  return `${bookingId}-${Date.now()}`;
}

export function bookingIdFromTxnRef(txnRef: string): string {
  return txnRef.slice(0, txnRef.lastIndexOf('-'));
}

export function createPaymentUrl(config: VnpayConfig, params: {
  txnRef: string;
  amount: number; // VND, chưa nhân 100
  orderInfo: string;
  ipAddr: string;
}): string {
  const now = new Date();
  const createDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

  let vnpParams: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: config.tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: params.txnRef,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: String(Math.round(params.amount) * 100),
    vnp_ReturnUrl: config.returnUrl,
    vnp_IpAddr: params.ipAddr,
    vnp_CreateDate: createDate,
  };

  vnpParams = sortObject(vnpParams);
  const signData = qs.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac('sha512', config.hashSecret);
  const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnpParams.vnp_SecureHash = secureHash;

  return `${config.vnpUrl}?${qs.stringify(vnpParams, { encode: false })}`;
}

// Xác thực chữ ký VNPay trả về (dùng chung cho cả return URL và IPN) — KHÔNG
// được tin bất kỳ trường nào (số tiền, mã đơn, trạng thái) trong query nếu
// chữ ký sai, vì đó là lúc ai đó có thể tự chế URL giả để gian lận.
export function verifySignature(config: VnpayConfig, query: Record<string, any>): boolean {
  const receivedHash = query.vnp_SecureHash;
  if (!receivedHash) return false;

  const params: Record<string, string> = {};
  Object.keys(query).forEach((key) => {
    if (key === 'vnp_SecureHash' || key === 'vnp_SecureHashType') return;
    params[key] = String(query[key]);
  });

  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac('sha512', config.hashSecret);
  const computedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return computedHash === receivedHash;
}
