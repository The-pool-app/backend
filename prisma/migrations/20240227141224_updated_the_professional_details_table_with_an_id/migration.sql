/*
  Warnings:

  - You are about to drop the column `professional_detailsUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `professional_detailsUserId` on the `education` table. All the data in the column will be lost.
  - The primary key for the `professional_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `professional_detailsUserId` on the `work_experience` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `professional_details` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "education" DROP CONSTRAINT "education_professional_detailsUserId_fkey";

-- DropForeignKey
ALTER TABLE "work_experience" DROP CONSTRAINT "work_experience_professional_detailsUserId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "professional_detailsUserId",
ADD COLUMN     "professional_detailsId" INTEGER;

-- AlterTable
ALTER TABLE "education" DROP COLUMN "professional_detailsUserId",
ADD COLUMN     "professional_detailsId" INTEGER;

-- AlterTable
ALTER TABLE "professional_details" DROP CONSTRAINT "professional_details_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "professional_details_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "work_experience" DROP COLUMN "professional_detailsUserId",
ADD COLUMN     "professional_detailsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "professional_details_userId_key" ON "professional_details"("userId");

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_professional_detailsId_fkey" FOREIGN KEY ("professional_detailsId") REFERENCES "professional_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_professional_detailsId_fkey" FOREIGN KEY ("professional_detailsId") REFERENCES "professional_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
