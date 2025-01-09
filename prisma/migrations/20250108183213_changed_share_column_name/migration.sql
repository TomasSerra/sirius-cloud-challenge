/*
  Warnings:

  - The primary key for the `Share` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cloudFileName` on the `Share` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Share" DROP CONSTRAINT "Share_pkey",
DROP COLUMN "cloudFileName",
ADD COLUMN     "fileId" TEXT NOT NULL,
ADD CONSTRAINT "Share_pkey" PRIMARY KEY ("fromUserId", "toUserId", "fileId");
