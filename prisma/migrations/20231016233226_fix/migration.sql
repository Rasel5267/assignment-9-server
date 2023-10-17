/*
  Warnings:

  - You are about to drop the column `customerId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `customerEmail` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerId",
ADD COLUMN     "customerEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerId",
ADD COLUMN     "customerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "customers"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
