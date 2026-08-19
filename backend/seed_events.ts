import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: 'Lễ hội Âm nhạc Mùa Hè 2026',
        description: 'Đại nhạc hội bãi biển lớn nhất năm với sự tham gia của các nghệ sĩ hàng đầu. Quẩy hết mình cùng sóng biển và âm nhạc EDM sôi động!',
        imageUrl: 'https://images.unsplash.com/photo-1540039155732-68ee23e15b51?auto=format&fit=crop&q=80&w=800',
        startDate: new Date('2026-08-15T18:00:00Z'),
        endDate: new Date('2026-08-15T23:59:00Z'),
        isActive: true,
      },
      {
        title: 'TechX Conference',
        description: 'Hội thảo Công nghệ lớn nhất Đông Nam Á về AI và Blockchain. Gặp gỡ và giao lưu với các chuyên gia hàng đầu từ thung lũng Silicon.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        startDate: new Date('2026-09-10T08:00:00Z'),
        endDate: new Date('2026-09-11T17:00:00Z'),
        isActive: true,
      },
      {
        title: 'Lễ hội Ẩm thực Đường phố',
        description: 'Khám phá hàng trăm món ăn đặc sản từ ba miền. Cơ hội thưởng thức ẩm thực đường phố ngon nhất ngay giữa lòng thủ đô.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        startDate: new Date('2026-08-20T10:00:00Z'),
        endDate: new Date('2026-08-22T22:00:00Z'),
        isActive: true,
      }
    ]
  });
  console.log('Seed events completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
