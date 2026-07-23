-- TaskFlow Enterprise Project Management System
-- Database Migration (V3__auth_security.sql)
-- Additional Security & Authentication Tables

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table: otps
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `otps` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `type` ENUM('LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'TWO_FACTOR') NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `attempts_count` INT NOT NULL DEFAULT 0,
  `max_attempts` INT NOT NULL DEFAULT 3,
  `verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_otp_user_type` (`user_id`, `type`),
  INDEX `idx_otp_code` (`otp_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: password_history
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_history` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ph_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_ph_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: user_sessions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `refresh_token_id` BIGINT NULL,
  `device_name` VARCHAR(100) NULL,
  `device_type` VARCHAR(50) NULL,
  `operating_system` VARCHAR(100) NULL,
  `browser` VARCHAR(100) NULL,
  `ip_address` VARCHAR(45) NULL,
  `last_accessed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_us_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_us_token` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_tokens` (`id`) ON DELETE SET NULL,
  INDEX `idx_us_user` (`user_id`),
  INDEX `idx_us_revoked` (`revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: security_events
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `security_events` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `details` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_se_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_se_user` (`user_id`),
  INDEX `idx_se_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: token_blacklist
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `token_blacklist` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `blacklisted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  INDEX `idx_tb_token` (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update users table with account lock columns if not present
ALTER TABLE `users`
  ADD COLUMN `failed_login_attempts` INT NOT NULL DEFAULT 0,
  ADD COLUMN `lock_time` DATETIME NULL;

SET FOREIGN_KEY_CHECKS = 1;
