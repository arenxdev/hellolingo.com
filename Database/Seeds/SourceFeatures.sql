/*
Post-Deployment Script
*/

If (Select count(*) from [dbo].[SourceFeatures]) = 0  INSERT INTO [dbo].[SourceFeatures] ([Id], [Feature]) VALUES 

	(0, N'Unknown'),
	(1, N'PrivateTextChat'),
	(2, N'PublicTextChat'),
	(3, N'TextChatLobby'),
	(10, N'FindByLanguage'),
	(11, N'FindByName'),
	(15, N'ContactsList'),
	(20, N'MailboxReadMail'),
	(41, N'SharedLingo')