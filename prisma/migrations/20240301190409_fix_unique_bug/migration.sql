/*
  Warnings:

  - Made the column `categoryId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Task_categoryId_key";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "categoryId" SET NOT NULL;
