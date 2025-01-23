/*
  Warnings:

  - The primary key for the `Bill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `BillSplit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BillSplit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Budget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Expenses` table. All the data in the column will be lost.
  - The `id` column on the `Expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UsersGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UsersGroups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saving` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `billId` on the `BillSplit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `groupId` on the `UsersGroups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('INCOME', 'EXPENSE');

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_groupId_fkey";

-- DropForeignKey
ALTER TABLE "BillSplit" DROP CONSTRAINT "BillSplit_billId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Saving" DROP CONSTRAINT "Saving_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsersGroups" DROP CONSTRAINT "UsersGroups_groupId_fkey";

-- AlterTable
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "Bill_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BillSplit" DROP CONSTRAINT "BillSplit_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "billId",
ADD COLUMN     "billId" INTEGER NOT NULL,
ADD CONSTRAINT "BillSplit_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Budget_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_pkey",
DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "type" "ExpenseType" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Groups_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UsersGroups" DROP CONSTRAINT "UsersGroups_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "UsersGroups_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Saving";

-- CreateIndex
CREATE UNIQUE INDEX "UsersGroups_userId_groupId_key" ON "UsersGroups"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "UsersGroups" ADD CONSTRAINT "UsersGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSplit" ADD CONSTRAINT "BillSplit_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
