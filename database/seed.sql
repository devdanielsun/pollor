INSERT INTO users (`id`, `emailaddress`, `first_name`, `last_name`, `profile_username`, `created_at`)
VALUES ('1', 'test@test.nl', 'Tester', 'Test', 'Testing', '1970-01-01 00:00:01.000000');

INSERT INTO polls (`id`, `user_id`, `question`, `ending_date`, `created_at`)
VALUES ('1', '1', 'was the moon landing of 1969 real?', '2038-01-19 03:14:07.499999', '1970-01-01 00:00:01.000000');

INSERT INTO answers (`id`, `poll_id`, `poll_answer`)
VALUES ('1', '1', 'Yes, ofcourse the moonlanding was real'),
	   ('2', '1', 'No, it is an conspiracy'),
	   ('3', '1', 'I don\'t know, I was not born yet');

/*

INSERT INTO votes (`id`, `poll_id`, `answer_id`, `ipv4_address`, `ipv6_address`, `mac_address`, `voted_at`, `created_at`)
	('1', '1', '2', 'INET_ATON('127.0.0.1')', hex(inet6_aton('2001:0db8:85a3:0000:0000:8a2e:0370:7334')), ' ?? ', '2024-01-08 19:30:00.000000', '1970-01-01 00:00:01.000000');


IPV4:
SELECT INET_ATON('127.0.0.1'); // insert ipv4
SELECT inet_ntoa('2130706433'); // select ipv4

IPV6:
select hex(inet6_aton('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // insert ipv6
select inet6_ntoa(unhex('20010DB885A3000000008A2E03707334')); // select ipv6


IPV4/6 source: https://www.rathishkumar.in/2017/08/how-to-store-ip-address-in-mysql.html

macaddress:
https://www.onurguzel.com/storing-mac-address-in-a-mysql-database/
*/