-- Switch to the appropriate database
USE `pollor_db`;

-- Insert data into `users` table
INSERT INTO `users` (`emailaddress`, `first_name`, `last_name`, `username`, `password`, `created_at`)
VALUES ('test@test.nl', 'Tester', 'Test', 'Testing', '', '1970-01-01 00:00:01');

-- Insert data into `polls` table
INSERT INTO `polls` (`user_id`, `question`, `ending_date`, `created_at`)
VALUES (1, 'was the moon landing of 1969 real?', '2038-01-19 03:14:07', '1970-01-01 00:00:01');

-- Insert data into `answers` table
INSERT INTO `answers` (`poll_id`, `poll_answer`, `created_at`)
VALUES 
    (1, 'Yes, of course the moonlanding was real', '2018-01-19 03:14:07'),
    (1, 'No, it is a conspiracy', '2018-01-19 03:14:07'),
    (1, 'I do not know, I was not born yet', '2024-01-19 03:14:07');

-- Insert data into `votes` table
INSERT INTO `votes` (`answer_id`, `ipv4_address`, `ipv6_address`, `mac_address`, `voted_at`, `created_at`)
VALUES (2, NULL, NULL, NULL, '2024-01-08 19:30:00', '1970-01-01 00:00:01');
