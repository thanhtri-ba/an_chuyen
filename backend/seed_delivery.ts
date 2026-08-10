import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.deliveryVehicle.createMany({
    data: [
      {
        name: 'Motorbike Express',
        description: 'Up to 10kg • Fast',
        price: 12.50,
      },
      {
        name: 'Cargo Van',
        description: 'Up to 500kg • Secure',
        price: 35.00,
      },
      {
        name: 'Heavy Truck',
        description: 'Up to 2000kg • Pallets',
        price: 85.00,
      }
    ]
  });
  console.log('Seed delivery vehicles completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
