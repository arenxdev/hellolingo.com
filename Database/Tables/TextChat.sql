CREATE TABLE [dbo].[TextChat] (
    [ID]         BIGINT          IDENTITY (1, 1) NOT NULL,
    [When]       DATETIME2 (7)   NOT NULL,
    [RoomId]     NVARCHAR (20)   NOT NULL,
    [UserId]     INT             NULL,
    [DeviceTag]  BIGINT          NOT NULL,
    [FirstName]  NVARCHAR (25)   NOT NULL,
    [LastName]   NVARCHAR (40)   NOT NULL,
    [Text]       NVARCHAR (1000) NOT NULL,
    [Visibility] TINYINT         NOT NULL,
    CONSTRAINT [PK__tmp_ms_x__20993B5C09D77C6F] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_TextChat_MessageVisibility] FOREIGN KEY ([Visibility]) REFERENCES [dbo].[MessageVisibilityTypes] ([ID]),
    CONSTRAINT [FK_TextChat_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);



GO
CREATE NONCLUSTERED INDEX [IX_TextChat_RoomId]
    ON [dbo].[TextChat]([RoomId] ASC);


GO
CREATE NONCLUSTERED INDEX [NonClusteredIndex-20170828-230238]
    ON [dbo].[TextChat]([UserId] ASC) WHERE ([ID]>(28000000));

