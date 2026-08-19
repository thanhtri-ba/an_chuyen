const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const mapReplacements = {
  'model Profile {': 'model Profile {\n  @@map("profiles")',
  'model Wallet {': 'model Wallet {\n  @@map("wallets")',
  'model Loyalty {': 'model Loyalty {\n  @@map("loyalty")',
  'model SearchHistory {': 'model SearchHistory {\n  @@map("search_histories")',
  'model City {': 'model City {\n  @@map("cities")',
  'model Station {': 'model Station {\n  @@map("stations")',
  'model BusAgent {': 'model BusAgent {\n  @@map("bus_agents")',
  'model Trip {': 'model Trip {\n  @@map("trips")',
  'model Promotion {': 'model Promotion {\n  @@map("promotions")',
  'model Ticket {': 'model Ticket {\n  @@map("tickets")'
};

for (const [key, value] of Object.entries(mapReplacements)) {
  schema = schema.replace(key, value);
}

// Add the missing models so they don't get dropped
schema += `\n
model UserAddress {
  id        String   @id @default(uuid())
  @@map("user_addresses")
}

model UserPaymentMethod {
  id        String   @id @default(uuid())
  @@map("user_payment_methods")
}

model FavoriteRoute {
  id        String   @id @default(uuid())
  @@map("favorite_routes")
}
`;

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated with @@map");
