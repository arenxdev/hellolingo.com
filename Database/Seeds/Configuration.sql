/*
Post-Deployment Script
*/

IF NOT EXISTS (SELECT * FROM [dbo].[Configuration] WHERE Name = 'NextUserId')
  INSERT INTO [dbo].[Configuration] (Name, Int) VALUES ('NextUserId', 1)

IF NOT EXISTS (SELECT * FROM [dbo].[Configuration] WHERE Name = 'NextSessionTag')
	INSERT INTO [dbo].[Configuration] (Name, Bigint) VALUES ('NextSessionTag', 1)

IF NOT EXISTS (SELECT * FROM [dbo].[Configuration] WHERE Name = 'NextDeviceTag')
	INSERT INTO [dbo].[Configuration] (Name, Bigint) VALUES ('NextDeviceTag', 1)
