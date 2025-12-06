/*
  Warnings:

  - You are about to drop the column `listing_price` on the `ticket_listings` table. All the data in the column will be lost.
  - You are about to drop the column `original_price` on the `ticket_listings` table. All the data in the column will be lost.
  - You are about to drop the column `service_fee` on the `ticket_listings` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payment_intent_id` on the `ticket_listings` table. All the data in the column will be lost.
  - Added the required column `price` to the `ticket_listings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResaleCapType" AS ENUM ('FACE_VALUE_ONLY', 'FACE_VALUE_PLUS_FEES', 'PERCENTAGE_CAP', 'NO_CAP', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "public"."ticket_listings" DROP CONSTRAINT "ticket_listings_seller_id_fkey";

-- DropIndex
DROP INDEX "public"."ticket_listings_stripe_payment_intent_id_key";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "allowResale" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "resaleCapType" "ResaleCapType" NOT NULL DEFAULT 'PERCENTAGE_CAP',
ADD COLUMN     "resaleCapValue" INTEGER DEFAULT 110;

-- AlterTable
ALTER TABLE "ticket_listings" DROP COLUMN "listing_price",
DROP COLUMN "original_price",
DROP COLUMN "service_fee",
DROP COLUMN "stripe_payment_intent_id",
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "price" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ticket_listings_ticket_id_idx" ON "ticket_listings"("ticket_id");

-- AddForeignKey
ALTER TABLE "ticket_listings" ADD CONSTRAINT "ticket_listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
