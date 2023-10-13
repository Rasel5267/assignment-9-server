/*
  Warnings:

  - You are about to drop the column `role` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "role";
