CREATE TABLE [dbo].[Languages] (
    [Id]          TINYINT       NOT NULL,
    [Code]        CHAR (8)      NOT NULL,
    [Name]        NVARCHAR (20) NOT NULL,
    [EnglishName] VARCHAR (20)  NOT NULL,
    [InUse]       BIT           CONSTRAINT [DF__Languages__InUse__36B12243] DEFAULT ((0)) NOT NULL,
    [Tier]        SMALLINT      CONSTRAINT [DF__Languages__Tier__37A5467C] DEFAULT ((3)) NOT NULL,
    CONSTRAINT [PK__Language__3214EC07660E6011] PRIMARY KEY CLUSTERED ([Id] ASC)
);





