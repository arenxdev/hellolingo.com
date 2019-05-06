CREATE TABLE [dbo].[TilesFiltering] (
    [UserId]   INT     NOT NULL,
    [TileId]   INT     NOT NULL,
    [FilterId] TINYINT NOT NULL,
    CONSTRAINT [PK_TilesFiltering] PRIMARY KEY CLUSTERED ([UserId] ASC, [TileId] ASC),
    CONSTRAINT [FK_TilesFiltering_TilesFilters] FOREIGN KEY ([FilterId]) REFERENCES [dbo].[TilesFilters] ([Id]),
    CONSTRAINT [FK_TilesFiltering_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);



