-- Seed Sample Gallery and Restaurant Data
-- This adds sample images and menu items for testing

USE HMS_DB;
GO

-- First, ensure we have the categories (already created by Create_Restaurant_Tables.sql)
-- Now add sample gallery images

PRINT 'Adding sample gallery images...';
GO

-- Deluxe Studio Images
DECLARE @DeluxeStudioID INT = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Deluxe Studio');
IF @DeluxeStudioID IS NOT NULL AND NOT EXISTS (SELECT * FROM GalleryItems WHERE CategoryID = @DeluxeStudioID)
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@DeluxeStudioID, 'Deluxe Studio', 'Elegant studio with modern amenities', 'Spacious room with king-size bed', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 1, 1, 1),
        (@DeluxeStudioID, 'Deluxe Studio View', 'City view', 'Beautiful city skyline view', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 0, 2, 1),
        (@DeluxeStudioID, 'Deluxe Studio Bathroom', 'Luxury bathroom', 'Modern bathroom with premium fixtures', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', 0, 3, 1);
    PRINT 'Deluxe Studio images added';
END
GO

-- Executive Suite Images
IF NOT EXISTS (SELECT * FROM GalleryItems WHERE CategoryID = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Executive Suite'))
BEGIN
    DECLARE @ExecutiveSuiteID INT = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Executive Suite');
    
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@ExecutiveSuiteID, 'Executive Suite', 'Luxurious suite with panoramic views', 'Premium accommodation with separate living area', '/Gallery/Items/executive-suite-1.jpg', 1, 1, 1),
        (@ExecutiveSuiteID, 'Executive Suite Living', 'Spacious living area', 'Comfortable seating and work space', '/Gallery/Items/executive-suite-2.jpg', 0, 2, 1);
END
GO

-- VVIP Presidential Suite Images
IF NOT EXISTS (SELECT * FROM GalleryItems WHERE CategoryID = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'VVIP Presidential Suite'))
BEGIN
    DECLARE @VVIPSuiteID INT = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'VVIP Presidential Suite');
    
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@VVIPSuiteID, 'VVIP Presidential Suite', 'Ultimate luxury accommodation', 'The pinnacle of luxury and comfort', '/Gallery/Items/vvip-suite-1.jpg', 1, 1, 1),
        (@VVIPSuiteID, 'Presidential Bedroom', 'Master bedroom', 'King-size bed with premium linens', '/Gallery/Items/vvip-suite-2.jpg', 0, 2, 1);
END
GO

-- Standard Studio Images
IF NOT EXISTS (SELECT * FROM GalleryItems WHERE CategoryID = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Standard Studio'))
BEGIN
    DECLARE @StandardStudioID INT = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Standard Studio');
    
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@StandardStudioID, 'Standard Studio', 'Comfortable and affordable accommodation', 'Perfect for budget-conscious travelers', '/Gallery/Items/standard-studio-1.jpg', 1, 1, 1);
END
GO

-- Swimming Pool Images
IF NOT EXISTS (SELECT * FROM GalleryItems WHERE CategoryID = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Swimming Pool'))
BEGIN
    DECLARE @PoolID INT = (SELECT CategoryID FROM GalleryCategories WHERE Title = 'Swimming Pool');
    
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@PoolID, 'Swimming Pool', 'Infinity pool with city views', 'Relax by our stunning infinity pool', '/Gallery/Items/pool-1.jpg', 1, 1, 1),
        (@PoolID, 'Pool Night View', 'Evening ambiance', 'Beautiful illuminated pool at night', '/Gallery/Items/pool-2.jpg', 0, 2, 1);
END
GO

PRINT 'Sample gallery images added!';
GO

-- Add sample menu items
PRINT 'Adding sample menu items...';

-- Get restaurant IDs and insert all menu items in one batch
DECLARE @IslamabadID INT = (SELECT RestaurantID FROM Restaurants WHERE Location = 'Islamabad');
DECLARE @LahoreID INT = (SELECT RestaurantID FROM Restaurants WHERE Location = 'Lahore');
DECLARE @KarachiID INT = (SELECT RestaurantID FROM Restaurants WHERE Location = 'Karachi');

-- Islamabad Restaurant Menu
IF @IslamabadID IS NOT NULL AND NOT EXISTS (SELECT * FROM MenuItems WHERE RestaurantID = @IslamabadID)
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@IslamabadID, 'Chicken Tikka', 'Tender chicken pieces marinated in yogurt and spices', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 1200, 4.8, 'Appetizers', 'Pakistani', 1, 0, 1, 1),
        (@IslamabadID, 'Seekh Kabab', 'Minced meat skewers with aromatic spices', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 1500, 4.7, 'Appetizers', 'Pakistani', 1, 0, 2, 1),
        (@IslamabadID, 'Chicken Karahi', 'Traditional Pakistani chicken curry', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', 1800, 4.9, 'Main Course', 'Pakistani', 1, 0, 3, 1),
        (@IslamabadID, 'Mutton Biryani', 'Fragrant rice with tender mutton pieces', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', 2200, 4.8, 'Main Course', 'Pakistani', 1, 0, 4, 1),
        (@IslamabadID, 'Dal Makhani', 'Creamy black lentils slow-cooked with butter', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', 900, 4.6, 'Main Course', 'Pakistani', 0, 1, 5, 1),
        (@IslamabadID, 'Gulab Jamun', 'Sweet milk dumplings in sugar syrup', 'https://images.unsplash.com/photo-1589119908995-c6c1f4e8b8a0?w=600', 500, 4.7, 'Desserts', 'Pakistani', 0, 1, 6, 1);
    PRINT 'Islamabad menu added';
END

-- Lahore Restaurant Menu
IF @LahoreID IS NOT NULL AND NOT EXISTS (SELECT * FROM MenuItems WHERE RestaurantID = @LahoreID)
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@LahoreID, 'Beef Steak', 'Grilled beef steak with mushroom sauce', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600', 2500, 4.9, 'Main Course', 'Continental', 0, 0, 1, 1),
        (@LahoreID, 'Grilled Salmon', 'Fresh salmon with lemon butter sauce', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 2800, 4.8, 'Main Course', 'Continental', 0, 0, 2, 1),
        (@LahoreID, 'Caesar Salad', 'Fresh romaine lettuce with parmesan', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', 800, 4.5, 'Appetizers', 'Continental', 0, 1, 3, 1),
        (@LahoreID, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 700, 4.9, 'Desserts', 'Continental', 0, 1, 4, 1);
    PRINT 'Lahore menu added';
END

-- Karachi Restaurant Menu
IF @KarachiID IS NOT NULL AND NOT EXISTS (SELECT * FROM MenuItems WHERE RestaurantID = @KarachiID)
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@KarachiID, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600', 1600, 4.7, 'Main Course', 'Chinese', 1, 0, 1, 1),
        (@KarachiID, 'Sweet and Sour Fish', 'Crispy fish in tangy sauce', 'https://images.unsplash.com/photo-1580959375944-e8028afcbf39?w=600', 1900, 4.6, 'Main Course', 'Chinese', 0, 0, 2, 1),
        (@KarachiID, 'Spring Rolls', 'Crispy vegetable spring rolls', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', 600, 4.5, 'Appetizers', 'Chinese', 0, 1, 3, 1),
        (@KarachiID, 'Fried Rice', 'Egg fried rice with vegetables', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', 800, 4.6, 'Main Course', 'Chinese', 0, 1, 4, 1),
        (@KarachiID, 'Mango Pudding', 'Sweet mango dessert', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 450, 4.8, 'Desserts', 'Chinese', 0, 1, 5, 1);
    PRINT 'Karachi menu added';
END
GO

PRINT '==============================================';
PRINT 'Sample data seeded successfully!';
PRINT 'Gallery Images: Added';
PRINT 'Menu Items: Added';
PRINT '==============================================';
GO
