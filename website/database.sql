-- ==============================================================================
-- GEN-Z WORKS - MySQL Database Schema & Table Definition
-- Table Name: client_feedback
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ==============================================================================

-- 1. Create the database (if not already existing)
CREATE DATABASE IF NOT EXISTS `genz_works_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `genz_works_db`;

-- 2. Create the `client_feedback` table
CREATE TABLE IF NOT EXISTS `client_feedback` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique feedback submission ID',
  `name` VARCHAR(100) NOT NULL COMMENT 'Client full name',
  `email` VARCHAR(150) NOT NULL COMMENT 'Client email address',
  `service_interest` ENUM(
      'Web Development',
      'College & Academic Projects',
      'Poster & Graphic Design',
      'Video Editing & Motion Graphics',
      'Content Writing & Copywriting',
      'Content Creation',
      'Video Editing',
      'Poster Design'
  ) NOT NULL COMMENT 'Selected core digital agency service',
  `message` TEXT NOT NULL COMMENT 'Detailed inquiry, scope, or feedback',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IPv4 or IPv6 client origin',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT 'Browser user agent string for telemetry',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Submission timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_service` (`service_interest`),
  KEY `idx_email` (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Client inquiries and service feedback for GEN-Z''WORKS';

-- ==============================================================================
-- 3. Sample Verification Queries
-- ==============================================================================

-- Sample Insert Demonstration:
INSERT INTO `client_feedback` (`name`, `email`, `service_interest`, `message`, `ip_address`, `user_agent`)
VALUES (
  'Elena Rostova',
  'elena.rostova@techcorp.io',
  'Web Development',
  'We would like to hire GEN-Z WORKS to build an enterprise web application with real-time analytics.',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
);

-- Query All Submissions ordered by newest first:
SELECT 
  `id`,
  `name`,
  `email`,
  `service_interest`,
  `message`,
  DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i') AS `submitted_time`
FROM `client_feedback`
ORDER BY `created_at` DESC;

-- Filter Submissions by Service Category:
SELECT * FROM `client_feedback` 
WHERE `service_interest` = 'Web Development'
ORDER BY `created_at` DESC;
