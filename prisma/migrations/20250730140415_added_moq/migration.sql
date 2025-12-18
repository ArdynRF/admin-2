/*
  Warnings:

  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_barang" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mrp" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "productTypeId" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "material" TEXT,
    "charateristic" TEXT,
    "sample_price" TEXT,
    "moq" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCustomization" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "weight" TEXT,
    "width" TEXT,
    "yarnNumber" TEXT,
    CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("createdAt", "currentStock", "description", "id", "id_barang", "image", "isActive", "mrp", "name", "productTypeId", "updatedAt", "weight", "width", "yarnNumber") SELECT "createdAt", "currentStock", "description", "id", "id_barang", "image", "isActive", "mrp", "name", "productTypeId", "updatedAt", "weight", "width", "yarnNumber" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_id_barang_key" ON "Product"("id_barang");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
