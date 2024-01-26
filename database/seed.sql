USE [pollor_db]
GO

INSERT INTO users (emailaddress, first_name, last_name, profile_username, created_at)
VALUES ('test@test.nl', 'Tester', 'Test', 'Testing', '1970-01-01T00:00:01');
GO

INSERT INTO polls (user_id, question, ending_date, created_at)
VALUES ('1', 'was the moon landing of 1969 real?', '2038-01-19T03:14:07', '1970-01-01T00:00:01');
GO

INSERT INTO answers (poll_id, poll_answer, created_at)
VALUES ('1', 'Yes, ofcourse the moonlanding was real', '2018-01-19T03:14:07'),
	   ('1', 'No, it is an conspiracy', '2018-01-19T03:14:07'),
	   ('1', 'I do not know, I was not born yet', '2024-01-19T03:14:07');
GO

INSERT INTO votes (answer_id, ipv4_address, ipv6_address, mac_address, voted_at, created_at)
 VALUES('2', null, null, null, '2024-01-08T19:30:00', '1970-01-01T00:00:01');
GO


/*
IPV4:
INSERT INET_ATON('127.0.0.1'); // insert ipv4
SELECT inet_ntoa('2130706433'); // select ipv4

IPV6:
INSERT hex(inet6_aton('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // insert ipv6
SELECT inet6_ntoa(unhex('20010DB885A3000000008A2E03707334')); // select ipv6


IPV4/6 source: https://www.rathishkumar.in/2017/08/how-to-store-ip-address-in-mysql.html

macaddress:
https://www.onurguzel.com/storing-mac-address-in-a-mysql-database/

*/