-- AlterTable
ALTER TABLE "User" ADD COLUMN     "professional_detailsUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professional_detailsUserId_fkey" FOREIGN KEY ("professional_detailsUserId") REFERENCES "professional_details"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
