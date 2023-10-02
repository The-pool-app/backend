/*
  Warnings:

  - Added the required column `experience` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "experience" TEXT NOT NULL;
