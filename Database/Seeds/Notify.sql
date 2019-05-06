/*
Post-Deployment Script
*/

If (Select count(*) from Notify) = 0 
	
	SET IDENTITY_INSERT [dbo].[Notify] ON

	INSERT INTO [dbo].[Notify] ([Id], [UserId], [NotifyOn], [Medium], [Subject], [TextBody], [HtmlBody], [Status]) 
			VALUES (2, 1, N'2000-01-01 00:00:00', N'RegularEmail', N'This is a test Subject', N'This is a TextBody. First Name: #FirstName#', N'This is a <B>HtmlBody</B>.<BR>First Name: #FirstName#', 5)
			--VALUES (2, 1, N'2000-01-01 00:00:00', N'RegularEmail2', N'This is a test Subject', N'This is another TextBody. First Name: #FirstName#', N'This is another <B>HtmlBody</B>.<BR>First Name: #FirstName#', 5)

	SET IDENTITY_INSERT [dbo].[Notify] OFF

