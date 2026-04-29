-- Complete Gallery Seed with LOCAL image paths (after downloading images)
-- Run this AFTER running download-gallery-images.js

USE HMS_DB;
GO

PRINT 'Starting gallery seed with local image paths...';
GO

-- Clear existing gallery data
DELETE FROM GalleryItems;
DELETE FROM MenuItems;
GO

-- Update Restaurant Images (local paths)
UPDATE Restaurants SET ImagePath = '/Gallery/Restaurants/restaurant-islamabad.jpg' WHERE Location = 'Islamabad';
UPDATE Restaurants SET ImagePath = '/Gallery/Restaurants/restaurant-lahore.jpg' WHERE Location = 'Lahore';
UPDATE Restaurants SET ImagePath = '/Gallery/Restaurants/restaurant-karachi.jpg' WHERE Location = 'Karachi';
GO

-- =============================================
-- DELUXE STUDIO (4 images)
-- =============================================
DECLARE @DeluxeStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Deluxe Studio');
IF @DeluxeStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@DeluxeStudioID, 
         'Deluxe Studio - Main View', 
         'Elegant studio with modern amenities', 
         'Spacious deluxe studio featuring a king-size bed, contemporary furnishings, and stunning city views. Perfect for business travelers and couples seeking comfort and style.',
         '/Gallery/Items/deluxe-studio-1.jpg',
         1, 1, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Living Area', 
         'Comfortable seating and work space', 
         'Well-appointed living area with plush seating, modern work desk, and high-speed WiFi. Ideal for both relaxation and productivity.',
         '/Gallery/Items/deluxe-studio-2.jpg',
         0, 2, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Bathroom', 
         'Luxury bathroom with premium fixtures', 
         'Spa-like bathroom featuring marble countertops, rain shower, premium toiletries, and soft bathrobes for ultimate comfort.',
         '/Gallery/Items/deluxe-studio-3.jpg',
         0, 3, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Night View', 
         'Stunning evening ambiance', 
         'Experience the beauty of the city lights from your private studio. Ambient lighting creates a warm and inviting atmosphere.',
         '/Gallery/Items/deluxe-studio-4.jpg',
         0, 4, 1);
    PRINT 'Deluxe Studio: 4 images added';
END

-- =============================================
-- EXECUTIVE SUITE (4 images)
-- =============================================
DECLARE @ExecutiveSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Executive Suite');
IF @ExecutiveSuiteID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@ExecutiveSuiteID, 
         'Executive Suite - Panoramic View', 
         'Luxurious suite with breathtaking views', 
         'Our signature Executive Suite offers 800 sq ft of luxury living space with floor-to-ceiling windows, separate living and sleeping areas, and panoramic city views.',
         '/Gallery/Items/executive-suite-1.jpg',
         1, 1, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Living Room', 
         'Spacious living area for entertaining', 
         'Elegant living room with designer furniture, 55-inch smart TV, minibar, and comfortable seating for up to 6 guests. Perfect for business meetings or family gatherings.',
         '/Gallery/Items/executive-suite-2.jpg',
         0, 2, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Master Bedroom', 
         'King-size bed with premium linens', 
         'Luxurious master bedroom featuring a California king bed, premium Egyptian cotton linens, blackout curtains, and a dedicated workspace.',
         '/Gallery/Items/executive-suite-3.jpg',
         0, 3, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Dining Area', 
         'Private dining for 4 guests', 
         'Elegant dining area with seating for 4, perfect for in-room dining or business discussions. Includes complimentary coffee and tea service.',
         '/Gallery/Items/executive-suite-4.jpg',
         0, 4, 1);
    PRINT 'Executive Suite: 4 images added';
END

-- =============================================
-- VVIP PRESIDENTIAL SUITE (4 images)
-- =============================================
DECLARE @VVIPSuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'VVIP Presidential Suite');
IF @VVIPSuiteID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@VVIPSuiteID, 
         'Presidential Suite - Grand Entrance', 
         'Ultimate luxury accommodation', 
         'The pinnacle of luxury living - our 1500 sq ft Presidential Suite features a grand entrance, private elevator access, and unparalleled elegance throughout.',
         '/Gallery/Items/vvip-suite-1.jpg',
         1, 1, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Living Room', 
         'Opulent living space', 
         'Expansive living room with designer Italian furniture, crystal chandelier, grand piano, and entertainment system. Accommodates up to 12 guests for private events.',
         '/Gallery/Items/vvip-suite-2.jpg',
         0, 2, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Private Dining', 
         'Exclusive dining experience', 
         'Private dining room with seating for 8, complete with butler service, wine cellar access, and custom menu options from our executive chef.',
         '/Gallery/Items/vvip-suite-3.jpg',
         0, 3, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Master Bath', 
         'Spa-quality bathroom', 
         'Marble bathroom with jacuzzi tub, separate rain shower, dual vanities, heated floors, and premium Hermès toiletries.',
         '/Gallery/Items/vvip-suite-4.jpg',
         0, 4, 1);
    PRINT 'VVIP Presidential Suite: 4 images added';
END

-- =============================================
-- STANDARD STUDIO (3 images)
-- =============================================
DECLARE @StandardStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Standard Studio');
IF @StandardStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@StandardStudioID, 
         'Standard Studio - Cozy Comfort', 
         'Comfortable and affordable', 
         'Our Standard Studio offers 350 sq ft of well-designed space with a queen-size bed, modern amenities, and all the essentials for a comfortable stay.',
         '/Gallery/Items/standard-studio-1.jpg',
         1, 1, 1),
        
        (@StandardStudioID, 
         'Standard Studio - Work Space', 
         'Functional workspace', 
         'Dedicated work area with ergonomic chair, ample desk space, and complimentary high-speed WiFi. Perfect for business travelers on a budget.',
         '/Gallery/Items/standard-studio-2.jpg',
         0, 2, 1),
        
        (@StandardStudioID, 
         'Standard Studio - Bathroom', 
         'Clean and modern facilities', 
         'Well-maintained bathroom with shower, fresh towels, and complimentary toiletries. Simple yet comfortable.',
         '/Gallery/Items/standard-studio-3.jpg',
         0, 3, 1);
    PRINT 'Standard Studio: 3 images added';
END

-- =============================================
-- SWIMMING POOL (4 images)
-- =============================================
DECLARE @PoolID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Swimming Pool');
IF @PoolID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@PoolID, 
         'Infinity Pool - Daytime', 
         'Stunning infinity pool with city views', 
         'Our signature rooftop infinity pool offers breathtaking panoramic city views. Heated year-round, with depth ranging from 4ft to 6ft.',
         '/Gallery/Items/pool-1.jpg',
         1, 1, 1),
        
        (@PoolID, 
         'Pool - Evening Ambiance', 
         'Beautiful illuminated pool at night', 
         'Experience the magic of our illuminated pool at night. LED underwater lighting creates a stunning atmosphere perfect for evening swims.',
         '/Gallery/Items/pool-2.jpg',
         0, 2, 1),
        
        (@PoolID, 
         'Pool Deck - Relaxation Area', 
         'Comfortable loungers and cabanas', 
         'Spacious pool deck with premium sun loungers, private cabanas, towel service, and poolside bar. Open daily from 6 AM to 10 PM.',
         '/Gallery/Items/pool-3.jpg',
         0, 3, 1),
        
        (@PoolID, 
         'Pool Bar', 
         'Refreshments and cocktails', 
         'Full-service pool bar offering tropical cocktails, fresh juices, light snacks, and refreshing beverages. Enjoy your drink with a view.',
         '/Gallery/Items/pool-4.jpg',
         0, 4, 1);
    PRINT 'Swimming Pool: 4 images added';
END

-- =============================================
-- LOBBY (4 images)
-- =============================================
DECLARE @LobbyID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Lobby');
IF @LobbyID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@LobbyID, 
         'Grand Lobby - Main Entrance', 
         'Impressive hotel lobby with elegant design', 
         'Our grand lobby welcomes you with soaring 30-foot ceilings, marble floors, contemporary art installations, and a stunning crystal chandelier.',
         '/Gallery/Items/lobby-1.jpg',
         1, 1, 1),
        
        (@LobbyID, 
         'Lobby Lounge', 
         'Comfortable seating area', 
         'Elegant lounge area with plush seating, perfect for business meetings or casual conversations. Complimentary WiFi and refreshments available.',
         '/Gallery/Items/lobby-2.jpg',
         0, 2, 1),
        
        (@LobbyID, 
         'Reception Desk', 
         '24/7 front desk service', 
         'Our professional concierge team is available 24/7 to assist with check-in, reservations, local recommendations, and any special requests.',
         '/Gallery/Items/lobby-3.jpg',
         0, 3, 1),
        
        (@LobbyID, 
         'Lobby Café', 
         'Coffee and light refreshments', 
         'Lobby café serving premium coffee, pastries, and light meals throughout the day. Perfect spot for a quick breakfast or afternoon tea.',
         '/Gallery/Items/lobby-4.jpg',
         0, 4, 1);
    PRINT 'Lobby: 4 images added';
END

-- =============================================
-- MENU ITEMS with LOCAL paths
-- =============================================

DECLARE @IslamabadRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Islamabad');
DECLARE @LahoreRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Lahore');
DECLARE @KarachiRestID INT = (SELECT TOP 1 RestaurantID FROM Restaurants WHERE Location = 'Karachi');

-- Islamabad Restaurant Menu (Pakistani Cuisine)
IF @IslamabadRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@IslamabadRestID, 'Chicken Tikka', 'Tender chicken pieces marinated in yogurt and aromatic spices, grilled to perfection', '/Gallery/MenuItems/chicken-tikka.jpg', 1200, 4.8, 'Appetizers', 'Pakistani', 1, 0, 1, 1),
        (@IslamabadRestID, 'Seekh Kabab', 'Minced meat skewers seasoned with traditional spices and herbs', '/Gallery/MenuItems/seekh-kabab.jpg', 1500, 4.7, 'Appetizers', 'Pakistani', 1, 0, 2, 1),
        (@IslamabadRestID, 'Chicken Karahi', 'Traditional Pakistani chicken curry cooked in a wok with tomatoes and spices', '/Gallery/MenuItems/chicken-karahi.jpg', 1800, 4.9, 'Main Course', 'Pakistani', 1, 0, 3, 1),
        (@IslamabadRestID, 'Mutton Biryani', 'Fragrant basmati rice layered with tender mutton and aromatic spices', '/Gallery/MenuItems/mutton-biryani.jpg', 2200, 4.8, 'Main Course', 'Pakistani', 1, 0, 4, 1),
        (@IslamabadRestID, 'Dal Makhani', 'Creamy black lentils slow-cooked with butter and cream', '/Gallery/MenuItems/dal-makhani.jpg', 900, 4.6, 'Main Course', 'Pakistani', 0, 1, 5, 1),
        (@IslamabadRestID, 'Gulab Jamun', 'Sweet milk dumplings soaked in rose-flavored sugar syrup', '/Gallery/MenuItems/dal-makhani.jpg', 500, 4.7, 'Desserts', 'Pakistani', 0, 1, 6, 1);
    PRINT 'Islamabad menu: 6 items added';
END

-- Lahore Restaurant Menu (Continental Cuisine)
IF @LahoreRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@LahoreRestID, 'Beef Steak', 'Premium grilled beef tenderloin with mushroom sauce and seasonal vegetables', '/Gallery/MenuItems/beef-steak.jpg', 2500, 4.9, 'Main Course', 'Continental', 0, 0, 1, 1),
        (@LahoreRestID, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce and asparagus', '/Gallery/MenuItems/grilled-salmon.jpg', 2800, 4.8, 'Main Course', 'Continental', 0, 0, 2, 1),
        (@LahoreRestID, 'Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and classic Caesar dressing', '/Gallery/MenuItems/caesar-salad.jpg', 800, 4.5, 'Appetizers', 'Continental', 0, 1, 3, 1),
        (@LahoreRestID, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', '/Gallery/MenuItems/chocolate-lava-cake.jpg', 700, 4.9, 'Desserts', 'Continental', 0, 1, 4, 1),
        (@LahoreRestID, 'Pasta Carbonara', 'Creamy pasta with bacon, parmesan, and black pepper', '/Gallery/MenuItems/pasta-carbonara.jpg', 1400, 4.7, 'Main Course', 'Continental', 0, 0, 5, 1);
    PRINT 'Lahore menu: 5 items added';
END

-- Karachi Restaurant Menu (Chinese Cuisine)
IF @KarachiRestID IS NOT NULL
BEGIN
    INSERT INTO MenuItems (RestaurantID, Name, Description, ImagePath, Price, Rating, Category, Cuisine, IsSpicy, IsVegetarian, DisplayOrder, IsActive)
    VALUES 
        (@KarachiRestID, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers', '/Gallery/MenuItems/kung-pao-chicken.jpg', 1600, 4.7, 'Main Course', 'Chinese', 1, 0, 1, 1),
        (@KarachiRestID, 'Sweet and Sour Fish', 'Crispy fish fillets in tangy sweet and sour sauce', '/Gallery/MenuItems/spring-rolls.jpg', 1900, 4.6, 'Main Course', 'Chinese', 0, 0, 2, 1),
        (@KarachiRestID, 'Spring Rolls', 'Crispy vegetable spring rolls served with sweet chili sauce', '/Gallery/MenuItems/spring-rolls.jpg', 600, 4.5, 'Appetizers', 'Chinese', 0, 1, 3, 1),
        (@KarachiRestID, 'Fried Rice', 'Egg fried rice with mixed vegetables and soy sauce', '/Gallery/MenuItems/fried-rice.jpg', 800, 4.6, 'Main Course', 'Chinese', 0, 1, 4, 1),
        (@KarachiRestID, 'Mango Pudding', 'Sweet mango dessert with fresh cream', '/Gallery/MenuItems/mango-pudding.jpg', 450, 4.8, 'Desserts', 'Chinese', 0, 1, 5, 1),
        (@KarachiRestID, 'Dim Sum Platter', 'Assorted steamed dumplings with dipping sauces', '/Gallery/MenuItems/dim-sum.jpg', 1200, 4.7, 'Appetizers', 'Chinese', 0, 0, 6, 1);
    PRINT 'Karachi menu: 6 items added';
END

GO

PRINT '==============================================';
PRINT 'Gallery seed with LOCAL paths complete!';
PRINT 'Gallery Images: 24 images across 6 categories';
PRINT 'Restaurant Images: 3 locations';
PRINT 'Menu Items: 17 items with images';
PRINT 'All images stored in wwwroot/Gallery/';
PRINT '==============================================';
GO
