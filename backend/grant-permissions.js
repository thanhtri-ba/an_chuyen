const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.kuirefkhynqksasvyibf:Phamtri14032006%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  await client.connect();
  await client.query("GRANT USAGE ON SCHEMA public TO anon, authenticated;");
  await client.query("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;");
  await client.query("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;");
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log("Permissions granted and schema reloaded!");
  await client.end();
}
run();
