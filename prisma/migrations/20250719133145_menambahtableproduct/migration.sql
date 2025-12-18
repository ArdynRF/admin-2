-- AlterTable
ALTER TABLE "Product" ADD COLUMN "weight" TEXT;
ALTER TABLE "Product" ADD COLUMN "width" TEXT;
ALTER TABLE "Product" ADD COLUMN "yarnNumber" TEXT;

-- CreateTable
CREATE TABLE "Technic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Style" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductTechnics" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductTechnics_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductTechnics_B_fkey" FOREIGN KEY ("B") REFERENCES "Technic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductStyles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductStyles_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductStyles_B_fkey" FOREIGN KEY ("B") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductPatterns" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductPatterns_A_fkey" FOREIGN KEY ("A") REFERENCES "Pattern" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductPatterns_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Technic_name_key" ON "Technic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_name_key" ON "Pattern"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTechnics_AB_unique" ON "_ProductTechnics"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTechnics_B_index" ON "_ProductTechnics"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductStyles_AB_unique" ON "_ProductStyles"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductStyles_B_index" ON "_ProductStyles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductPatterns_AB_unique" ON "_ProductPatterns"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductPatterns_B_index" ON "_ProductPatterns"("B");
