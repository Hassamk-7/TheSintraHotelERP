-- Create Restaurant Management Tables
-- This creates a proper structure for managing restaurants and menu items

USE HMS_DB;
GO

-- =============================================
-- Table 1: Restaurants (Location-based restaurants)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Restaurants')
BEGIN
    CREATE TABLE dbo.Restaurants (
        RestaurantID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Location NVARCHAR(100) NOT NULL, -- Islamabad, Lahore, Karachi
        Description NVARCHAR(MAX),
        ImagePath NVARCHAR(500),
        Rating DECIMAL(3,2) DEFAULT 4.5,
        PhoneNumber NVARCHAR(50),
        Email NVARCHAR(100),
        OpeningHours NVARCHAR(200),
        DisplayOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedBy NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100),
        ModifiedDate DATETIME,
        CONSTRAINT UQ_Restaurant_Location UNIQUE(Location)
    );

    PRINT 'Restaurants table created successfully!';
END
ELSE
BEGIN
    PRINT 'Restaurants table already exists.';
END
GO

-- =============================================
-- Table 2: MenuItems (Restaurant menu items)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MenuItems')
BEGIN
    CREATE TABLE dbo.MenuItems (
        MenuItemID INT IDENTITY(1,1) PRIMARY KEY,
        RestaurantID INT NOT NULL,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        ImagePath NVARCHAR(500),
        Price DECIMAL(10,2) NOT NULL,
        Rating DECIMAL(3,2) DEFAULT 4.5,
        Category NVARCHAR(100), -- Appetizers, Main Course, Desserts, Beverages
        Cuisine NVARCHAR(100), -- Pakistani, Continental, Chinese, Italian, Thai
        IsSpicy BIT DEFAULT 0,
        IsVegetarian BIT DEFAULT 0,
        IsAvailable BIT DEFAULT 1,
        DisplayOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedBy NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100),
        ModifiedDate DATETIME,
        CONSTRAINT FK_MenuItem_Restaurant FOREIGN KEY (RestaurantID) 
            REFERENCES dbo.Restaurants(RestaurantID) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IX_MenuItem_Restaurant ON dbo.MenuItems(RestaurantID);
    CREATE INDEX IX_MenuItem_Category ON dbo.MenuItems(Category);
    CREATE INDEX IX_MenuItem_Cuisine ON dbo.MenuItems(Cuisine);
    CREATE INDEX IX_MenuItem_Active ON dbo.MenuItems(IsActive);

    PRINT 'MenuItems table created successfully!';
END
ELSE
BEGIN
    PRINT 'MenuItems table already exists.';
END
GO

-- =============================================
-- Table 3: GalleryCategories (For organizing gallery items)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GalleryCategories')
BEGIN
    CREATE TABLE dbo.GalleryCategories (
        CategoryID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Subtitle NVARCHAR(200),
        Description NVARCHAR(MAX),
        DisplayOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedBy NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100),
        ModifiedDate DATETIME,
        CONSTRAINT UQ_GalleryCategory_Name UNIQUE(Name)
    );

    PRINT 'GalleryCategories table created successfully!';
END
ELSE
BEGIN
    PRINT 'GalleryCategories table already exists.';
END
GO

-- =============================================
-- Table 4: GalleryItems (Gallery images with grouping)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GalleryItems')
BEGIN
    CREATE TABLE dbo.GalleryItems (
        GalleryItemID INT IDENTITY(1,1) PRIMARY KEY,
        CategoryID INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Subtitle NVARCHAR(200),
        Description NVARCHAR(MAX),
        ImagePath NVARCHAR(500) NOT NULL,
        IsMainImage BIT DEFAULT 0, -- Only one main image per category item
        DisplayOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedBy NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100),
        ModifiedDate DATETIME,
        CONSTRAINT FK_GalleryItem_Category FOREIGN KEY (CategoryID) 
            REFERENCES dbo.GalleryCategories(CategoryID) ON DELETE CASCADE
    );

    -- Create indexes
    CREATE INDEX IX_GalleryItem_Category ON dbo.GalleryItems(CategoryID);
    CREATE INDEX IX_GalleryItem_MainImage ON dbo.GalleryItems(IsMainImage);
    CREATE INDEX IX_GalleryItem_Active ON dbo.GalleryItems(IsActive);

    PRINT 'GalleryItems table created successfully!';
END
ELSE
BEGIN
    PRINT 'GalleryItems table already exists.';
END
GO

-- =============================================
-- Insert Sample Data for Restaurants
-- =============================================
IF NOT EXISTS (SELECT * FROM dbo.Restaurants)
BEGIN
    INSERT INTO dbo.Restaurants (Name, Location, Description, Rating, DisplayOrder, IsActive)
    VALUES 
        ('The Grand Dining Hall', 'Islamabad', 'Our flagship restaurant offering international cuisine in an elegant setting', 4.8, 1, 1),
        ('Rooftop Garden Restaurant', 'Lahore', 'Dine under the stars with panoramic city views and fresh air', 4.9, 2, 1),
        ('Ocean View Cafe', 'Karachi', 'Casual dining with stunning ocean views and fresh seafood', 4.7, 3, 1);

    PRINT 'Sample restaurant data inserted!';
END
GO

-- =============================================
-- Insert Sample Data for Gallery Categories
-- =============================================
-- Note: Each category should have a unique combination of Name+Title
IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Deluxe Studio')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Deluxe Studio', 'Deluxe Studio', 'Elegant studio with modern amenities', 1, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Executive Suite')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Executive Suite', 'Executive Suite', 'Luxurious suite with panoramic views', 2, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'VVIP Presidential Suite')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('VVIP Presidential Suite', 'VVIP Presidential Suite', 'Ultimate luxury accommodation', 3, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Standard Studio')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Standard Studio', 'Standard Studio', 'Comfortable and affordable accommodation', 4, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Infinity Studio')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Infinity Studio', 'Infinity Studio', 'Relaxing pool with stunning views', 5, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Infinity Suite')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Infinity Suite', 'Infinity Suite', 'Premium poolside experience', 6, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Bathroom Studio')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Bathroom Studio', 'Bathroom Studio', 'Luxurious spa-like bathrooms', 7, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Peninsula View')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Peninsula View', 'Peninsula View', 'Breathtaking peninsula views', 8, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Main Dining Hall')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Main Dining Hall', 'Main Dining Hall', 'Elegant fine dining experience', 9, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Fine Dining')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Fine Dining', 'Fine Dining', 'Exquisite culinary creations', 10, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Chef''s Special')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Chef''s Special', 'Chef''s Special', 'Signature dishes by master chef', 11, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Rooftop Dining')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Rooftop Dining', 'Rooftop Dining', 'Dining under the stars', 12, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Bar & Lounge')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Bar & Lounge', 'Bar & Lounge', 'Premium cocktails and beverages', 13, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Private Dining')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Private Dining', 'Private Dining', 'Intimate dining experience', 14, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Swimming Pool')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Swimming Pool', 'Swimming Pool', 'Infinity pool with city views', 15, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Fitness Center')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Fitness Center', 'Fitness Center', 'State-of-the-art gym equipment', 16, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Spa & Wellness')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Spa & Wellness', 'Spa & Wellness', 'Relaxation and rejuvenation', 17, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Conference Hall')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Conference Hall', 'Conference Hall', 'Modern meeting facilities', 18, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Lobby')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Lobby', 'Lobby', 'Grand entrance and reception', 19, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Hotel Exterior')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Hotel Exterior', 'Hotel Exterior', 'Impressive architectural design', 20, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Garden View')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Garden View', 'Garden View', 'Beautiful landscaped gardens', 21, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Night View')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Night View', 'Night View', 'Hotel illuminated at night', 22, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Entrance')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Entrance', 'Entrance', 'Grand hotel entrance', 23, 1);
END

IF NOT EXISTS (SELECT * FROM dbo.GalleryCategories WHERE Title = 'Terrace View')
BEGIN
    INSERT INTO dbo.GalleryCategories (Name, Title, Subtitle, DisplayOrder, IsActive)
    VALUES 
        ('Terrace View', 'Terrace View', 'Outdoor terrace and seating', 24, 1);
END

PRINT 'Sample gallery categories inserted!';
GO

-- Add extended properties for documentation
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Stores restaurant location information',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'Restaurants';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Stores menu items for each restaurant',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'MenuItems';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Stores gallery category groupings (e.g., Deluxe Studio, Executive Suite)',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'GalleryCategories';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Stores individual gallery images linked to categories',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'GalleryItems';
GO

PRINT '==============================================';
PRINT 'Restaurant and Gallery tables created successfully!';
PRINT 'Tables created: Restaurants, MenuItems, GalleryCategories, GalleryItems';
PRINT '==============================================';
GO
