const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const fks = await prisma.$queryRawUnsafe(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        tc.constraint_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_schema = 'auth' AND ccu.table_name = 'users';
    `);
    
    for (const fk of fks) {
      console.log(`Dropping ${fk.constraint_name} from ${fk.table_name}`);
      await prisma.$executeRawUnsafe(`ALTER TABLE public.${fk.table_name} DROP CONSTRAINT ${fk.constraint_name};`);
    }
    console.log("Done dropping all auth.users foreign keys.");
  } catch (e) {
    console.error("Error:", e);
  }
  await prisma.$disconnect();
}
run();
