/*
  Warnings:

  - You are about to drop the column `amount` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `BillSplit` table. All the data in the column will be lost.
  - You are about to drop the column `split_name` on the `BillSplit` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billId` to the `BillSplit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `splitAmount` to the `BillSplit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BillSplit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BillSplit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "amount",
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BillSplit" DROP COLUMN "amount",
DROP COLUMN "split_name",
ADD COLUMN     "billId" TEXT NOT NULL,
ADD COLUMN     "splitAmount" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSplit" ADD CONSTRAINT "BillSplit_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSplit" ADD CONSTRAINT "BillSplit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
