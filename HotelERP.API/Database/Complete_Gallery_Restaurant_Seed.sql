-- Complete Gallery & Restaurant Data Seed with Professional Images
-- Minimum 3 images per category, proper restaurant and menu item images

USE HMS_DB;
GO

PRINT 'Starting complete data seed...';
GO

-- Clear existing data
DELETE FROM GalleryItems;
DELETE FROM MenuItems;
GO

-- Update Restaurant Images
UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' WHERE Location = 'Islamabad';
UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800' WHERE Location = 'Lahore';
UPDATE Restaurants SET ImagePath = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800' WHERE Location = 'Karachi';
GO

-- =============================================
-- GALLERY IMAGES - Minimum 3 per category
-- =============================================

-- Deluxe Studio (3 images)
DECLARE @DeluxeStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Deluxe Studio');
IF @DeluxeStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@DeluxeStudioID, 'Deluxe Studio', 'Elegant studio with modern amenities', 'Spacious room with king-size bed and city views', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 1, 1, 1),
        (@DeluxeStudioID, 'Deluxe Studio Interior', 'Modern design', 'Contemporary furnishings and elegant decor', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 0, 2, 1),
        (@DeluxeStudioID, 'Deluxe Studio Bathroom', 'Luxury bathroom', 'Premium fixtures and spa-like ambiance', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', 0, 3, 1);
    PRINT 'Deluxe Studio: 3 images added';
END

-- Executive Suite (3 images)
DECLARE @ExecutiveSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Executive Suite');
IF @ExecutiveSuiteID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@ExecutiveSuiteID, 'Executive Suite', 'Luxurious suite with panoramic views', 'Premium accommodation with separate living area', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 1, 1, 1),
        (@ExecutiveSuiteID, 'Executive Living Area', 'Spacious living room', 'Comfortable seating and work space', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 0, 2, 1),
        (@ExecutiveSuiteID, 'Executive Bedroom', 'Master bedroom', 'King-size bed with premium linens', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 0, 3, 1);
    PRINT 'Executive Suite: 3 images added';
END

-- VVIP Presidential Suite (3 images)
DECLARE @VVIPSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'VVIP Presidential Suite');
IF @VVIPSuiteID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@VVIPSuiteID, 'VVIP Presidential Suite', 'Ultimate luxury accommodation', 'The pinnacle of luxury and comfort', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 1, 1, 1),
        (@VVIPSuiteID, 'Presidential Living Room', 'Grand living space', 'Elegant furnishings and stunning views', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', 0, 2, 1),
        (@VVIPSuiteID, 'Presidential Dining', 'Private dining area', 'Exclusive dining experience', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 0, 3, 1);
    PRINT 'VVIP Presidential Suite: 3 images added';
END

-- Standard Studio (3 images)
DECLARE @StandardStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Standard Studio');
IF @StandardStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@StandardStudioID, 'Standard Studio', 'Comfortable and affordable', 'Perfect for budget-conscious travelers', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 1, 1, 1),
        (@StandardStudioID, 'Standard Room View', 'Cozy atmosphere', 'Clean and comfortable accommodation', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800', 0, 2, 1),
        (@StandardStudioID, 'Standard Amenities', 'Modern facilities', 'All essential amenities included', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800', 0, 3, 1);
    PRINT 'Standard Studio: 3 images added';
END

-- Swimming Pool (3 images)
DECLARE @PoolID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Swimming Pool');
IF @PoolID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@PoolID, 'Swimming Pool', 'Infinity pool with city views', 'Relax by our stunning infinity pool', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', 1, 1, 1),
        (@PoolID, 'Pool Evening View', 'Night ambiance', 'Beautiful illuminated pool at night', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 0, 2, 1),
        (@PoolID, 'Pool Deck', 'Relaxation area', 'Comfortable loungers and cabanas', 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800', 0, 3, 1);
    PRINT 'Swimming Pool: 3 images added';
END

-- Lobby (3 images)
DECLARE @LobbyID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Lobby');
IF @LobbyID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@LobbyID, 'Lobby', 'Grand entrance and reception', 'Impressive hotel lobby with elegant design', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 1, 1, 1),
        (@LobbyID, 'Lobby Lounge', 'Comfortable seating', 'Relaxing lounge area', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800', 0, 2, 1),
        (@LobbyID, 'Reception Desk', 'Welcome area', '24/7 front desk service', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 0, 3, 1);
    PRINT 'Lobby: 3 images added';
END

-- Main Dining Hall (3 images)
DECLARE @RestaurantID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Main Dining Hall');
IF @RestaurantID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@RestaurantID, 'Main Dining Hall', 'Elegant fine dining', 'Sophisticated dining experience', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 1, 1, 1),
        (@RestaurantID, 'Dining Interior', 'Refined atmosphere', 'Elegant table settings', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 0, 2, 1),
        (@RestaurantID, 'Private Dining', 'Exclusive area', 'Private dining rooms available', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 0, 3, 1);
    PRINT 'Main Dining Hall: 3 images added';
END

GO

-- =============================================
-- MENU ITEMS with Professional Food Images
-- =============================================

DECLARE @IslamabadRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Islamabad');
DECLARE @LahoreRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Lahore');
DECLARE @KarachiRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Karachi');

-- Islamabad Restaurant Menu (Pakistani Cuisine)
IF @IslamabadRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@IslamabadRestID, 'Chicken Tikka', 'Tender chicken pieces marinated in yogurt and spices', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 1200, 4.8, 'Appetizers', 'Pakistani', 1, 0, 1, 1),
        (@IslamabadRestID, 'Seekh Kabab', 'Minced meat skewers with aromatic spices', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 1500, 4.7, 'Appetizers', 'Pakistani', 1, 0, 2, 1),
        (@IslamabadRestID, 'Chicken Karahi', 'Traditional Pakistani chicken curry in wok', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', 1800, 4.9, 'Main Course', 'Pakistani', 1, 0, 3, 1),
        (@IslamabadRestID, 'Mutton Biryani', 'Fragrant basmati rice with tender mutton', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', 2200, 4.8, 'Main Course', 'Pakistani', 1, 0, 4, 1),
        (@IslamabadRestID, 'Dal Makhani', 'Creamy black lentils slow-cooked with butter', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', 900, 4.6, 'Main Course', 'Pakistani', 0, 1, 5, 1),
        (@IslamabadRestID, 'Gulab Jamun', 'Sweet milk dumplings in rose-flavored syrup', 'https://images.unsplash.com/photo-1589119908995-c6c1f4e8b8a0?w=600', 500, 4.7, 'Desserts', 'Pakistani', 0, 1, 6, 1);
    PRINT 'Islamabad menu: 6 items added';
END

-- Lahore Restaurant Menu (Continental Cuisine)
IF @LahoreRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@LahoreRestID, 'Beef Steak', 'Grilled beef tenderloin with mushroom sauce', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600', 2500, 4.9, 'Main Course', 'Continental', 0, 0, 1, 1),
        (@LahoreRestID, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 2800, 4.8, 'Main Course', 'Continental', 0, 0, 2, 1),
        (@LahoreRestID, 'Caesar Salad', 'Crisp romaine lettuce with parmesan', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', 800, 4.5, 'Appetizers', 'Continental', 0, 1, 3, 1),
        (@LahoreRestID, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 700, 4.9, 'Desserts', 'Continental', 0, 1, 4, 1),
        (@LahoreRestID, 'Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600', 1400, 4.7, 'Main Course', 'Continental', 0, 0, 5, 1);
    PRINT 'Lahore menu: 5 items added';
END

-- Karachi Restaurant Menu (Chinese Cuisine)
IF @KarachiRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@KarachiRestID, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600', 1600, 4.7, 'Main Course', 'Chinese', 1, 0, 1, 1),
        (@KarachiRestID, 'Sweet and Sour Fish', 'Crispy fish in tangy sweet sauce', 'https://images.unsplash.com/photo-1580959375944-e8028afcbf39?w=600', 1900, 4.6, 'Main Course', 'Chinese', 0, 0, 2, 1),
        (@KarachiRestID, 'Spring Rolls', 'Crispy vegetable spring rolls', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', 600, 4.5, 'Appetizers', 'Chinese', 0, 1, 3, 1),
        (@KarachiRestID, 'Fried Rice', 'Egg fried rice with mixed vegetables', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', 800, 4.6, 'Main Course', 'Chinese', 0, 1, 4, 1),
        (@KarachiRestID, 'Mango Pudding', 'Sweet mango dessert with cream', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 450, 4.8, 'Desserts', 'Chinese', 0, 1, 5, 1),
        (@KarachiRestID, 'Dim Sum Platter', 'Assorted steamed dumplings', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', 1200, 4.7, 'Appetizers', 'Chinese', 0, 0, 6, 1);
    PRINT 'Karachi menu: 6 items added';
END

GO

PRINT '==============================================';
PRINT 'Complete seed finished successfully!';
PRINT 'Gallery Categories: 7 with 3+ images each';
PRINT 'Restaurants: 3 with images';
PRINT 'Menu Items: 17 total with images';
PRINT '==============================================';
GO
