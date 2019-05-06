/*
Post-Deployment Script
*/

If (Select count(*) from [UsersTags]) = 0
	INSERT INTO [dbo].[UsersTags] ([UserId],[TagId]) VALUES 
	(1,1)
	,(1,4)
	,(1,5)

