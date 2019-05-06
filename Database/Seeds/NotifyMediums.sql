/*
Post-Deployment Script
*/

If (Select count(*) from NotifyMediums) = 0 
	
	INSERT INTO [dbo].[NotifyMediums] ([Medium]) VALUES 
	
	(N'RegularEmail')
	--,(N'...')
	