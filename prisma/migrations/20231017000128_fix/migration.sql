-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerEmail_fkey";

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "customers"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
