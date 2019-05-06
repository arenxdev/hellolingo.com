CREATE TABLE [dbo].[NotifyStatuses] (
    [Id]    TINYINT      NOT NULL,
    [Value] VARCHAR (25) NOT NULL,
    CONSTRAINT [PK_NotifyStatuses] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [IX_NotifyStatuses] UNIQUE NONCLUSTERED ([Value] ASC)
);



