-- Switch to the appropriate database
USE `pollor_db`;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop foreign key constraints if they exist
ALTER TABLE `polls`
  DROP FOREIGN KEY IF EXISTS `FK_poll_user`;

ALTER TABLE `answers`
  DROP FOREIGN KEY IF EXISTS `FK_answer_poll`;

ALTER TABLE `votes`
  DROP FOREIGN KEY IF EXISTS `FK_vote_answer`;

-- Drop primary key constraints (will silently ignore if not present)
-- MySQL allows you to drop primary keys even if they are not defined, but this may throw an error in some cases.
-- The error can be ignored since dropping the primary key is often unnecessary with auto-incremented columns.

-- Drop tables (safe with IF EXISTS)
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `polls`;
DROP TABLE IF EXISTS `votes`;
DROP TABLE IF EXISTS `answers`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
