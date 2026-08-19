import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const schedules = await prisma.tripSchedule.findMany({
    select: {
      id: true,
      departureTime: true,
      arrivalTime: true,
      _count: { select: { bookings: true } },
      trip: {
        select: {
          route: {
            select: { departureCity: { select: { name: true } }, arrivalCity: { select: { name: true } } },
          },
        },
      },
    },
  });

  const now = new Date();
  const stale = schedules.filter((s) => s.departureTime < now);

  if (stale.length === 0) {
    console.log('All trip schedules are already in the future. Nothing to do.');
    return;
  }

  console.log(`${stale.length}/${schedules.length} schedule(s) are in the past (now: ${now.toISOString()}).\n`);

  let updated = 0;
  let skipped = 0;

  for (const s of stale) {
    const label = `${s.trip.route.departureCity.name} -> ${s.trip.route.arrivalCity.name}`;

    if (s._count.bookings > 0) {
      console.log(`SKIP  ${label} (${s.id}) — has ${s._count.bookings} real booking(s), left untouched`);
      skipped++;
      continue;
    }

    const diffDays = Math.ceil((now.getTime() - s.departureTime.getTime()) / DAY_MS);
    const newDeparture = new Date(s.departureTime.getTime() + diffDays * DAY_MS);
    const newArrival = new Date(s.arrivalTime.getTime() + diffDays * DAY_MS);

    console.log(
      `${dryRun ? 'WOULD SHIFT' : 'SHIFT'} ${label} (${s.id}) +${diffDays}d: ` +
        `${s.departureTime.toISOString()} -> ${newDeparture.toISOString()}`,
    );

    if (!dryRun) {
      await prisma.tripSchedule.update({
        where: { id: s.id },
        data: { departureTime: newDeparture, arrivalTime: newArrival },
      });
    }
    updated++;
  }

  console.log(`\n${dryRun ? 'Would update' : 'Updated'} ${updated} schedule(s), skipped ${skipped} (had bookings).`);
  if (dryRun) console.log('Dry run only — no changes written. Re-run without --dry-run to apply.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
