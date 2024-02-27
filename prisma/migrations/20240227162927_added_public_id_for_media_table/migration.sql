/*
  Warnings:

  - Added the required column `mediaPublicId` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "mediaPublicId" TEXT NOT NULL;
