CREATE TABLE [dbo].[MessageVisibilityTypes] (
    [ID]         TINYINT       NOT NULL,
    [Visibility] NVARCHAR (25) NOT NULL,
    CONSTRAINT [PK__tmp_ms_x__3860348903521] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [IX_MessageVisibilityTypes] UNIQUE NONCLUSTERED ([Visibility] ASC)
);




