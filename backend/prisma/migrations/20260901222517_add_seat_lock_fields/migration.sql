-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "lockExpiresAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;
