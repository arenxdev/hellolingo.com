If (Select count(*) from [TextChatRoomTypes]) = 0 BEGIN

	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'Any')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'Group')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'None')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'Private')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'Public')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'PublicOrPrivate')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'Secret')
	INSERT INTO [dbo].[TextChatRoomTypes] ([RoomType]) VALUES (N'SecretOrPrivate')

END