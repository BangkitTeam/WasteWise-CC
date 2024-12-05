-- DropForeignKey
ALTER TABLE `prediction` DROP FOREIGN KEY `prediction_uploadId_fkey`;

-- DropForeignKey
ALTER TABLE `prediction` DROP FOREIGN KEY `prediction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `upload` DROP FOREIGN KEY `upload_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrecommendation` DROP FOREIGN KEY `userrecommendation_craftId_fkey`;

-- DropForeignKey
ALTER TABLE `userrecommendation` DROP FOREIGN KEY `userrecommendation_userId_fkey`;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `user_recommendation_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Upload` ADD CONSTRAINT `Upload_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prediction` ADD CONSTRAINT `Prediction_uploadId_fkey` FOREIGN KEY (`uploadId`) REFERENCES `Upload`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prediction` ADD CONSTRAINT `Prediction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Userrecommendation` ADD CONSTRAINT `Userrecommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Userrecommendation` ADD CONSTRAINT `Userrecommendation_craftId_fkey` FOREIGN KEY (`craftId`) REFERENCES `Craft`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `craft` RENAME INDEX `craft_title_key` TO `Craft_title_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_email_key` TO `User_email_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_username_key` TO `User_username_key`;
