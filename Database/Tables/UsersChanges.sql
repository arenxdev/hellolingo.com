CREATE TABLE [dbo].[UsersChanges] (
    [Id]           BIGINT         IDENTITY (1, 1) NOT NULL,
    [When]         DATETIME2 (7)  CONSTRAINT [DF_UsersChanges_When] DEFAULT (getdate()) NOT NULL,
    [ChangeType]   TINYINT        NOT NULL,
    [UserId]       INT            NULL,
    [DeviceTag]    INT            NULL,
    [Email]        NVARCHAR (256) NULL,
    [FirstName]    NVARCHAR (25)  NULL,
    [LastName]     NVARCHAR (40)  NULL,
    [BirthYear]    INT            NULL,
    [BirthMonth]   TINYINT        NULL,
    [Country]      TINYINT        NULL,
    [Location]     NVARCHAR (40)  NULL,
    [Knows]        TINYINT        NULL,
    [Knows2]       TINYINT        NULL,
    [Knows3]       TINYINT        NULL,
    [Learns]       TINYINT        NULL,
    [Learns2]      TINYINT        NULL,
    [Learns3]      TINYINT        NULL,
    [Introduction] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_UsersChanges] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UsersChanges_Countries] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages] FOREIGN KEY ([Knows]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages1] FOREIGN KEY ([Knows2]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages2] FOREIGN KEY ([Knows3]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages3] FOREIGN KEY ([Learns]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages4] FOREIGN KEY ([Learns2]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Languages5] FOREIGN KEY ([Learns3]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_UsersChanges_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_UsersChanges_UsersChangesTypes] FOREIGN KEY ([ChangeType]) REFERENCES [dbo].[UsersChangesTypes] ([Id])
);







