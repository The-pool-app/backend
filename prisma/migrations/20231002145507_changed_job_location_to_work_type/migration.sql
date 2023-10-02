/*
  Warnings:

  - You are about to drop the column `jobLocation` on the `Job` table. All the data in the column will be lost.
  - Added the required column `company` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workType` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "workType" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobLocation",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "workType" "workType" NOT NULL;

-- DropEnum
DROP TYPE "jobLocation";
