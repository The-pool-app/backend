/*
  Warnings:

  - You are about to drop the column `duration` on the `subscription_plan` table. All the data in the column will be lost.
  - Added the required column `expiresIn` to the `subscription_plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_plan" DROP COLUMN "duration",
ADD COLUMN     "expiresIn" TEXT NOT NULL;
