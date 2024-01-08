-- mysql
CREATE TABLE IF NOT EXISTS users (
  `id` INT NOT NULL AUTO_INCREMENT,
  `emailaddress` VARCHAR(256) NOT NULL,
  `first_name` VARCHAR(64) NOT NULL,
  `last_name` VARCHAR(64) NOT NULL,
  `profile_username` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS polls (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `question` VARCHAR(512) NOT NULL,
  `ending_date` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `polls_user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `polls_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES users (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS answers (
  `id` INT NOT NULL AUTO_INCREMENT,
  `poll_id` INT NOT NULL,
  `poll_answer` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `answers_poll_id_idx` (`poll_id` ASC) VISIBLE,
  CONSTRAINT `answers_poll_id`
    FOREIGN KEY (`poll_id`)
    REFERENCES polls (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS votes (
  `id` INT NOT NULL AUTO_INCREMENT,
  `poll_id` INT NOT NULL,
  `answer_id` INT NOT NULL,
  `ipv4_address` INT UNSIGNED NULL,
  `ipv6_address` BINARY(16) NULL,
  `mac_address` BIGINT(8) UNSIGNED NULL,
  `voted_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `votes_poll_id_idx` (`poll_id` ASC) VISIBLE,
  INDEX `votes_answer_id_idx` (`answer_id` ASC) VISIBLE,
  CONSTRAINT `votes_poll_id`
    FOREIGN KEY (`poll_id`)
    REFERENCES polls (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `votes_answer_id`
    FOREIGN KEY (`answer_id`)
    REFERENCES answers (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
