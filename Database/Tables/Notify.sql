CREATE TABLE [dbo].[Notify] (
    [Id]       BIGINT         IDENTITY (1, 1) NOT NULL,
    [UserId]   INT            NOT NULL,
    [NotifyOn] DATETIME       NOT NULL,
    [Medium]   VARCHAR (25)   NOT NULL,
    [Subject]  NVARCHAR (100) NOT NULL,
    [TextBody] NVARCHAR (MAX) NOT NULL,
    [HtmlBody] NVARCHAR (MAX) NOT NULL,
    [Status]   TINYINT        CONSTRAINT [DF_Notify_Status] DEFAULT ((5)) NOT NULL,
    CONSTRAINT [PK_Notify] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Notify_NotifyMediums] FOREIGN KEY ([Medium]) REFERENCES [dbo].[NotifyMediums] ([Medium]),
    CONSTRAINT [FK_Notify_NotifyStatuses] FOREIGN KEY ([Status]) REFERENCES [dbo].[NotifyStatuses] ([Id]),
    CONSTRAINT [FK_Notify_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);







