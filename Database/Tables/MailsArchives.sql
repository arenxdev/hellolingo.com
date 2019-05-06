CREATE TABLE [dbo].[MailsArchives] (
    [Id]               BIGINT         NOT NULL,
    [When]             DATETIME       CONSTRAINT [DF_MailsArchives_When] DEFAULT (getdate()) NOT NULL,
    [RegulationStatus] TINYINT        NOT NULL,
    [NotifyStatus]     TINYINT        NOT NULL,
    [FromId]           INT            NOT NULL,
    [FromStatus]       TINYINT        NOT NULL,
    [ToId]             INT            NOT NULL,
    [ToStatus]         TINYINT        NOT NULL,
    [ReplyToMail]      BIGINT         NULL,
    [Subject]          NVARCHAR (100) NOT NULL,
    [Message]          NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_MailsArchives] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_MailsArchives_MailReceiverStatuses] FOREIGN KEY ([ToStatus]) REFERENCES [dbo].[MailStatuses] ([Id]),
    CONSTRAINT [FK_MailsArchives_MailRegulationStatuses] FOREIGN KEY ([RegulationStatus]) REFERENCES [dbo].[MailRegulationStatuses] ([Id]),
    CONSTRAINT [FK_MailsArchives_MailsArchivesenderStatuses] FOREIGN KEY ([FromStatus]) REFERENCES [dbo].[MailStatuses] ([Id]),
    CONSTRAINT [FK_MailsArchives_NotifyStatuses] FOREIGN KEY ([NotifyStatus]) REFERENCES [dbo].[NotifyStatuses] ([Id]),
    CONSTRAINT [FK_MailsArchivesFromId_Users] FOREIGN KEY ([FromId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_MailsArchivesToId_Users] FOREIGN KEY ([ToId]) REFERENCES [dbo].[Users] ([Id])
);

