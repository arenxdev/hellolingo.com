CREATE TABLE [dbo].[UsersTagsValues] (
    [Id]          INT       NOT NULL,
    [Tag]         VARCHAR (50)  NOT NULL,
    [Description] VARCHAR (250) NULL,
    CONSTRAINT [PK_UsersTagsValues] PRIMARY KEY CLUSTERED ([Id] ASC)
);



