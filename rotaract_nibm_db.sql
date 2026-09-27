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
DROP TABLE IF EXISTS `cancelled_passes`;
DROP TABLE IF EXISTS `unapproved_emails`;
DROP TABLE IF EXISTS `gallery`;
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
  `status` ENUM('Pending Approval', 'Active', 'Rejected') NOT NULL DEFAULT 'Pending Approval',
  `membership_fee` INT(11) NOT NULL DEFAULT 3000,
  `fee_status` ENUM('Pending Verification', 'Paid', 'Unpaid') NOT NULL DEFAULT 'Pending Verification',
  `service_hours` DECIMAL(5,1) NOT NULL DEFAULT 0.0,
  `approved_by` VARCHAR(150) DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `contact_no` VARCHAR(30) DEFAULT NULL,
  `is_email_verified` TINYINT(1) NOT NULL DEFAULT 0,
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
-- Stores Active Attendee Bookings and Verifiable Digital Event Passes
-- Note: When a pass is cancelled, it is transferred to `cancelled_passes`
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
  `checkin_status` ENUM('Confirmed', 'Checked-In', 'No-Show') NOT NULL DEFAULT 'Confirmed',
  `checkin_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `idx_pass_code` (`pass_code`),
  KEY `fk_reg_event` (`event_id`),
  KEY `fk_reg_user` (`user_id`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `cancelled_passes`
-- Dedicated Table for Cancelled Event Passes & Re-Registration Requests
-- ============================================================================
CREATE TABLE `cancelled_passes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pass_code` VARCHAR(60) NOT NULL,
  `event_id` INT(11) NOT NULL,
  `event_title` VARCHAR(200) NOT NULL,
  `attendee_name` VARCHAR(150) NOT NULL,
  `attendee_email` VARCHAR(120) NOT NULL,
  `contact_no` VARCHAR(30) DEFAULT NULL,
  `cancelled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Cancelled', 'Re-Registration Requested', 'Re-Registration Approved', 'Re-Registration Declined') NOT NULL DEFAULT 'Cancelled',
  `request_reason` TEXT DEFAULT NULL,
  `board_decision_by` VARCHAR(150) DEFAULT NULL,
  `board_decision_at` DATETIME DEFAULT NULL,
  `board_comment` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cancelled_email` (`attendee_email`),
  KEY `idx_cancelled_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `unapproved_emails`
-- Dedicated Table for Non-Approved / Unverified Emails & Candidate Log
-- ============================================================================
CREATE TABLE `unapproved_emails` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(120) NOT NULL,
  `full_name` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `attempt_type` ENUM('Membership Application', 'OTP Unverified', 'Invalid Domain Attempt', 'Rejected Member') NOT NULL DEFAULT 'Membership Application',
  `status` ENUM('Pending Verification', 'Pending Board Approval', 'Approved', 'Rejected', 'Invalid', 'Expired') NOT NULL DEFAULT 'Pending Board Approval',
  `fee_amount` INT(11) NOT NULL DEFAULT 3000,
  `otp_code` VARCHAR(10) DEFAULT NULL,
  `code_expires_at` DATETIME DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_unapproved_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table Structure: `gallery`
-- Stores Club Photo Gallery Uploads Managed by Executive Board
-- ============================================================================
CREATE TABLE `gallery` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Club Service',
  `img` VARCHAR(500) NOT NULL,
  `uploaded_by` VARCHAR(150) DEFAULT 'Executive Board',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
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

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `nibm_index_no`, `role`, `status`, `membership_fee`, `fee_status`, `service_hours`, `contact_no`, `created_at`) VALUES
(1, 'Rtr. Dilshika Rasalingam', 'president@rt-nibm.org', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'KADSE24.1F-001', 'Admin', 'Active', 3000, 'Paid', 65.0, '+94 77 123 4567', '2024-07-01 08:00:00'),
(2, 'Rtr. Sankalpa Bandara', 'vp@rt-nibm.org', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'KADSE24.1F-015', 'Admin', 'Active', 3000, 'Paid', 52.5, '+94 71 987 6543', '2024-07-01 08:00:00'),
(3, 'Rtr. Hasandie Wijerathne', 'secretary@rt-nibm.org', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'KADSE24.2F-008', 'Admin', 'Active', 3000, 'Paid', 48.0, '+94 76 555 1234', '2024-07-01 08:00:00'),
(4, 'Rtr. Dinidu Kulasinghe', 'community@rt-nibm.org', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'KADSE25.2F-034', 'Director', 'Active', 3000, 'Paid', 42.0, '+94 77 444 8899', '2024-07-01 08:00:00'),
(5, 'Rtr. V. Karunaratne', 'member@rt-nibm.org', '5600376e863d2f57a053518f324ad3840b0bc2348b573af281a7b7cbe7a228c6', 'KADSE25.2F-006', 'Member', 'Active', 3000, 'Paid', 18.5, '+94 75 444 8899', '2025-02-01 11:20:00'),
(6, 'Kasun Jayasuriya', 'kasun.jayasuriya@gmail.com', '5600376e863d2f57a053518f324ad3840b0bc2348b573af281a7b7cbe7a228c6', 'KADSE26.1F-042', 'Member', 'Pending Approval', 3000, 'Pending Verification', 0.0, '+94 77 987 6543', '2026-09-24 14:30:00'),
(7, 'Nimasha Wickramasinghe', 'nimasha.wick@gmail.com', '5600376e863d2f57a053518f324ad3840b0bc2348b573af281a7b7cbe7a228c6', 'KABIT26.2F-088', 'Member', 'Pending Approval', 3000, 'Pending Verification', 0.0, '+94 71 333 9922', '2026-09-25 09:15:00');

INSERT INTO `events` (`event_id`, `avenue_id`, `title`, `description`, `event_date`, `venue`, `max_capacity`, `registered_count`, `status`) VALUES
(1, 2, 'Rotaract Hope: Cancer Awareness Run 2026', 'A 5km charity run and community health awareness walk to support cancer treatment facilities, promote early detection, and inspire healthy living.', '2026-10-18 06:30:00', 'Kandy Lake Round & NIBM Campus Grounds', 150, 42, 'Upcoming'),
(2, 1, 'Rotaract Rugby Clash 2026', 'The ultimate 7-a-side inter-avenue rugby championship celebrating youth athletic spirit, teamwork, and high-energy fellowship.', '2026-11-08 08:00:00', 'Bogambara Stadium, Kandy', 200, 68, 'Upcoming'),
(3, 3, 'Urgent Youth Leadership Summit 2026', 'High-intensity leadership colloquium on sustainable community tech innovation and youth leadership.', DATE_ADD(NOW(), INTERVAL 26 HOUR), 'NIBM Innovation Auditorium, Kandy', 80, 24, 'Upcoming');

INSERT INTO `event_registrations` (`registration_id`, `event_id`, `user_id`, `attendee_name`, `attendee_email`, `contact_no`, `pass_code`, `registered_at`, `checkin_status`) VALUES
(1, 1, 5, 'V. Karunaratne', 'member@rt-nibm.org', '+94 75 444 8899', 'RT-NIBM-1-E92A', '2025-08-01 14:20:00', 'Confirmed'),
(2, 1, NULL, 'Test Student Volunteer', 'teststudent@nibm.lk', '+94 77 999 8888', 'RT-NIBM-1-1200', '2026-08-19 09:45:54', 'Confirmed'),
(3, 1, NULL, 'Dinidu Kulasinghe', 'dinidukulasinghe01@gmail.com', '+94 78 781 1976', 'RT-NIBM-1-D831', '2026-08-19 09:46:46', 'Confirmed');

INSERT INTO `cancelled_passes` (`id`, `pass_code`, `event_id`, `event_title`, `attendee_name`, `attendee_email`, `contact_no`, `cancelled_at`, `status`, `request_reason`) VALUES
(1, 'RT-NIBM-1-C98F', 1, 'Rotaract Hope: Cancer Awareness Run 2026', 'Saman Kumara', 'saman.kumara@gmail.com', '+94 77 111 2233', '2026-09-20 10:15:00', 'Re-Registration Requested', 'I accidentally cancelled due to exam clash, but exam was moved. Please allow me to re-register.'),
(2, 'RT-NIBM-2-B411', 2, 'Rotaract Rugby Clash 2026', 'Praveen Silva', 'praveen.silva@gmail.com', '+94 71 888 7766', '2026-09-22 14:40:00', 'Cancelled', NULL);

INSERT INTO `unapproved_emails` (`id`, `email`, `full_name`, `phone`, `attempt_type`, `status`, `fee_amount`, `otp_code`, `code_expires_at`, `details`, `created_at`) VALUES
(1, 'kasun.jayasuriya@gmail.com', 'Kasun Jayasuriya', '+94 77 987 6543', 'Membership Application', 'Pending Board Approval', 3000, '839201', '2026-09-24 15:15:00', 'Application submitted, pending 3,000 LKR fee receipt & President/VP authorization', '2026-09-24 14:30:00'),
(2, 'nimasha.wick@gmail.com', 'Nimasha Wickramasinghe', '+94 71 333 9922', 'Membership Application', 'Pending Board Approval', 3000, '521940', '2026-09-25 10:00:00', 'Application submitted, pending 3,000 LKR fee receipt & President/VP authorization', '2026-09-25 09:15:00'),
(3, 'unknown.user@notreal123.com', 'Test Attempter', '+94 70 000 0000', 'Invalid Domain Attempt', 'Invalid', 3000, NULL, NULL, 'Rejected: Nonexistent or fake email domain provided', '2026-09-26 18:10:00');

INSERT INTO `gallery` (`id`, `title`, `category`, `img`, `uploaded_by`, `created_at`) VALUES
(1, 'Miles of Memories Summit Trek', 'Club Service', '/photos/miles-of-memories.jpeg', 'Executive Board', '2026-08-15 10:00:00'),
(2, 'Feed the Paw Welfare Drive', 'Community Service', '/photos/feed-the-paw.png', 'Executive Board', '2026-08-20 11:30:00'),
(3, 'Coffee and Chill Networking Meetup', 'Professional Development', '/photos/coffee-and-chill.jpeg', 'Executive Board', '2026-09-02 14:15:00'),
(4, 'Rotaract Installation Ceremony', 'Leadership', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', 'President', '2026-09-10 16:00:00');

INSERT INTO `volunteer_logs` (`log_id`, `user_id`, `event_id`, `activity_name`, `hours_logged`, `description`, `verification_status`, `verified_by`, `submitted_at`) VALUES
(1, 5, 1, 'Tree Planting & Watershed Maintenance', 6.50, 'Assisted in soil preparation, transport of saplings, and coordinate volunteer sign-in.', 'Approved', 1, '2025-07-20 16:00:00'),
(2, 5, 2, 'Hackathon Technical Infrastructure Setup', 4.00, 'Configured local networking switches and verified participant developer workstations.', 'Approved', 2, '2025-07-25 18:30:00');

INSERT INTO `projects` (`project_id`, `avenue_id`, `title`, `impact_summary`, `funds_raised`, `featured_image`, `status`) VALUES
(1, 2, 'Feed the Paw: Stray Animal Welfare Drive', 'A compassionate community welfare drive providing nutritious food, hydration, and care to 75-100 stray dogs and cats in Kandy.', 45000.00, '/photos/feed-the-paw.png', 'Completed'),
(2, 3, 'Coffee and Chill: Member Networking Evening', 'An informal networking evening for brainstorming, skill sharing, and building lifelong professional friendships over coffee with 25+ attendees.', 15000.00, '/photos/coffee-and-chill.jpeg', 'Completed'),
(3, 1, 'Miles of Memories: Hanthana Mountain Hike', 'An adventurous hiking expedition up the scenic Hanthana mountain range fostering outdoor fellowship and team spirit.', 25000.00, '/photos/miles-of-memories.jpeg', 'Completed');

COMMIT;
