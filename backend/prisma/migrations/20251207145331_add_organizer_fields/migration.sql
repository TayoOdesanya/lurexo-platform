-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organizerAvatar" TEXT,
ADD COLUMN     "organizerId" TEXT,
ADD COLUMN     "organizerName" TEXT,
ADD COLUMN     "organizerUsername" TEXT,
ADD COLUMN     "organizerVerified" BOOLEAN NOT NULL DEFAULT false;
