/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,status]` on the table `Negotiation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Negotiation_userId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Negotiation_userId_productId_status_key" ON "Negotiation"("userId", "productId", "status");
