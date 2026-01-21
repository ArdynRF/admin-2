-- CreateTable
CREATE TABLE "ProductSample" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "color_sample" TEXT NOT NULL,
    "stock_sample" INTEGER NOT NULL,
    CONSTRAINT "ProductSample_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSample_productId_color_sample_key" ON "ProductSample"("productId", "color_sample");
