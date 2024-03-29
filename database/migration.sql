USE [pollor_db]
GO

/****** Object: Table [dbo].[users]
				Table [dbo].[polls]
				Table [dbo].[answers]
				Table [dbo].[votes]			Script Date: 10 Jan 2024 10:34:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[emailaddress] [nvarchar](256) NOT NULL,
	[username] [nvarchar](64) NOT NULL,
	[password] [nvarchar](128) NOT NULL,
	[first_name] [nvarchar](64) NULL,
	[last_name] [nvarchar](64) NULL,
	[role] [nvarchar](32) NULL DEFAULT 'Basic',
	[created_at] [datetime2](7) NOT NULL,
	CONSTRAINT PK_users PRIMARY KEY NONCLUSTERED (id),
	CONSTRAINT UC_Users UNIQUE (id,emailaddress,username)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[polls](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[question] [nvarchar](512) NOT NULL,
	[ending_date] [datetime2](7) NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	CONSTRAINT PK_polls PRIMARY KEY NONCLUSTERED (id),
	CONSTRAINT FK_poll_user FOREIGN KEY (user_id)
      REFERENCES users (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ON [PRIMARY]

GO


CREATE TABLE [dbo].[answers](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[poll_id] [int] NOT NULL,
	[poll_answer] [nvarchar](256) NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	CONSTRAINT PK_answers PRIMARY KEY NONCLUSTERED (id),
	CONSTRAINT FK_answer_poll FOREIGN KEY (poll_id)
      REFERENCES polls (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[votes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[answer_id] [int] NOT NULL,
	[ipv4_address] [varchar](15) NULL,
	[ipv6_address] [varchar](45) NULL,
	[mac_address] [char](12) NULL,
	[voted_at] [datetime2](7) NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	CONSTRAINT PK_votes PRIMARY KEY NONCLUSTERED (id),
	CONSTRAINT FK_vote_answer FOREIGN KEY (answer_id)
      REFERENCES answers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ON [PRIMARY]
GO

