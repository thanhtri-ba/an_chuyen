const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.kuirefkhynqksasvyibf:Phamtri14032006%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  await client.connect();
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log("NOTIFY sent!");
  await client.end();
}
run();
