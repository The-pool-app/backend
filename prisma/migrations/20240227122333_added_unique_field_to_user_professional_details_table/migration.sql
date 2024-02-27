/*
  Warnings:

  - A unique constraint covering the columns `[professional_detailsUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "professional_details" DROP CONSTRAINT "professional_details_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "User_professional_detailsUserId_key" ON "User"("professional_detailsUserId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professional_detailsUserId_fkey" FOREIGN KEY ("professional_detailsUserId") REFERENCES "professional_details"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
