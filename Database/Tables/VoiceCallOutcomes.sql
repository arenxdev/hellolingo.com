CREATE TABLE [dbo].[VoiceCallOutcomes] (
    [Id]      TINYINT      NOT NULL,
    [Outcome] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_VoiceCallOutcomes] PRIMARY KEY CLUSTERED ([Id] ASC)
);

