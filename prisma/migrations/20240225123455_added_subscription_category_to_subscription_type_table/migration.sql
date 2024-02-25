/*
  Warnings:

  - Added the required column `category` to the `subscription_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_type" ADD COLUMN     "category" "UserRole" NOT NULL;
