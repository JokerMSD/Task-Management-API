/*
  Warnings:

  - You are about to drop the column `categoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_taskId_fkey";

-- DropIndex
DROP INDEX "User_categoryId_key";

-- DropIndex
DROP INDEX "User_taskId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "categoryId",
DROP COLUMN "taskId";

-- CreateIndex
CREATE UNIQUE INDEX "Category_ownerId_key" ON "Category"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_categoryId_key" ON "Task"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_ownerId_key" ON "Task"("ownerId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
