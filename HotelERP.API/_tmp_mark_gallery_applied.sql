BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    DECLARE @var sysname;
    SELECT @var = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypes]') AND [c].[name] = N'BaseRate');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [RoomTypes] DROP CONSTRAINT [' + @var + '];');
    ALTER TABLE [RoomTypes] ALTER COLUMN [BaseRate] decimal(18,2) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [RoomTypes] ADD [HotelId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [RoomTypes] ADD [MaximumAdults] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [RoomTypes] ADD [MaximumChildren] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [Hotels] ADD [CityId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    CREATE TABLE [Cities] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Province] nvarchar(100) NULL,
        [Country] nvarchar(100) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Cities] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    CREATE INDEX [IX_Hotels_CityId] ON [Hotels] ([CityId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    CREATE INDEX [IX_RoomTypes_HotelId] ON [RoomTypes] ([HotelId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [Hotels] ADD CONSTRAINT [FK_Hotels_Cities_CityId] FOREIGN KEY ([CityId]) REFERENCES [Cities] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    ALTER TABLE [RoomTypes] ADD CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251228114612_AddCitiesAndHotelRoomTypeLinks'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251228114612_AddCitiesAndHotelRoomTypeLinks', N'9.0.9');
END;

COMMIT;
GO

