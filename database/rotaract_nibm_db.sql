-- ============================================================================
-- SQL SCHEMA FOR ROTARACT CLUB OF NIBM KANDY MANAGEMENT SYSTEM
-- Compatible with phpMyAdmin, MySQL 5.7+, MySQL 8.0+, MariaDB
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";

-- ----------------------------------------------------------------------------
-- Database: `rotaract_nibm_db`
-- ----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `rotaract_nibm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rotaract_nibm_db`;

-- ============================================================================
-- Table Structure: `avenues`
-- Stores Rotary Avenues of Service
-- ============================================================================
DROP TABLE IF EXISTS `volunteer_logs`;
DROP TABLE IF EXISTS `event_registrations`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `avenues`;
DROP TABLE IF EXISTS `contact_inquiries`;

CREATE TABLE `avenues` (
  `avenue_id` INT(11) NOT NULL AUTO_INCREMENT,
  `avenue_name` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `director_name` VARCHAR(150) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`avenue_id`),
  UNIQUE KEY `idx_avenue_name` (`avenue_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `users`
-- Stores Member, Director, and Administrator Profiles
-- ============================================================================
CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `nibm_index_no` VARCHAR(50) DEFAULT NULL,
  `role` ENUM('Admin', 'Director', 'Member', 'Guest') NOT NULL DEFAULT 'Member',
  `contact_no` VARCHAR(30) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `idx_user_email` (`email`),
  UNIQUE KEY `idx_user_index` (`nibm_index_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `events`
-- Stores Scheduled and Past Club Initiatives
-- ============================================================================
CREATE TABLE `events` (
  `event_id` INT(11) NOT NULL AUTO_INCREMENT,
  `avenue_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `event_date` DATETIME NOT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `max_capacity` INT(11) NOT NULL DEFAULT 100,
  `registered_count` INT(11) NOT NULL DEFAULT 0,
  `status` ENUM('Upcoming', 'Live', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `fk_events_avenue` (`avenue_id`),
  CONSTRAINT `fk_events_avenue` FOREIGN KEY (`avenue_id`) REFERENCES `avenues` (`avenue_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `event_registrations`
-- Stores Attendee Bookings and Verifiable Digital Event Passes
-- ============================================================================
CREATE TABLE `event_registrations` (
  `registration_id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `attendee_name` VARCHAR(150) NOT NULL,
  `attendee_email` VARCHAR(120) NOT NULL,
  `contact_no` VARCHAR(30) DEFAULT NULL,
  `pass_code` VARCHAR(60) NOT NULL,
  `registered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `checkin_status` ENUM('Confirmed', 'Checked-In', 'No-Show', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  `checkin_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `idx_pass_code` (`pass_code`),
  KEY `fk_reg_event` (`event_id`),
  KEY `fk_reg_user` (`user_id`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `volunteer_logs`
-- Stores Community Service Hours for District Citations
-- ============================================================================
CREATE TABLE `volunteer_logs` (
  `log_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `event_id` INT(11) DEFAULT NULL,
  `activity_name` VARCHAR(200) NOT NULL,
  `hours_logged` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `description` TEXT DEFAULT NULL,
  `verification_status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `verified_by` INT(11) DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `fk_vol_user` (`user_id`),
  KEY `fk_vol_event` (`event_id`),
  KEY `fk_vol_verifier` (`verified_by`),
  CONSTRAINT `fk_vol_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vol_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_vol_verifier` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `projects`
-- Stores Club Initiative Portfolio & Financial Records
-- ============================================================================
CREATE TABLE `projects` (
  `project_id` INT(11) NOT NULL AUTO_INCREMENT,
  `avenue_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `impact_summary` TEXT NOT NULL,
  `funds_raised` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `featured_image` VARCHAR(255) DEFAULT '/rotaract.png',
  `status` ENUM('Planning', 'Active', 'Completed') NOT NULL DEFAULT 'Completed',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `fk_proj_avenue` (`avenue_id`),
  CONSTRAINT `fk_proj_avenue` FOREIGN KEY (`avenue_id`) REFERENCES `avenues` (`avenue_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `contact_inquiries`
-- Stores General Inquiries, Membership Applications & Partner Requests
-- ============================================================================
CREATE TABLE `contact_inquiries` (
  `inquiry_id` INT(11) NOT NULL AUTO_INCREMENT,
  `inquiry_type` ENUM('General', 'Membership', 'Partner', 'Volunteer') NOT NULL DEFAULT 'General',
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inquiry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA INITIALIZATION
-- ============================================================================

INSERT INTO `avenues` (`avenue_id`, `avenue_name`, `description`, `director_name`) VALUES
(1, 'Community Service', 'Focuses on addressing health, social, environmental, and humanitarian needs in local communities.', 'D.A. Kulasinghe'),
(2, 'Club Service', 'Strengthens fellowship, leadership development, member engagement, and internal club administration.', 'H.E. Gunasekara'),
(3, 'Professional Development', 'Enhances vocational competencies, career preparedness, and technical skill-building workshops.', 'Y.V. Bandara'),
(4, 'International Service', 'Fosters global goodwill, cultural understanding, and cross-border international club collaborations.', 'V. Karunaratne');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `nibm_index_no`, `role`, `contact_no`, `created_at`) VALUES
(1, 'H.E. Gunasekara', 'president@rt-nibm.org', SHA2('Admin@2025', 256), 'KADSE25.2F-030', 'Admin', '+94 77 123 4567', '2025-01-10 08:00:00'),
(2, 'Y.V. Bandara', 'secretary@rt-nibm.org', SHA2('Secretary@2025', 256), 'KADSE25.2F-025', 'Admin', '+94 71 987 6543', '2025-01-12 09:30:00'),
(3, 'D.A. Kulasinghe', 'community@rt-nibm.org', SHA2('Director@2025', 256), 'KADSE25.2F-034', 'Director', '+94 76 555 1234', '2025-01-15 10:00:00'),
(4, 'V. Karunaratne', 'member@rt-nibm.org', SHA2('Member@2025', 256), 'KADSE25.2F-006', 'Member', '+94 75 444 8899', '2025-02-01 11:20:00');

INSERT INTO `events` (`event_id`, `avenue_id`, `title`, `description`, `event_date`, `venue`, `max_capacity`, `registered_count`, `status`) VALUES
(1, 1, 'Blood Donation & Health Screening Camp 2025', 'Annual flagship humanitarian initiative in collaboration with Kandy National Blood Transfusion Service.', '2025-10-15 09:00:00', 'NIBM Main Auditorium, Kandy Centre', 150, 32, 'Upcoming'),
(2, 3, 'CodeCraft Full-Stack Hackathon 2025', '24-hour national hackathon for undergraduates solving real-world community development problems.', '2025-11-05 08:00:00', 'NIBM Computing Lab 01 & Virtual Sandbox', 100, 65, 'Upcoming'),
(3, 1, 'Green Roots Reforestation Drive', 'Planting over 500 indigenous trees in the Central Highlands to preserve watersheds.', '2025-08-28 07:30:00', 'Hantana Mountain Range Nature Reserve, Kandy', 80, 80, 'Upcoming');

INSERT INTO `event_registrations` (`registration_id`, `event_id`, `user_id`, `attendee_name`, `attendee_email`, `contact_no`, `pass_code`, `registered_at`, `checkin_status`) VALUES
(1, 1, 4, 'V. Karunaratne', 'member@rt-nibm.org', '+94 75 444 8899', 'RT-NIBM-1-E92A', '2025-08-01 14:20:00', 'Confirmed');

INSERT INTO `volunteer_logs` (`log_id`, `user_id`, `event_id`, `activity_name`, `hours_logged`, `description`, `verification_status`, `verified_by`, `submitted_at`) VALUES
(1, 4, 3, 'Tree Planting & Watershed Maintenance', 6.50, 'Assisted in soil preparation, transport of saplings, and coordinate volunteer sign-in.', 'Approved', 1, '2025-07-20 16:00:00'),
(2, 4, 2, 'Hackathon Technical Infrastructure Setup', 4.00, 'Configured local networking switches and verified participant developer workstations.', 'Approved', 2, '2025-07-25 18:30:00');

INSERT INTO `projects` (`project_id`, `avenue_id`, `title`, `impact_summary`, `funds_raised`, `featured_image`, `status`) VALUES
(1, 1, 'Project Hope: Clean Water for Rural Schools', 'Installed water purification filtration units in 3 underprivileged schools in Kandy district.', 150000.00, '/rotaract.png', 'Completed'),
(2, 3, 'Career Launchpad: AI & Software Engineering Series', 'Conducted 4 industry seminars with keynote speakers from top tech firms impacting 250+ students.', 45000.00, '/rotaract.png', 'Completed');

COMMIT;
