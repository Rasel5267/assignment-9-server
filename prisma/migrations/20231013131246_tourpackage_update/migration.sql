/*
  Warnings:

  - Added the required column `departureDate` to the `tour-packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `tour-packages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TourPackageStatus" AS ENUM ('UPCOMING', 'ONGOING', 'FINISHED');

-- AlterTable
ALTER TABLE "tour-packages" ADD COLUMN     "departureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "TourPackageStatus" NOT NULL DEFAULT 'UPCOMING';
