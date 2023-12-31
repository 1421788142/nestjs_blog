/*
  Warnings:

  - You are about to drop the column `nickname` on the `user` table. All the data in the column will be lost.
  - Added the required column `nickName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `nickname`,
    ADD COLUMN `nickName` VARCHAR(191) NOT NULL;
