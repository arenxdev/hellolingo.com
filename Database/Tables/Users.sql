CREATE TABLE [dbo].[Users] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Since]        DATETIME2 (7)  CONSTRAINT [DF_Users_Since] DEFAULT (getdate()) NOT NULL,
    [Status]       TINYINT        CONSTRAINT [DF_Users_Status] DEFAULT ((1)) NOT NULL,
    [Banned]       BIT            CONSTRAINT [DF_Users_Banned] DEFAULT ((0)) NOT NULL,
    [Listed]       BIT            CONSTRAINT [DF_Users_Listed] DEFAULT ((1)) NOT NULL,
    [Active]       BIT            CONSTRAINT [DF_Users_Active] DEFAULT ((1)) NOT NULL,
    [LastVisit]    DATETIME2 (7)  NULL,
    [FirstName]    NVARCHAR (25)  NOT NULL,
    [LastName]     NVARCHAR (40)  NOT NULL,
    [Gender]       CHAR (1)       NULL,
    [BirthYear]    INT            NOT NULL,
    [BirthMonth]   TINYINT        NOT NULL,
    [Country]      TINYINT        NOT NULL,
    [Location]     NVARCHAR (40)  CONSTRAINT [DF_Users_Location] DEFAULT ('') NULL,
    [Knows]        TINYINT        NOT NULL,
    [Knows2]       TINYINT        NULL,
    [Knows3]       TINYINT        NULL,
    [Learns]       TINYINT        NOT NULL,
    [Learns2]      TINYINT        NULL,
    [Learns3]      TINYINT        NULL,
    [Introduction] NVARCHAR (MAX) CONSTRAINT [DF_Users_Introduction] DEFAULT ('') NULL,
    [AspNetId]     NVARCHAR (128) NULL,
    CONSTRAINT [PK_Users_ID] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Users_AspNetUsers] FOREIGN KEY ([AspNetId]) REFERENCES [dbo].[AspNetUsers] ([Id]),
    CONSTRAINT [FK_Users_Countries] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]),
    CONSTRAINT [FK_Users_Languages_Knows] FOREIGN KEY ([Knows]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_Languages_Knows2] FOREIGN KEY ([Knows2]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_Languages_Knows3] FOREIGN KEY ([Knows3]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_Languages_Learns] FOREIGN KEY ([Learns]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_Languages_Learns2] FOREIGN KEY ([Learns2]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_Languages_Learns3] FOREIGN KEY ([Learns3]) REFERENCES [dbo].[Languages] ([Id]),
    CONSTRAINT [FK_Users_UsersStatuses] FOREIGN KEY ([Status]) REFERENCES [dbo].[UsersStatuses] ([Id]),
    CONSTRAINT [IX_Users_AspNetId] UNIQUE NONCLUSTERED ([Id] ASC)
);























