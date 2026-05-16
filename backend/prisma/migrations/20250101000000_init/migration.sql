-- CreateEnum-like columns are represented as native MySQL ENUM values.

CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `role` ENUM('CLIENT', 'MUSICIAN') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `users_login_key`(`login`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `musicians` (
  `userId` INTEGER NOT NULL,
  `bio` TEXT NULL,
  `genre` VARCHAR(191) NULL,
  `instrument` VARCHAR(191) NULL,
  `experience` TEXT NULL,
  `education` TEXT NULL,
  `portfolioUrl` VARCHAR(191) NULL,

  PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `clients` (
  `userId` INTEGER NOT NULL,
  `companyName` VARCHAR(191) NULL,

  PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `advertisements` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `clientId` INTEGER NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `eventDate` DATETIME(3) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `budget` DECIMAL(10, 2) NOT NULL,
  `requiredGenre` VARCHAR(191) NOT NULL,
  `requiredInstrument` VARCHAR(191) NOT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'CLOSED') NOT NULL DEFAULT 'DRAFT',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `advertisements_clientId_idx`(`clientId`),
  INDEX `advertisements_status_idx`(`status`),
  INDEX `advertisements_requiredGenre_idx`(`requiredGenre`),
  INDEX `advertisements_requiredInstrument_idx`(`requiredInstrument`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `responses` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `musicianId` INTEGER NOT NULL,
  `advertisementId` INTEGER NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

  UNIQUE INDEX `responses_musicianId_advertisementId_key`(`musicianId`, `advertisementId`),
  INDEX `responses_advertisementId_idx`(`advertisementId`),
  INDEX `responses_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `message` VARCHAR(191) NOT NULL,
  `type` ENUM('NEW_RESPONSE', 'RESPONSE_ACCEPTED', 'RESPONSE_REJECTED', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
  `isRead` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `notifications_userId_idx`(`userId`),
  INDEX `notifications_isRead_idx`(`isRead`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `musicians` ADD CONSTRAINT `musicians_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `clients` ADD CONSTRAINT `clients_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `advertisements` ADD CONSTRAINT `advertisements_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `responses` ADD CONSTRAINT `responses_musicianId_fkey` FOREIGN KEY (`musicianId`) REFERENCES `musicians`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `responses` ADD CONSTRAINT `responses_advertisementId_fkey` FOREIGN KEY (`advertisementId`) REFERENCES `advertisements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
