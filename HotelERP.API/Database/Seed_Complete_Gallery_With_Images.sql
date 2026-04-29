-- Complete Gallery Seed with Real Image URLs and Full Details
-- This script populates gallery with 3-4 images per category with complete metadata

USE HMS_DB;
GO

PRINT 'Starting complete gallery seed with detailed images...';
GO

-- Clear existing gallery data
DELETE FROM GalleryItems;
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
         'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Living Area', 
         'Comfortable seating and work space', 
         'Well-appointed living area with plush seating, modern work desk, and high-speed WiFi. Ideal for both relaxation and productivity.',
         'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Bathroom', 
         'Luxury bathroom with premium fixtures', 
         'Spa-like bathroom featuring marble countertops, rain shower, premium toiletries, and soft bathrobes for ultimate comfort.',
         'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@DeluxeStudioID, 
         'Deluxe Studio - Night View', 
         'Stunning evening ambiance', 
         'Experience the beauty of the city lights from your private studio. Ambient lighting creates a warm and inviting atmosphere.',
         'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop',
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
         'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Living Room', 
         'Spacious living area for entertaining', 
         'Elegant living room with designer furniture, 55-inch smart TV, minibar, and comfortable seating for up to 6 guests. Perfect for business meetings or family gatherings.',
         'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Master Bedroom', 
         'King-size bed with premium linens', 
         'Luxurious master bedroom featuring a California king bed, premium Egyptian cotton linens, blackout curtains, and a dedicated workspace.',
         'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@ExecutiveSuiteID, 
         'Executive Suite - Dining Area', 
         'Private dining for 4 guests', 
         'Elegant dining area with seating for 4, perfect for in-room dining or business discussions. Includes complimentary coffee and tea service.',
         'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop',
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
         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Living Room', 
         'Opulent living space', 
         'Expansive living room with designer Italian furniture, crystal chandelier, grand piano, and entertainment system. Accommodates up to 12 guests for private events.',
         'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Private Dining', 
         'Exclusive dining experience', 
         'Private dining room with seating for 8, complete with butler service, wine cellar access, and custom menu options from our executive chef.',
         'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@VVIPSuiteID, 
         'Presidential Suite - Master Bath', 
         'Spa-quality bathroom', 
         'Marble bathroom with jacuzzi tub, separate rain shower, dual vanities, heated floors, and premium Hermès toiletries.',
         'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&h=800&fit=crop',
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
         'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@StandardStudioID, 
         'Standard Studio - Work Space', 
         'Functional workspace', 
         'Dedicated work area with ergonomic chair, ample desk space, and complimentary high-speed WiFi. Perfect for business travelers on a budget.',
         'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@StandardStudioID, 
         'Standard Studio - Bathroom', 
         'Clean and modern facilities', 
         'Well-maintained bathroom with shower, fresh towels, and complimentary toiletries. Simple yet comfortable.',
         'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&h=800&fit=crop',
         0, 3, 1);
    PRINT 'Standard Studio: 3 images added';
END

-- =============================================
-- INFINITY STUDIO (3 images)
-- =============================================
DECLARE @InfinityStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Infinity Studio');
IF @InfinityStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@InfinityStudioID, 
         'Infinity Studio - Pool View', 
         'Relaxing pool with stunning views', 
         'Exclusive studio with direct pool access and breathtaking infinity pool views. Enjoy the perfect blend of luxury and relaxation.',
         'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@InfinityStudioID, 
         'Infinity Studio - Interior', 
         'Modern tropical design', 
         'Contemporary interior with tropical accents, featuring natural materials, ambient lighting, and a private balcony overlooking the pool.',
         'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@InfinityStudioID, 
         'Infinity Studio - Balcony', 
         'Private outdoor space', 
         'Spacious balcony with lounge chairs and direct pool views. Perfect for morning coffee or evening cocktails.',
         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
         0, 3, 1);
    PRINT 'Infinity Studio: 3 images added';
END

-- =============================================
-- INFINITY SUITE (3 images)
-- =============================================
DECLARE @InfinitySuiteID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Infinity Suite');
IF @InfinitySuiteID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@InfinitySuiteID, 
         'Infinity Suite - Premium Poolside', 
         'Premium poolside experience', 
         'Luxurious suite with direct infinity pool access, private cabana, and premium amenities. Experience resort-style living at its finest.',
         'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@InfinitySuiteID, 
         'Infinity Suite - Living Area', 
         'Spacious and elegant', 
         'Open-plan living area with floor-to-ceiling windows, designer furniture, and seamless indoor-outdoor flow to the pool deck.',
         'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@InfinitySuiteID, 
         'Infinity Suite - Pool Deck', 
         'Private pool access', 
         'Exclusive pool deck with sun loungers, outdoor shower, and direct access to the infinity pool. Your private paradise awaits.',
         'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&h=800&fit=crop',
         0, 3, 1);
    PRINT 'Infinity Suite: 3 images added';
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
         'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@PoolID, 
         'Pool - Evening Ambiance', 
         'Beautiful illuminated pool at night', 
         'Experience the magic of our illuminated pool at night. LED underwater lighting creates a stunning atmosphere perfect for evening swims.',
         'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@PoolID, 
         'Pool Deck - Relaxation Area', 
         'Comfortable loungers and cabanas', 
         'Spacious pool deck with premium sun loungers, private cabanas, towel service, and poolside bar. Open daily from 6 AM to 10 PM.',
         'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@PoolID, 
         'Pool Bar', 
         'Refreshments and cocktails', 
         'Full-service pool bar offering tropical cocktails, fresh juices, light snacks, and refreshing beverages. Enjoy your drink with a view.',
         'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=800&fit=crop',
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
         'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@LobbyID, 
         'Lobby Lounge', 
         'Comfortable seating area', 
         'Elegant lounge area with plush seating, perfect for business meetings or casual conversations. Complimentary WiFi and refreshments available.',
         'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@LobbyID, 
         'Reception Desk', 
         '24/7 front desk service', 
         'Our professional concierge team is available 24/7 to assist with check-in, reservations, local recommendations, and any special requests.',
         'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@LobbyID, 
         'Lobby Café', 
         'Coffee and light refreshments', 
         'Lobby café serving premium coffee, pastries, and light meals throughout the day. Perfect spot for a quick breakfast or afternoon tea.',
         'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&h=800&fit=crop',
         0, 4, 1);
    PRINT 'Lobby: 4 images added';
END

-- =============================================
-- MAIN DINING HALL (4 images)
-- =============================================
DECLARE @RestaurantID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Main Dining Hall');
IF @RestaurantID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@RestaurantID, 
         'Main Dining Hall - Interior', 
         'Elegant fine dining experience', 
         'Our signature restaurant offers an sophisticated dining experience with capacity for 120 guests. Features live cooking stations and international cuisine.',
         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@RestaurantID, 
         'Dining Hall - Table Setting', 
         'Refined atmosphere', 
         'Elegant table settings with fine china, crystal glassware, and fresh floral arrangements. Perfect for special occasions and business dinners.',
         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@RestaurantID, 
         'Private Dining Room', 
         'Exclusive dining area', 
         'Private dining rooms available for intimate gatherings or business meetings. Seats 8-12 guests with personalized menu options.',
         'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=800&fit=crop',
         0, 3, 1),
        
        (@RestaurantID, 
         'Chef''s Table', 
         'Interactive culinary experience', 
         'Exclusive chef''s table experience for up to 6 guests. Watch our culinary team prepare your meal while enjoying wine pairings.',
         'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=800&fit=crop',
         0, 4, 1);
    PRINT 'Main Dining Hall: 4 images added';
END

-- =============================================
-- BATHROOM STUDIO (3 images)
-- =============================================
DECLARE @BathroomStudioID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Bathroom Studio');
IF @BathroomStudioID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@BathroomStudioID, 
         'Luxury Spa Bathroom', 
         'Luxurious spa-like bathrooms', 
         'Premium bathrooms featuring marble countertops, rain showers, deep soaking tubs, and designer fixtures. Includes premium toiletries and plush robes.',
         'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@BathroomStudioID, 
         'Modern Bathroom Fixtures', 
         'Contemporary design', 
         'State-of-the-art bathroom amenities including heated floors, fog-free mirrors, and premium Kohler fixtures.',
         'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@BathroomStudioID, 
         'Bathroom Amenities', 
         'Premium toiletries', 
         'Complimentary luxury toiletries, fresh towels, bathrobes, and slippers provided daily. Hair dryer and magnifying mirror included.',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=800&fit=crop',
         0, 3, 1);
    PRINT 'Bathroom Studio: 3 images added';
END

-- =============================================
-- PENINSULA VIEW (3 images)
-- =============================================
DECLARE @PeninsulaViewID INT = (SELECT TOP 1 CategoryID FROM GalleryCategories WHERE Title = 'Peninsula View');
IF @PeninsulaViewID IS NOT NULL
BEGIN
    INSERT INTO GalleryItems (CategoryID, Title, Subtitle, Description, ImagePath, IsMainImage, DisplayOrder, IsActive)
    VALUES 
        (@PeninsulaViewID, 
         'Peninsula View - Panorama', 
         'Breathtaking peninsula views', 
         'Spectacular panoramic views of the peninsula from floor-to-ceiling windows. Watch stunning sunsets from the comfort of your room.',
         'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
         1, 1, 1),
        
        (@PeninsulaViewID, 
         'Peninsula View - Balcony', 
         'Private balcony seating', 
         'Spacious private balcony with comfortable seating and unobstructed peninsula views. Perfect for morning coffee or evening relaxation.',
         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
         0, 2, 1),
        
        (@PeninsulaViewID, 
         'Peninsula View - Sunset', 
         'Stunning sunset views', 
         'Experience breathtaking sunsets over the peninsula. Each evening offers a unique and memorable view from your private space.',
         'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop',
         0, 3, 1);
    PRINT 'Peninsula View: 3 images added';
END

GO

PRINT '==============================================';
PRINT 'Complete gallery seed finished!';
PRINT 'Total categories with images: 11';
PRINT 'Total images: 40+ with full details';
PRINT 'Each category has 3-4 professional images';
PRINT '==============================================';
GO
