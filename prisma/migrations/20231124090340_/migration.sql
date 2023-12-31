/*
  Warnings:

  - You are about to drop the `article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_categotyId_fkey`;

-- DropTable
DROP TABLE `article`;

-- DropTable
DROP TABLE `categoty`;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `component` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `menuType` VARCHAR(191) NOT NULL,
    `orderNum` INTEGER NOT NULL,
    `pId` INTEGER NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `perms` VARCHAR(191) NOT NULL,
    `isFrame` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `keepAlive` INTEGER NOT NULL,
    `hidden` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
