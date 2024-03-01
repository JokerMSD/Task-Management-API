/*
  Warnings:

  - Made the column `ownerId` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Category_ownerId_key";

-- DropIndex
DROP INDEX "Task_ownerId_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "ownerId" SET NOT NULL;
