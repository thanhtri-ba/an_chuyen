const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://kuirefkhynqksasvyibf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1aXJlZmtoeW5xa3Nhc3Z5aWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzOTI3NDAsImV4cCI6MjEwMTk2ODc0MH0.TI3TZpzJXiUFktf8dxCVWv1Z6TOv_fERWE0lSK-XoxI');
async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@anchuyen.com',
    password: '123456',
  });
  console.log(data, error);
}
run();
