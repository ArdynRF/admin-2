/*
  Warnings:

  - You are about to drop the column `address_line` on the `BillingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `BillingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `BillingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `BillingAddress` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BillingAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "NIK" TEXT,
    "NPWP" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BillingAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BillingAddress" ("id", "is_default", "user_id") SELECT "id", "is_default", "user_id" FROM "BillingAddress";
DROP TABLE "BillingAddress";
ALTER TABLE "new_BillingAddress" RENAME TO "BillingAddress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
