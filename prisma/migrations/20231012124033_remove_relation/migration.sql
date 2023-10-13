/*
  Warnings:

  - You are about to drop the column `adminEmail` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_adminEmail_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_customerEmail_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "adminEmail",
DROP COLUMN "customerEmail";
