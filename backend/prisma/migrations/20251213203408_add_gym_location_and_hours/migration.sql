/*
  Warnings:

  - You are about to drop the column `address` on the `Gym` table. All the data in the column will be lost.
  - Added the required column `addressLine` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Gym` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gym" DROP COLUMN "address",
ADD COLUMN     "addressLine" TEXT NOT NULL,
ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "is24Hours" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "openingTime" TEXT;
