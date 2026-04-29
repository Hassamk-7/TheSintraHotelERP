BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE TABLE [GalleryCategories] (
        [CategoryID] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Subtitle] nvarchar(200) NULL,
        [Description] nvarchar(1000) NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedBy] nvarchar(100) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [ModifiedBy] nvarchar(100) NULL,
        [ModifiedDate] datetime2 NULL,
        CONSTRAINT [PK_GalleryCategories] PRIMARY KEY ([CategoryID])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE TABLE [Restaurants] (
        [RestaurantID] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [Location] nvarchar(100) NOT NULL,
        [Description] nvarchar(1000) NULL,
        [ImagePath] nvarchar(500) NULL,
        [Rating] decimal(3,2) NOT NULL,
        [PhoneNumber] nvarchar(50) NULL,
        [Email] nvarchar(100) NULL,
        [OpeningHours] nvarchar(200) NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedBy] nvarchar(100) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [ModifiedBy] nvarchar(100) NULL,
        [ModifiedDate] datetime2 NULL,
        CONSTRAINT [PK_Restaurants] PRIMARY KEY ([RestaurantID])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE TABLE [RoomGallery] (
        [RoomGalleryID] int NOT NULL IDENTITY,
        [RoomTypeID] int NOT NULL,
        [ImageName] nvarchar(255) NOT NULL,
        [ImagePath] nvarchar(500) NOT NULL,
        [ImageTitle] nvarchar(200) NULL,
        [ImageDescription] nvarchar(1000) NULL,
        [Category] nvarchar(100) NULL,
        [DisplayOrder] int NOT NULL,
        [IsMainImage] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedBy] nvarchar(100) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [ModifiedBy] nvarchar(100) NULL,
        [ModifiedDate] datetime2 NULL,
        [Location] nvarchar(100) NULL,
        [Rating] decimal(3,2) NULL,
        [Price] decimal(10,2) NULL,
        [IsSpicy] bit NULL,
        [IsVegetarian] bit NULL,
        [Cuisine] nvarchar(100) NULL,
        [SubCategory] nvarchar(100) NULL,
        CONSTRAINT [PK_RoomGallery] PRIMARY KEY ([RoomGalleryID]),
        CONSTRAINT [FK_RoomGallery_RoomTypes_RoomTypeID] FOREIGN KEY ([RoomTypeID]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE TABLE [GalleryItems] (
        [GalleryItemID] int NOT NULL IDENTITY,
        [CategoryID] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Subtitle] nvarchar(200) NULL,
        [Description] nvarchar(1000) NULL,
        [ImagePath] nvarchar(500) NOT NULL,
        [IsMainImage] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedBy] nvarchar(100) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [ModifiedBy] nvarchar(100) NULL,
        [ModifiedDate] datetime2 NULL,
        CONSTRAINT [PK_GalleryItems] PRIMARY KEY ([GalleryItemID]),
        CONSTRAINT [FK_GalleryItems_GalleryCategories_CategoryID] FOREIGN KEY ([CategoryID]) REFERENCES [GalleryCategories] ([CategoryID]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE TABLE [MenuItems] (
        [MenuItemID] int NOT NULL IDENTITY,
        [RestaurantID] int NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Description] nvarchar(1000) NULL,
        [ImagePath] nvarchar(500) NULL,
        [Price] decimal(10,2) NOT NULL,
        [Rating] decimal(3,2) NOT NULL,
        [Category] nvarchar(100) NULL,
        [Cuisine] nvarchar(100) NULL,
        [IsSpicy] bit NOT NULL,
        [IsVegetarian] bit NOT NULL,
        [IsAvailable] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedBy] nvarchar(100) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [ModifiedBy] nvarchar(100) NULL,
        [ModifiedDate] datetime2 NULL,
        CONSTRAINT [PK_MenuItems] PRIMARY KEY ([MenuItemID]),
        CONSTRAINT [FK_MenuItems_Restaurants_RestaurantID] FOREIGN KEY ([RestaurantID]) REFERENCES [Restaurants] ([RestaurantID]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE INDEX [IX_GalleryItems_CategoryID] ON [GalleryItems] ([CategoryID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE INDEX [IX_MenuItems_RestaurantID] ON [MenuItems] ([RestaurantID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    CREATE INDEX [IX_RoomGallery_RoomTypeID] ON [RoomGallery] ([RoomTypeID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251030201414_AddGalleryRestaurantTables'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251030201414_AddGalleryRestaurantTables', N'9.0.9');
END;

COMMIT;
GO

