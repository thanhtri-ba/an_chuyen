const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ take: 2 });
  if (users.length === 0) return;
  const user = users[0];
  const admin = users[1] || users[0];

  const conv = await prisma.supportConversation.create({
    data: {
      userId: user.id,
      status: 'OPEN'
    }
  });

  await prisma.supportMessage.createMany({
    data: [
      { conversationId: conv.id, senderId: user.id, text: 'Chào Admin, cho mình hỏi chuyến đi Đà Lạt tối nay còn vé không?' },
      { conversationId: conv.id, senderId: admin.id, text: 'Chào bạn! Chuyến Đà Lạt 22:00 tối nay hiện tại chỉ còn 2 ghế trống ạ.' },
      { conversationId: conv.id, senderId: user.id, text: 'Tuyệt quá, mình có thể chọn giường tầng dưới không?' }
    ]
  });
  console.log('Chat seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
