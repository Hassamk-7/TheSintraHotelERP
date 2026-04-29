-- Create RoomGallery Table
-- This table stores gallery images for each room type
-- Similar structure to RoomTypeImages but for gallery display

USE HMS_DB;
GO

-- Check if table exists and drop if needed (for development)
IF OBJECT_ID('dbo.RoomGallery', 'U') IS NOT NULL
    DROP TABLE dbo.RoomGallery;
GO

CREATE TABLE dbo.RoomGallery (
    RoomGalleryID INT IDENTITY(1,1) PRIMARY KEY,
    RoomTypeID INT NOT NULL,
    ImageName NVARCHAR(255) NOT NULL,
    ImagePath NVARCHAR(500) NOT NULL,
    ImageTitle NVARCHAR(200) NULL,
    ImageDescription NVARCHAR(1000) NULL,
    Category NVARCHAR(100) NULL, -- e.g., 'Rooms & Suites', 'Restaurant', 'Facilities', 'Exterior'
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsMainImage BIT NOT NULL DEFAULT 0, -- First/main image for the room type
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedBy NVARCHAR(100) NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy NVARCHAR(100) NULL,
    ModifiedDate DATETIME NULL,
    
    -- Foreign Key
    CONSTRAINT FK_RoomGallery_RoomType FOREIGN KEY (RoomTypeID) 
        REFERENCES dbo.RoomType(RoomTypeID) ON DELETE CASCADE
);
GO

-- Create indexes for better performance
CREATE INDEX IX_RoomGallery_RoomTypeID ON dbo.RoomGallery(RoomTypeID);
CREATE INDEX IX_RoomGallery_Category ON dbo.RoomGallery(Category);
CREATE INDEX IX_RoomGallery_IsActive ON dbo.RoomGallery(IsActive);
GO

-- Add comments
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Stores gallery images for room types with categorization and ordering',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'RoomGallery';
GO

PRINT 'RoomGallery table created successfully!';
