import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const email = 'phamthanhtri14032006@gmail.com';
  const newPassword = 'Phamtri1403@';
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  
  console.log('Password updated successfully for', email);
}

main().finally(() => prisma.$disconnect());
