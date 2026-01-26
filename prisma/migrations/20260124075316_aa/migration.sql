/*
  Warnings:

  - Added the required column `billingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "shippingMethod" JSONB NOT NULL,
    "shippingCost" REAL NOT NULL,
    "billingAddress" JSONB NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "downPayment" REAL,
    "remainingPayment" REAL,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDelivery" DATETIME,
    "deliveredAt" DATETIME,
    "cancelledAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("cancelledAt", "deliveredAt", "downPayment", "estimatedDelivery", "id", "orderDate", "orderNumber", "paymentMethod", "paymentStatus", "remainingPayment", "shippingAddress", "shippingCost", "shippingMethod", "status", "subtotal", "tax", "total", "updatedAt", "userId") SELECT "cancelledAt", "deliveredAt", "downPayment", "estimatedDelivery", "id", "orderDate", "orderNumber", "paymentMethod", "paymentStatus", "remainingPayment", "shippingAddress", "shippingCost", "shippingMethod", "status", "subtotal", "tax", "total", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX "Order_status_idx" ON "Order"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
