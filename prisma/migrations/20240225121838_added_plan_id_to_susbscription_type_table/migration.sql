/*
  Warnings:

  - Added the required column `planID` to the `subscription_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_type" ADD COLUMN     "planID" TEXT NOT NULL;
