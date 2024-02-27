-- DropForeignKey
ALTER TABLE "professional_details" DROP CONSTRAINT "professional_details_userId_fkey";

-- AlterTable
ALTER TABLE "professional_details" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "professional_details" ADD CONSTRAINT "professional_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
