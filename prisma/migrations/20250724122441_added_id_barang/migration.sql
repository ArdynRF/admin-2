/*
  Warnings:

  - A unique constraint covering the columns `[id_barang]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "id_barang" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_barang_key" ON "Product"("id_barang");
