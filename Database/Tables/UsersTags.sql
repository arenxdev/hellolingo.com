CREATE TABLE [dbo].[UsersTags] (
    [UserId] INT     NOT NULL,
    [TagId]  INT NOT NULL,
    CONSTRAINT [PK_UsersTags] PRIMARY KEY CLUSTERED ([UserId] ASC, [TagId] ASC),
    CONSTRAINT [FK_UsersTags_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_UsersTags_UsersTagsValues] FOREIGN KEY ([TagId]) REFERENCES [dbo].[UsersTagsValues] ([Id])
);







