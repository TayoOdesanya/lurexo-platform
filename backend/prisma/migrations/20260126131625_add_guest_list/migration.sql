-- CreateEnum
CREATE TYPE "GuestListStatus" AS ENUM ('INVITED', 'CHECKED_IN', 'CANCELLED');

-- CreateTable
CREATE TABLE "guest_list_entries" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "status" "GuestListStatus" NOT NULL DEFAULT 'INVITED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_list_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_list_entries_event_id_idx" ON "guest_list_entries"("event_id");

-- AddForeignKey
ALTER TABLE "guest_list_entries" ADD CONSTRAINT "guest_list_entries_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
