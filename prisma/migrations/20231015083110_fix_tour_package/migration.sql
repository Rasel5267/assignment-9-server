/*
  Warnings:

  - Added the required column `availableSpots` to the `tour-packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookedSpots` to the `tour-packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCapacity` to the `tour-packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tour-packages" ADD COLUMN     "activities" TEXT[],
ADD COLUMN     "availableSpots" INTEGER NOT NULL,
ADD COLUMN     "bookedSpots" INTEGER NOT NULL,
ADD COLUMN     "totalCapacity" INTEGER NOT NULL;
