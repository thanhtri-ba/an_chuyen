import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Rental Cars
  await prisma.rentalCar.createMany({
    data: [
      {
        name: 'Eco Mite EV',
        description: 'Compact Electric Hatchback',
        type: 'Hatchback',
        seats: 4,
        transmission: 'Automatic',
        energyType: 'Electric',
        pricePerDay: 45,
        imageUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png',
        isBestValue: true,
      },
      {
        name: 'Cloud Cruiser SUV',
        description: 'Premium Family SUV',
        type: 'SUV',
        seats: 7,
        transmission: 'Automatic',
        energyType: 'Hybrid',
        pricePerDay: 85,
        imageUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png',
        isBestValue: false,
      }
    ]
  });

  // Seed Tours
  await prisma.tour.createMany({
    data: [
      {
        title: 'Khám phá Đà Lạt',
        description: 'Tour khám phá Đà Lạt 3 ngày 2 đêm',
        duration: '3N2Đ',
        price: 2500000,
        imageUrl: 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e?auto=format&fit=crop&q=80&w=600'
      },
      {
        title: 'Biển xanh Nha Trang',
        description: 'Nha Trang biển gọi 4 ngày 3 đêm',
        duration: '4N3Đ',
        price: 3200000,
        imageUrl: 'https://images.unsplash.com/photo-1582236399084-3c66f54b68ce?auto=format&fit=crop&q=80&w=600'
      }
    ]
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
