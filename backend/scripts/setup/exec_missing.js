const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  let sqlContent = fs.readFileSync('create_all.sql', 'utf16le');
  // Remove BOM
  if (sqlContent.charCodeAt(0) === 0xFEFF) {
    sqlContent = sqlContent.slice(1);
  }
  
  // Split by ';'
  const statements = sqlContent.split(';');
  
  for (let stmt of statements) {
    stmt = stmt.trim();
    if (stmt.length === 0) continue;
    
    // Remove comments
    stmt = stmt.replace(/--.*$/gm, '').trim();
    if (stmt.length === 0) continue;
    
    try {
      await prisma.$executeRawUnsafe(stmt);
      console.log("Success:", stmt.substring(0, 50).replace(/\n/g, ' '));
    } catch (e) {
      if (!e.message.includes('already exists') && 
          !e.message.includes('multiple primary keys') &&
          !e.message.includes('already a constraint')) {
        console.error("Error executing:", stmt.substring(0, 50).replace(/\n/g, ' '), "\n", e.message);
      } else {
        console.log("Skipped (already exists):", stmt.substring(0, 50).replace(/\n/g, ' '));
      }
    }
  }
  await prisma.$disconnect();
}
run();
