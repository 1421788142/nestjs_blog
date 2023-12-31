/*
  Warnings:

  - Added the required column `roleId` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `roleId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `gender` INTEGER NOT NULL;
