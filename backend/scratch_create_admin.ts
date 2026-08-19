import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const email = 'admin@anchuyen.com';
  const password = '123456';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'admin' },
    create: {
      email,
      password: hashedPassword,
      fullName: 'System Admin',
      phone: '0999999999',
      role: 'admin',
    },
  });
  
  console.log('Admin user updated/created successfully:', user.email);
}

main().finally(() => prisma.$disconnect());
