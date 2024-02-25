/*
  Warnings:

  - Added the required column `businessSector` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "businessSector" TEXT NOT NULL,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
