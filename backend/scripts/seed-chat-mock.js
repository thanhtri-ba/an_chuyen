const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'thanhtri.bsa@gmail.com';

// Dùng đúng các tài khoản thật đang có trong hệ thống (thay vì email giả
// @example.com) để dữ liệu chat mẫu khớp với data thật, bấm vào hồ sơ khách
// trong admin panel ra đúng người thật thay vì user ảo không tồn tại.
const CUSTOMER_EMAILS = [
  'phamthanhtri14032006@gmail.com',
  'phamthanhtri60020341@gmail.com',
  'phamthanhtri1510@gmail.com',
  'toan.truong0602@gmail.com',
  'testuser001@example.com',
];

// [isFromCustomer, text]
const CONVERSATIONS = [
  {
    status: 'OPEN',
    thread: [
      [true, 'Chào shop, mình đặt vé SG - Đà Lạt nhưng chưa thấy email xác nhận ạ'],
      [false, 'Chào bạn, cho mình xin mã đơn hàng hoặc số điện thoại đặt vé để kiểm tra giúp bạn nhé'],
      [true, 'Số điện thoại đặt lúc sáng nay khoảng 9h ạ'],
      [false, 'Mình kiểm tra thấy đơn của bạn đã thanh toán thành công rồi, email có thể vào mục Spam nhé. Mình gửi lại vé qua Zalo được không ạ?'],
      [true, 'Dạ được, cảm ơn shop nhiều'],
    ],
  },
  {
    status: 'OPEN',
    thread: [
      [true, 'Cho hỏi xe giường nằm tuyến Hà Nội - Sapa có wifi không shop?'],
      [false, 'Dạ có wifi miễn phí, nước suối và khăn lạnh trên xe luôn bạn nhé'],
      [true, 'Ok vậy mình đặt 2 vé cho cuối tuần này'],
    ],
  },
  {
    status: 'RESOLVED',
    thread: [
      [true, 'Mình muốn đổi giờ khởi hành từ 20h sang 13h cùng ngày được không ạ'],
      [false, 'Dạ được bạn nhé, mình đã đổi giúp bạn sang chuyến 13h rồi, giá vé không đổi'],
      [true, 'Cảm ơn shop nhiều ạ'],
      [false, 'Dạ không có gì, chúc bạn có chuyến đi vui vẻ!'],
    ],
  },
  {
    status: 'OPEN',
    thread: [
      [true, 'Xe bị trễ giờ đón ở bến xe Miền Đông, mình đợi 20 phút rồi mà chưa thấy xe'],
      [false, 'Mình xin lỗi vì sự bất tiện này, để mình liên hệ tài xế kiểm tra ngay giúp bạn'],
      [false, 'Tài xế báo xe đang cách bến khoảng 5 phút do kẹt xe, bạn thông cảm chờ thêm chút nhé'],
      [true, 'Dạ ok mình đợi thêm'],
    ],
  },
  {
    status: 'RESOLVED',
    thread: [
      [true, 'Cho mình hỏi có hỗ trợ xuất hoá đơn công ty không ạ'],
      [false, 'Dạ có, bạn cho mình xin thông tin công ty (tên, mã số thuế, địa chỉ) để xuất hoá đơn nhé'],
      [true, 'Mình gửi qua email được không?'],
      [false, 'Dạ được, bạn gửi về email support@anchuyen.vn giúp mình nhé'],
    ],
  },
];

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) throw new Error(`Admin user ${ADMIN_EMAIL} not found`);

  for (let i = 0; i < CONVERSATIONS.length; i++) {
    const email = CUSTOMER_EMAILS[i % CUSTOMER_EMAILS.length];
    const customer = await prisma.user.findUnique({ where: { email } });
    if (!customer) {
      console.log(`Skip: user ${email} not found in DB`);
      continue;
    }

    const convo = await prisma.supportConversation.create({
      data: { userId: customer.id, status: CONVERSATIONS[i].status },
    });

    const now = Date.now();
    const thread = CONVERSATIONS[i].thread;
    for (let j = 0; j < thread.length; j++) {
      const [isFromCustomer, text] = thread[j];
      await prisma.supportMessage.create({
        data: {
          conversationId: convo.id,
          senderId: isFromCustomer ? customer.id : admin.id,
          text,
          isRead: true,
          createdAt: new Date(now - (thread.length - j) * 5 * 60 * 1000),
        },
      });
    }

    console.log(`Created conversation for ${customer.fullName} <${email}> (${thread.length} messages, status=${convo.status})`);
  }

  console.log('Done.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
