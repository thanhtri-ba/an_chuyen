const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const userId = 'ec097191-ec25-4dd0-84c3-bb1d397f313c'; // ID for admin@anchuyen.com
  const newPassword = 'password123'; // or whatever it was

  console.log(`Attempting to reset password for user ID ${userId} in Supabase Auth...`);

  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: '123456' }
  );

  if (error) {
    console.error("Error updating password:", error);
  } else {
    console.log("Successfully updated password in Supabase Auth to: 123456");
  }
}

main();
