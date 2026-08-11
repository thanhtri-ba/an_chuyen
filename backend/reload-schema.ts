import { PrismaClient } from '@prisma/client';
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const urlWithLimit = dbUrl.includes('connection_limit') ? dbUrl.replace(/connection_limit=\d+/, 'connection_limit=1') : (dbUrl.includes('?') ? `${dbUrl}&connection_limit=1` : `${dbUrl}?connection_limit=1`);
const prisma = new PrismaClient({ datasources: { db: { url: urlWithLimit } } });
async function run() {
  await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload schema';`);
  console.log("Reloaded schema!");
}
run().finally(() => prisma.$disconnect());
