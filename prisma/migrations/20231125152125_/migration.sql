-- AlterTable
ALTER TABLE `user` ADD COLUMN `remark` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `orderNum` INTEGER NOT NULL,
    `remark` VARCHAR(191) NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
