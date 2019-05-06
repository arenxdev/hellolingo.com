CREATE TABLE [dbo].[Mails] (
    [Id]               BIGINT         IDENTITY (1, 1) NOT NULL,
    [When]             DATETIME       CONSTRAINT [DF_Mails_When] DEFAULT (getdate()) NOT NULL,
    [RegulationStatus] TINYINT        NOT NULL,
    [NotifyStatus]     TINYINT        NOT NULL,
    [FromId]           INT            NOT NULL,
    [FromStatus]       TINYINT        NOT NULL,
    [ToId]             INT            NOT NULL,
    [ToStatus]         TINYINT        NOT NULL,
    [ReplyToMail]      BIGINT         NULL,
    [Subject]          NVARCHAR (100) NOT NULL,
    [Message]          NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_Mails] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Mails_MailReceiverStatuses] FOREIGN KEY ([ToStatus]) REFERENCES [dbo].[MailStatuses] ([Id]),
    CONSTRAINT [FK_Mails_MailRegulationStatuses] FOREIGN KEY ([RegulationStatus]) REFERENCES [dbo].[MailRegulationStatuses] ([Id]),
    CONSTRAINT [FK_Mails_MailSenderStatuses] FOREIGN KEY ([FromStatus]) REFERENCES [dbo].[MailStatuses] ([Id]),
    CONSTRAINT [FK_Mails_MailsReplyTo] FOREIGN KEY ([ReplyToMail]) REFERENCES [dbo].[Mails] ([Id]),
    CONSTRAINT [FK_Mails_NotifyStatuses] FOREIGN KEY ([NotifyStatus]) REFERENCES [dbo].[NotifyStatuses] ([Id]),
    CONSTRAINT [FK_MailsFromId_Users] FOREIGN KEY ([FromId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_MailsToId_Users] FOREIGN KEY ([ToId]) REFERENCES [dbo].[Users] ([Id])
);

GO

CREATE NONCLUSTERED INDEX [IX_Mails-FromId] ON [dbo].[Mails]([FromId] ASC) WITH (FILLFACTOR = 95);

GO
CREATE NONCLUSTERED INDEX [IX_Mails_ToId] ON [dbo].[Mails]([ToId] ASC) WITH (FILLFACTOR = 95)