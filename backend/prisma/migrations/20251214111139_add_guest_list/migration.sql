-- CreateEnum
CREATE TYPE "GuestCategory" AS ENUM ('VIP', 'INDUSTRY', 'COMP', 'STAFF', 'PRESS', 'SPONSOR');

-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('INVITED', 'CONFIRMED', 'DECLINED', 'CHECKED_IN');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "enable_guest_list" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "max_guests" INTEGER;

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "category" "GuestCategory" NOT NULL DEFAULT 'VIP',
    "status" "GuestStatus" NOT NULL DEFAULT 'INVITED',
    "ticket_code" TEXT NOT NULL,
    "ticket_link" TEXT NOT NULL,
    "notes" TEXT,
    "invited_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),
    "checked_in_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_ticket_code_key" ON "guests"("ticket_code");

-- CreateIndex
CREATE INDEX "guests_event_id_idx" ON "guests"("event_id");

-- CreateIndex
CREATE INDEX "guests_email_idx" ON "guests"("email");

-- CreateIndex
CREATE INDEX "guests_ticket_code_idx" ON "guests"("ticket_code");

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
