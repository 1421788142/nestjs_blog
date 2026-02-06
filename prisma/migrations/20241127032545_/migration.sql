-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `nickName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `gender` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `userId` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` VARCHAR(191) NULL,
    `extend1` VARCHAR(191) NULL,
    `extend2` VARCHAR(191) NULL,
    `extend3` VARCHAR(191) NULL,

    UNIQUE INDEX `user_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `component` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `menuType` VARCHAR(191) NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `pId` INTEGER NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `perms` VARCHAR(191) NOT NULL,
    `isFrame` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `keepAlive` INTEGER NOT NULL,
    `hidden` INTEGER NOT NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` VARCHAR(191) NULL,
    `extend1` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `remark` VARCHAR(191) NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` VARCHAR(191) NULL,
    `extend1` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generalParameters` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `valueType` VARCHAR(191) NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `remark` VARCHAR(191) NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` VARCHAR(191) NULL,
    `extend1` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `uploadFile` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fileId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `keywords` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extend` VARCHAR(191) NULL,
    `extend1` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `projectName` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `status` INTEGER NOT NULL,
    `remark` VARCHAR(191) NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` TEXT NULL,
    `extend1` VARCHAR(191) NULL,
    `extend2` VARCHAR(191) NULL,
    `extend3` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `directory` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `directoryName` VARCHAR(191) NOT NULL,
    `directoryId` VARCHAR(191) NOT NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 50,
    `projectId` VARCHAR(191) NOT NULL,
    `pId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `cUserId` VARCHAR(191) NOT NULL,
    `cTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mUserId` VARCHAR(191) NULL,
    `mTime` DATETIME(3) NULL,
    `extend` TEXT NULL,
    `extend1` VARCHAR(191) NULL,
    `extend2` VARCHAR(191) NULL,
    `extend3` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
