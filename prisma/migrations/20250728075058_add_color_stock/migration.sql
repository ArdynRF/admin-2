-- CreateTable
CREATE TABLE "ProductColorStock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    CONSTRAINT "ProductColorStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductColorStock_productId_color_key" ON "ProductColorStock"("productId", "color");
