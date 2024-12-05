/*
  Warnings:

  - You are about to drop the column `user_id` on the `bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `user_recommendation_id` on the `bookmark` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRecommendationId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookmark` DROP COLUMN `user_id`,
    DROP COLUMN `user_recommendation_id`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `userRecommendationId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `userRecommendationId` INTEGER NOT NULL,
    `recommendedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userRecommendationId_fkey` FOREIGN KEY (`userRecommendationId`) REFERENCES `Userrecommendation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userRecommendationId_fkey` FOREIGN KEY (`userRecommendationId`) REFERENCES `Userrecommendation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
