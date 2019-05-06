CREATE TABLE [dbo].[VoiceCalls] (
    [Id]       BIGINT        IDENTITY (1, 1) NOT NULL,
    [Created]  DATETIME2 (7) NOT NULL,
    [Source]   TINYINT       NOT NULL,
    [CallerId] INT           NOT NULL,
    [CalleeId] INT           NOT NULL,
    [Platform] TINYINT       NULL,
    [Accepted] DATETIME2 (7) NULL,
    [Outcome]  TINYINT       NULL,
    [Ended]    DATETIME2 (7) NULL,
    CONSTRAINT [PK_VoiceCalls] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_VoiceCalls_SourceFeatures] FOREIGN KEY ([Source]) REFERENCES [dbo].[SourceFeatures] ([Id]),
    CONSTRAINT [FK_VoiceCalls_Users] FOREIGN KEY ([CallerId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_VoiceCalls_Users1] FOREIGN KEY ([CalleeId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_VoiceCalls_VoiceOutcomes] FOREIGN KEY ([Outcome]) REFERENCES [dbo].[VoiceCallOutcomes] ([Id]),
    CONSTRAINT [FK_VoiceCalls_VoicePlatforms] FOREIGN KEY ([Platform]) REFERENCES [dbo].[VoicePlatforms] ([Id])
);

