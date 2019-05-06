/*
Post-Deployment Script
*/

If (Select count(*) from [TextChatTrackerStatuses]) = 0 BEGIN

INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (1, N'Inviting')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (2, N'InviteAccepted')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (3, N'InviteIgnored')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (4, N'InviteDeclined')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (5, N'SeenInviteResponse')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (9, N'AutoBlocked')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (10, N'UnreadMessages')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (11, N'AllCaughtUp')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (21, N'Invited')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (22, N'AcceptedInvite')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (23, N'IgnoredInvite')
INSERT INTO [dbo].[TextChatTrackerStatuses] ([Id], [Value]) VALUES (24, N'DeclinedInvite')

END