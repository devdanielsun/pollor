-- Switch to the appropriate database
USE `pollor_db`;

-- Create `users` table
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `emailaddress` VARCHAR(256) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `first_name` VARCHAR(64),
    `last_name` VARCHAR(64),
    `role` VARCHAR(32) DEFAULT 'Basic',
    `created_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UC_Users` (`id`, `emailaddress`, `username`)
) ENGINE=InnoDB;

-- Create `polls` table
CREATE TABLE `polls` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `question` VARCHAR(512) NOT NULL,
    `ending_date` DATETIME(6) NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_poll_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create `answers` table
CREATE TABLE `answers` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `poll_id` INT NOT NULL,
    `poll_answer` VARCHAR(256) NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_answer_poll` FOREIGN KEY (`poll_id`)
        REFERENCES `polls` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create `votes` table
CREATE TABLE `votes` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `answer_id` INT NOT NULL,
    `ipv4_address` VARCHAR(15),
    `ipv6_address` VARCHAR(45),
    `mac_address` CHAR(12),
    `voted_at` DATETIME(6) NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_vote_answer` FOREIGN KEY (`answer_id`)
        REFERENCES `answers` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
