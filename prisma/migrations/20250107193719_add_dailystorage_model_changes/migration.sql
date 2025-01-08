/*
  Warnings:

  - The primary key for the `DailyStorage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DailyStorage" DROP CONSTRAINT "DailyStorage_pkey",
ALTER COLUMN "date" SET DATA TYPE TEXT,
ADD CONSTRAINT "DailyStorage_pkey" PRIMARY KEY ("userId", "date");
