import { extractSearchIntent, searchTrips } from './src/modules/ai/ai.tools';

async function test() {
  const query = "Tôi muốn đi từ Sài Gòn lên Đà Lạt tối mai, xe giường nằm khoảng 300k";
  console.log("Query:", query);
  
  const intent = await extractSearchIntent(query);
  console.log("Parsed Intent:", intent);
  
  const trips = await searchTrips(intent);
  console.log("Ranked Trips:", JSON.stringify(trips, null, 2));
}

test();
