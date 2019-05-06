CREATE TABLE [dbo].[MailStatuses] (
    [Id]     TINYINT      NOT NULL,
    [Status] VARCHAR (25) NOT NULL,
    CONSTRAINT [PK_MailStatuses] PRIMARY KEY CLUSTERED ([Id] ASC)
);



