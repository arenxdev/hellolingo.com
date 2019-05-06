CREATE TABLE [dbo].[Contacts] (
    [UserId]    INT      NOT NULL,
    [ContactId] INT      NOT NULL,
    [When]      DATETIME CONSTRAINT [DF_Contacts_When] DEFAULT (getdate()) NOT NULL,
    [Source]    TINYINT  NOT NULL,
    CONSTRAINT [PK_Contacts] PRIMARY KEY CLUSTERED ([UserId] ASC, [ContactId] ASC),
    CONSTRAINT [FK_Contacts_SourceFeatures] FOREIGN KEY ([Source]) REFERENCES [dbo].[SourceFeatures] ([Id]),
    CONSTRAINT [FK_Contacts_Users_ContactId] FOREIGN KEY ([ContactId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Contacts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);

