CREATE TABLE [dbo].[VoicePlatforms] (
    [Id]              TINYINT       NOT NULL,
    [PlatformName]    VARCHAR (25)  NOT NULL,
    [PlatformText]    VARCHAR (25)  NOT NULL,
    [ThirdParty]      BIT           NOT NULL,
    [ContactIdNaming] VARCHAR (25)  NULL,
    [ContactIdRegex]  VARCHAR (255) NULL,
    [RgbColor]        CHAR (6)      NULL,
    CONSTRAINT [PK_VoicePlatforms] PRIMARY KEY CLUSTERED ([Id] ASC)
);





