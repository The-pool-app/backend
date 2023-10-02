/*
  Warnings:

  - Changed the type of `jobDuration` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `workType` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobDuration",
ADD COLUMN     "jobDuration" TEXT NOT NULL,
DROP COLUMN "workType",
ADD COLUMN     "workType" TEXT NOT NULL;
