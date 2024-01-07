/*
  Warnings:

  - You are about to drop the column `postedById` on the `Job` table. All the data in the column will be lost.
  - Added the required column `postedById` to the `job_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_postedById_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "postedById",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "job_details" ADD COLUMN     "postedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_details" ADD CONSTRAINT "job_details_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
