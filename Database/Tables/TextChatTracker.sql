CREATE TABLE [dbo].[TextChatTracker] (
    [UserId]    INT          NOT NULL,
    [RoomId]    VARCHAR (20) NOT NULL,
    [Created]   DATETIME     CONSTRAINT [DF_TextChatTracker_Created] DEFAULT (getdate()) NOT NULL,
    [PartnerId] INT          NULL,
    [Status]    TINYINT      NOT NULL,
    [StatusAt]  DATETIME     CONSTRAINT [DF_TextChatTracker_StatusAt] DEFAULT (getdate()) NOT NULL,
    [Initiator] BIT          NOT NULL,
    CONSTRAINT [PK_TextChatTracker] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoomId] ASC),
    CONSTRAINT [FK_TextChatTracker_TextChatTrackerStatuses] FOREIGN KEY ([Status]) REFERENCES [dbo].[TextChatTrackerStatuses] ([Id]),
    CONSTRAINT [FK_TextChatTracker_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_TextChatTracker_Users1] FOREIGN KEY ([PartnerId]) REFERENCES [dbo].[Users] ([Id])
);







