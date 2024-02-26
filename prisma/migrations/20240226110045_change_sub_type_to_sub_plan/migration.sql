/*
  Warnings:

  - You are about to drop the column `subscriptionTypeId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `subscription_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subscriptionPlanId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_subscriptionTypeId_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "subscriptionTypeId",
ADD COLUMN     "subscriptionPlanId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "subscription_type";

-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
