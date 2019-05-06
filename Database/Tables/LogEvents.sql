CREATE TABLE [dbo].[LogEvents] (
    [Day]   DATE          NOT NULL,
    [Event] VARCHAR (100) NOT NULL,
    [Count] INT           NOT NULL,
    CONSTRAINT [PK_LogEvents] PRIMARY KEY CLUSTERED ([Day] ASC, [Event] ASC)
);

