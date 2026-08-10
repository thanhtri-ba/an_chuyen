const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Prisma users:');
    console.dir(users);
    
    const authUsers = await prisma.$queryRaw`SELECT id, email FROM auth.users`;
    console.log('Auth users:');
    console.dir(authUsers);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
