require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  console.log('Fetching buses...');
  const { data, error } = await supabase.from('buses').select('*');
  console.log('Buses data:', data);
  console.log('Buses error:', error);
}
test();
