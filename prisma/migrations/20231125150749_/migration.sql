/*
  Warnings:

  - You are about to drop the column `gitbub` on the `user` table. All the data in the column will be lost.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `gitbub`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;
