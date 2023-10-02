/*
  Warnings:

  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - Added the required column `companyLocation` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDescription` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDuration` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobLocation` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postedById` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "jobDuration" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "jobLocation" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "description",
ADD COLUMN     "companyLocation" TEXT NOT NULL,
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "jobDuration" "jobDuration" NOT NULL,
ADD COLUMN     "jobLocation" "jobLocation" NOT NULL,
ADD COLUMN     "jobType" TEXT NOT NULL,
ADD COLUMN     "postedById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "jobRole" TEXT[],
ADD COLUMN     "phoneNumber" TEXT;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
