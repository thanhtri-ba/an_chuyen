import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
async function main() { 
  const user = await prisma.user.findUnique({ where: { email: 'phamthanhtri14032006@gmail.com' } }); 
  console.log(user); 
} 
main().finally(() => prisma.$disconnect());
