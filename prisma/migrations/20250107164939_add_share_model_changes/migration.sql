/*
  Warnings:

  - The primary key for the `Share` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Share` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Share" DROP CONSTRAINT "Share_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Share_pkey" PRIMARY KEY ("fromUserId", "toUserId", "cloudFileName");
