/*
  Warnings:

  - You are about to drop the column `job_detailsJobId` on the `Job` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Job_job_detailsJobId_key";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "job_detailsJobId";
