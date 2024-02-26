/*
  Warnings:

  - You are about to drop the column `subscriptionPlanId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `subscription_plan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subscriptionTypeId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_subscriptionPlanId_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "subscriptionPlanId",
ADD COLUMN     "subscriptionTypeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "subscription_plan";

-- CreateTable
CREATE TABLE "subscription_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiresIn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "subscription_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
