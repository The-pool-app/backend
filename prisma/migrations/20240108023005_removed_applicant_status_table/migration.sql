/*
  Warnings:

  - You are about to drop the column `statusId` on the `professional_details` table. All the data in the column will be lost.
  - You are about to drop the `applicant_status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `professional_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professional_details" DROP COLUMN "statusId",
ADD COLUMN     "status" "ApplicantStatus" NOT NULL;

-- DropTable
DROP TABLE "applicant_status";
