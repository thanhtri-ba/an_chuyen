const SUPABASE_URL = 'https://hgublccvksnuunppjjjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndWJsY2N2a3NudXVucHBqamp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDgzMzgsImV4cCI6MjA5ODU4NDMzOH0.x7lodJ8KfOgluoZgu74S1gheZjENxCtxSn51YL5aX4M';

async function testLogin() {
  const email = 'test_abc1231783844687440@gmail.com';
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password: 'Password123!' })
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

testLogin();
