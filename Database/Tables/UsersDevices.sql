CREATE TABLE [dbo].[UsersDevices] (
    [UserId]    INT      NOT NULL,
    [DeviceTag] BIGINT   NOT NULL,
    [LastIPV4]  BIGINT   NULL,
    [Created]   DATETIME CONSTRAINT [DF_UsersDevices_Created] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_UsersDevices] PRIMARY KEY CLUSTERED ([UserId] ASC, [DeviceTag] ASC),
    CONSTRAINT [FK_UsersDevices_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);