-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_professional_detailsUserId_fkey";

-- DropIndex
DROP INDEX "User_professional_detailsUserId_key";

-- AddForeignKey
ALTER TABLE "professional_details" ADD CONSTRAINT "professional_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
