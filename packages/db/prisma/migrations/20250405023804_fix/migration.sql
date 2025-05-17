/*
  Warnings:

  - You are about to alter the column `pendingPayout` on the `Validator` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Validator" ALTER COLUMN "pendingPayout" SET DEFAULT 0,
ALTER COLUMN "pendingPayout" SET DATA TYPE INTEGER;
