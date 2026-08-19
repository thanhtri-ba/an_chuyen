const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.kuirefkhynqksasvyibf:Phamtri14032006%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
  console.log(res.rows);
  await client.end();
}
run();
