-- Update RoomGallery Table to Support Restaurant Data
-- Add additional columns for restaurant-specific information

USE HMS_DB;
GO

-- Add new columns for restaurant data
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'Location')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD Location NVARCHAR(100) NULL; -- e.g., 'Islamabad', 'Lahore', 'Karachi'
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'Rating')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD Rating DECIMAL(3,2) NULL; -- e.g., 4.8
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'Price')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD Price DECIMAL(10,2) NULL; -- For restaurant items
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'IsSpicy')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD IsSpicy BIT NULL DEFAULT 0; -- For restaurant items
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'IsVegetarian')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD IsVegetarian BIT NULL DEFAULT 0; -- For restaurant items
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'Cuisine')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD Cuisine NVARCHAR(100) NULL; -- e.g., 'Pakistani', 'Continental', 'Chinese'
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.RoomGallery') AND name = 'SubCategory')
BEGIN
    ALTER TABLE dbo.RoomGallery
    ADD SubCategory NVARCHAR(100) NULL; -- e.g., 'Appetizers', 'Main Course', 'Desserts'
END
GO

-- Add comments for new columns
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Location where item is available (for restaurants)',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'RoomGallery',
    @level2type = N'COLUMN', @level2name = 'Location';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Rating of the item (1-5 scale)',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'RoomGallery',
    @level2type = N'COLUMN', @level2name = 'Rating';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Price of the item (for restaurant menu)',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'RoomGallery',
    @level2type = N'COLUMN', @level2name = 'Price';
GO

PRINT 'RoomGallery table updated successfully with restaurant support!';
GO
