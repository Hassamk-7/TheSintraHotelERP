-- Quick Seed Script for Gallery and Restaurant with Online Images
USE HMS_DB;
GO

PRINT 'Starting quick seed...';
GO

-- Add Gallery Images with Unsplash URLs
DECLARE @DeluxeStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Deluxe Studio');
DECLARE @ExecutiveSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Executive Suite');
DECLARE @VVIPSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'VVIP Presidential Suite');
DECLARE @StandardStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Standard Studio');
DECLARE @PoolID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Swimming Pool');
DECLARE @LobbyID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Lobby');
DECLARE @RestaurantID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Main Dining Hall');

-- Deluxe Studio
IF @DeluxeStudioID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @DeluxeStudioID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@DeluxeStudioID, 'Deluxe Studio', 'Elegant studio with modern amenities', 'Spacious room with king-size bed', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 1, 1, 1),
        (@DeluxeStudioID, 'Studio Interior', 'Modern design', 'Contemporary furnishings', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 0, 2, 1);
    PRINT 'Deluxe Studio added';
END

-- Executive Suite
IF @ExecutiveSuiteID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @ExecutiveSuiteID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@ExecutiveSuiteID, 'Executive Suite', 'Luxurious suite with panoramic views', 'Premium accommodation', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 1, 1, 1),
        (@ExecutiveSuiteID, 'Suite Living Area', 'Spacious living', 'Comfortable seating', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 0, 2, 1);
    PRINT 'Executive Suite added';
END

-- VVIP Presidential Suite
IF @VVIPSuiteID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @VVIPSuiteID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@VVIPSuiteID, 'VVIP Presidential Suite', 'Ultimate luxury accommodation', 'The pinnacle of luxury', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 1, 1, 1);
    PRINT 'VVIP Suite added';
END

-- Standard Studio
IF @StandardStudioID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @StandardStudioID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@StandardStudioID, 'Standard Studio', 'Comfortable and affordable', 'Perfect for budget travelers', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 1, 1, 1);
    PRINT 'Standard Studio added';
END

-- Swimming Pool
IF @PoolID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @PoolID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@PoolID, 'Swimming Pool', 'Infinity pool with city views', 'Relax by our stunning pool', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', 1, 1, 1),
        (@PoolID, 'Pool Evening', 'Night ambiance', 'Beautiful illuminated pool', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 0, 2, 1);
    PRINT 'Swimming Pool added';
END

-- Lobby
IF @LobbyID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @LobbyID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@LobbyID, 'Lobby', 'Grand entrance and reception', 'Impressive hotel lobby', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 1, 1, 1);
    PRINT 'Lobby added';
END

-- Restaurant Gallery
IF @RestaurantID IS NOT NULL
BEGIN
    DELETE FROM GalleryItems WHERE CategoryID = @RestaurantID;
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@RestaurantID, 'Main Dining Hall', 'Elegant fine dining', 'Sophisticated dining experience', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 1, 1, 1);
    PRINT 'Restaurant Gallery added';
END

GO

-- Add Menu Items
DECLARE @IslamabadRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Islamabad');
DECLARE @LahoreRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Lahore');
DECLARE @KarachiRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Karachi');

-- Update Restaurant Images
IF @IslamabadRestID IS NOT NULL
BEGIN
    UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' WHERE RestaurantID = @IslamabadRestID;
END

IF @LahoreRestID IS NOT NULL
BEGIN
    UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800' WHERE RestaurantID = @LahoreRestID;
END

IF @KarachiRestID IS NOT NULL
BEGIN
    UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800' WHERE RestaurantID = @KarachiRestID;
END

-- Islamabad Menu
IF @IslamabadRestID IS NOT NULL
BEGIN
    DELETE FROM MenuItems WHERE RestaurantID = @IslamabadRestID;
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@IslamabadRestID, 'Chicken Tikka', 'Tender chicken pieces marinated in yogurt and spices', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 1200, 4.8, 'Appetizers', 'Pakistani', 1, 0, 1, 1),
        (@IslamabadRestID, 'Seekh Kabab', 'Minced meat skewers with aromatic spices', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 1500, 4.7, 'Appetizers', 'Pakistani', 1, 0, 2, 1),
        (@IslamabadRestID, 'Chicken Karahi', 'Traditional Pakistani chicken curry', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', 1800, 4.9, 'Main Course', 'Pakistani', 1, 0, 3, 1),
        (@IslamabadRestID, 'Mutton Biryani', 'Fragrant rice with tender mutton', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', 2200, 4.8, 'Main Course', 'Pakistani', 1, 0, 4, 1),
        (@IslamabadRestID, 'Dal Makhani', 'Creamy black lentils with butter', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', 900, 4.6, 'Main Course', 'Pakistani', 0, 1, 5, 1),
        (@IslamabadRestID, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 'https://images.unsplash.com/photo-1589119908995-c6c1f4e8b8a0?w=600', 500, 4.7, 'Desserts', 'Pakistani', 0, 1, 6, 1);
    PRINT 'Islamabad menu added';
END

-- Lahore Menu
IF @LahoreRestID IS NOT NULL
BEGIN
    DELETE FROM MenuItems WHERE RestaurantID = @LahoreRestID;
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@LahoreRestID, 'Beef Steak', 'Grilled beef with mushroom sauce', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600', 2500, 4.9, 'Main Course', 'Continental', 0, 0, 1, 1),
        (@LahoreRestID, 'Grilled Salmon', 'Fresh salmon with lemon butter', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 2800, 4.8, 'Main Course', 'Continental', 0, 0, 2, 1),
        (@LahoreRestID, 'Caesar Salad', 'Romaine lettuce with parmesan', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', 800, 4.5, 'Appetizers', 'Continental', 0, 1, 3, 1),
        (@LahoreRestID, 'Chocolate Lava Cake', 'Warm cake with molten center', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 700, 4.9, 'Desserts', 'Continental', 0, 1, 4, 1);
    PRINT 'Lahore menu added';
END

-- Karachi Menu
IF @KarachiRestID IS NOT NULL
BEGIN
    DELETE FROM MenuItems WHERE RestaurantID = @KarachiRestID;
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@KarachiRestID, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600', 1600, 4.7, 'Main Course', 'Chinese', 1, 0, 1, 1),
        (@KarachiRestID, 'Sweet and Sour Fish', 'Crispy fish in tangy sauce', 'https://images.unsplash.com/photo-1580959375944-e8028afcbf39?w=600', 1900, 4.6, 'Main Course', 'Chinese', 0, 0, 2, 1),
        (@KarachiRestID, 'Spring Rolls', 'Crispy vegetable spring rolls', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', 600, 4.5, 'Appetizers', 'Chinese', 0, 1, 3, 1),
        (@KarachiRestID, 'Fried Rice', 'Egg fried rice with vegetables', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', 800, 4.6, 'Main Course', 'Chinese', 0, 1, 4, 1),
        (@KarachiRestID, 'Mango Pudding', 'Sweet mango dessert', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 450, 4.8, 'Desserts', 'Chinese', 0, 1, 5, 1);
    PRINT 'Karachi menu added';
END

GO

PRINT '==============================================';
PRINT 'Quick seed completed successfully!';
PRINT 'Gallery: 7 categories with images';
PRINT 'Restaurants: 3 locations with images';
PRINT 'Menu Items: 15 items total';
PRINT '==============================================';
GO
