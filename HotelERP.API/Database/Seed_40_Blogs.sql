-- =============================================
-- Hotel ERP - Complete Blog Data (40 Blogs)
-- Created: 2025-10-31
-- Author: Kainat Malik - Content Writer Expert
-- Description: Seeds 40 blog posts with October 2025 dates
-- =============================================

USE HotelERPDB;
GO

PRINT '========================================';
PRINT 'Starting Complete Blog Data Seeding...';
PRINT 'Total Blogs: 40';
PRINT 'Author: Kainat Malik - Content Writer Expert';
PRINT '========================================';

-- Clear existing data
DELETE FROM [dbo].[BlogContent];
DELETE FROM [dbo].[BlogImages];
DELETE FROM [dbo].[Blogs];
DBCC CHECKIDENT ('[dbo].[Blogs]', RESEED, 0);

-- Seed Blog Categories
SET IDENTITY_INSERT [dbo].[BlogCategories] ON;
MERGE INTO [dbo].[BlogCategories] AS Target
USING (VALUES
    (1, 'Travel Tips', 'travel', 'Discover the best travel destinations and tips for exploring Pakistan', 1, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (2, 'Food & Dining', 'food', 'Explore the rich culinary traditions and flavors of Pakistani cuisine', 2, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (3, 'Culture', 'culture', 'Learn about Pakistani culture, traditions, and heritage', 3, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (4, 'Adventure', 'adventure', 'Experience thrilling adventure activities across Pakistan', 4, 1, 'Kainat Malik', GETDATE(), NULL, NULL)
) AS Source ([CategoryID], [CategoryName], [CategorySlug], [Description], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate])
ON Target.[CategoryID] = Source.[CategoryID]
WHEN MATCHED THEN UPDATE SET [CategoryName] = Source.[CategoryName], [ModifiedBy] = 'Kainat Malik', [ModifiedDate] = GETDATE()
WHEN NOT MATCHED THEN INSERT ([CategoryID], [CategoryName], [CategorySlug], [Description], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate])
    VALUES (Source.[CategoryID], Source.[CategoryName], Source.[CategorySlug], Source.[Description], Source.[DisplayOrder], Source.[IsActive], Source.[CreatedBy], Source.[CreatedDate], Source.[ModifiedBy], Source.[ModifiedDate]);
SET IDENTITY_INSERT [dbo].[BlogCategories] OFF;

PRINT 'Seeding 40 Blog Posts...';
SET IDENTITY_INSERT [dbo].[Blogs] ON;

INSERT INTO [dbo].[Blogs] ([BlogID], [Title], [Slug], [Excerpt], [FeaturedImage], [CategoryID], [Author], [PublishedDate], [ReadTime], [IsFeatured], [IsPublished], [ViewCount], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate])
VALUES (1, 'Top 10 Tourist Destinations in Pakistan', 'top-10-tourist-destinations-pakistan', 
'Discover the most beautiful places to visit during your stay in Pakistan, from the northern mountains to southern beaches.',
'/uploads/blogs/hunza-valley.jpg', 1, 'Kainat Malik', '2025-10-28', '8 min read', 1, 1, 0, 1, 1, 'Kainat Malik', GETDATE()),

(2, 'A Culinary Journey Through Pakistani Cuisine', 'culinary-journey-pakistani-cuisine', 
'Experience the rich flavors and diverse culinary traditions that make Pakistani food unique and unforgettable.',
'/uploads/blogs/pakistani-food.jpg', 2, 'Kainat Malik', '2025-10-27', '10 min read', 1, 1, 0, 2, 1, 'Kainat Malik', GETDATE()),

(3, 'The Majestic Beauty of Northern Pakistan', 'majestic-beauty-northern-pakistan', 
'Explore the stunning mountain ranges, pristine lakes, and breathtaking valleys of Pakistan's northern regions.',
'/uploads/blogs/northern-mountains.jpg', 1, 'Kainat Malik', '2025-10-26', '12 min read', 1, 1, 0, 3, 1, 'Kainat Malik', GETDATE()),

(4, 'Exploring the Ancient City of Lahore', 'exploring-ancient-lahore', 
'Walk through the historic streets of Lahore and discover its rich Mughal heritage and cultural significance.',
'/uploads/blogs/lahore-city.jpg', 1, 'Kainat Malik', '2025-10-25', '9 min read', 0, 1, 0, 4, 1, 'Kainat Malik', GETDATE()),

(5, 'The Coastal Beauty of Karachi and Gwadar', 'coastal-beauty-karachi-gwadar', 
'Explore Pakistan's stunning coastline and the maritime culture of its coastal cities.',
'/uploads/blogs/karachi-coast.jpg', 1, 'Kainat Malik', '2025-10-24', '7 min read', 0, 1, 0, 5, 1, 'Kainat Malik', GETDATE()),

(6, 'The Silk Road Legacy in Pakistan', 'silk-road-legacy-pakistan', 
'Trace the ancient Silk Road routes through Pakistan and their historical significance.',
'/uploads/blogs/silk-road.jpg', 1, 'Kainat Malik', '2025-10-23', '11 min read', 0, 1, 0, 6, 1, 'Kainat Malik', GETDATE()),

(7, 'The Architectural Wonders of Islamabad', 'architectural-wonders-islamabad', 
'Discover the modern architectural marvels and planned beauty of Pakistan's capital city.',
'/uploads/blogs/islamabad.jpg', 1, 'Kainat Malik', '2025-10-22', '6 min read', 0, 1, 0, 7, 1, 'Kainat Malik', GETDATE()),

(8, 'Hidden Gems of Multan: The City of Saints', 'hidden-gems-multan', 
'Explore the spiritual and cultural treasures of Multan, one of Pakistan's oldest cities.',
'/uploads/blogs/multan.jpg', 1, 'Kainat Malik', '2025-10-21', '8 min read', 0, 1, 0, 8, 1, 'Kainat Malik', GETDATE()),

(9, 'Discovering Peshawar: Gateway to Central Asia', 'discovering-peshawar', 
'Journey through Peshawar's rich history, from ancient Gandhara civilization to modern times.',
'/uploads/blogs/peshawar.jpg', 1, 'Kainat Malik', '2025-10-20', '7 min read', 0, 1, 0, 9, 1, 'Kainat Malik', GETDATE()),

(10, 'The Enchanting Valleys of Swat', 'enchanting-valleys-swat', 
'Known as the Switzerland of Pakistan, Swat Valley offers lush green meadows and pristine rivers.',
'/uploads/blogs/swat-valley.jpg', 1, 'Kainat Malik', '2025-10-19', '9 min read', 0, 1, 0, 10, 1, 'Kainat Malik', GETDATE()),

(11, 'Street Food Adventures in Karachi', 'street-food-karachi', 
'Explore the vibrant street food scene of Karachi and discover the flavors that define the city.',
'/uploads/blogs/karachi-street-food.jpg', 2, 'Kainat Malik', '2025-10-18', '7 min read', 0, 1, 0, 11, 1, 'Kainat Malik', GETDATE()),

(12, 'The Flavors of Punjabi Cuisine', 'flavors-punjabi-cuisine', 
'Dive deep into the hearty and flavorful world of Punjabi cuisine and its signature dishes.',
'/uploads/blogs/punjabi-food.jpg', 2, 'Kainat Malik', '2025-10-17', '8 min read', 0, 1, 0, 12, 1, 'Kainat Malik', GETDATE()),

(13, 'Desserts of Pakistan: Sweet Traditions', 'desserts-pakistan-sweet-traditions', 
'Indulge in the sweet world of Pakistani desserts and learn about their cultural significance.',
'/uploads/blogs/desserts.jpg', 2, 'Kainat Malik', '2025-10-16', '6 min read', 0, 1, 0, 13, 1, 'Kainat Malik', GETDATE()),

(14, 'Tea Culture in Pakistan', 'tea-culture-pakistan', 
'Discover how tea became an integral part of Pakistani social life and hospitality.',
'/uploads/blogs/tea-culture.jpg', 2, 'Kainat Malik', '2025-10-15', '5 min read', 0, 1, 0, 14, 1, 'Kainat Malik', GETDATE()),

(15, 'The Flavors of Balochi Cuisine', 'flavors-balochi-cuisine', 
'Explore the unique and hearty flavors of traditional Balochi dishes.',
'/uploads/blogs/balochi-food.jpg', 2, 'Kainat Malik', '2025-10-14', '7 min read', 0, 1, 0, 15, 1, 'Kainat Malik', GETDATE()),

(16, 'Sindhi Cuisine: A Culinary Journey', 'sindhi-cuisine-culinary-journey', 
'Discover the rich flavors and unique dishes of traditional Sindhi cuisine.',
'/uploads/blogs/sindhi-food.jpg', 2, 'Kainat Malik', '2025-10-13', '8 min read', 0, 1, 0, 16, 1, 'Kainat Malik', GETDATE()),

(17, 'Pakistani Breakfast Traditions', 'pakistani-breakfast-traditions', 
'Start your day with traditional Pakistani breakfast dishes and their stories.',
'/uploads/blogs/breakfast.jpg', 2, 'Kainat Malik', '2025-10-12', '6 min read', 0, 1, 0, 17, 1, 'Kainat Malik', GETDATE()),

(18, 'Pakistani Snacks and Street Treats', 'pakistani-snacks-street-treats', 
'Explore the world of Pakistani snacks and street food treats.',
'/uploads/blogs/snacks.jpg', 2, 'Kainat Malik', '2025-10-11', '5 min read', 0, 1, 0, 18, 1, 'Kainat Malik', GETDATE()),

(19, 'Regional Breads of Pakistan', 'regional-breads-pakistan', 
'Discover the variety of traditional breads from different regions of Pakistan.',
'/uploads/blogs/breads.jpg', 2, 'Kainat Malik', '2025-10-10', '7 min read', 0, 1, 0, 19, 1, 'Kainat Malik', GETDATE()),

(20, 'Pakistani Rice Dishes Beyond Biryani', 'rice-dishes-beyond-biryani', 
'Discover the variety of rice dishes in Pakistani cuisine beyond the famous biryani.',
'/uploads/blogs/rice-dishes.jpg', 2, 'Kainat Malik', '2025-10-09', '8 min read', 0, 1, 0, 20, 1, 'Kainat Malik', GETDATE()),

(21, 'Traditional Pakistani Festivals', 'traditional-pakistani-festivals', 
'Learn about the vibrant festivals and cultural celebrations across Pakistan.',
'/uploads/blogs/festivals.jpg', 3, 'Kainat Malik', '2025-10-08', '9 min read', 0, 1, 0, 21, 1, 'Kainat Malik', GETDATE()),

(22, 'The Art of Pakistani Hospitality', 'art-pakistani-hospitality', 
'Discover what makes Pakistani hospitality legendary and how it shapes the travel experience.',
'/uploads/blogs/hospitality.jpg', 3, 'Kainat Malik', '2025-10-07', '6 min read', 0, 1, 0, 22, 1, 'Kainat Malik', GETDATE()),

(23, 'Sufi Shrines of Pakistan', 'sufi-shrines-pakistan', 
'Explore the mystical world of Sufi shrines and their significance in Pakistani culture.',
'/uploads/blogs/sufi-shrine.jpg', 3, 'Kainat Malik', '2025-10-06', '10 min read', 0, 1, 0, 23, 1, 'Kainat Malik', GETDATE()),

(24, 'Traditional Pakistani Handicrafts', 'traditional-handicrafts', 
'Discover the rich tradition of Pakistani handicrafts and the artisans who keep these skills alive.',
'/uploads/blogs/handicrafts.jpg', 3, 'Kainat Malik', '2025-10-05', '8 min read', 0, 1, 0, 24, 1, 'Kainat Malik', GETDATE()),

(25, 'Traditional Music and Dance', 'traditional-music-dance', 
'Immerse yourself in the rich musical traditions and folk dances of Pakistan.',
'/uploads/blogs/music-dance.jpg', 3, 'Kainat Malik', '2025-10-04', '9 min read', 0, 1, 0, 25, 1, 'Kainat Malik', GETDATE()),

(26, 'Pakistani Wedding Traditions', 'pakistani-wedding-traditions', 
'Learn about the rich traditions and colorful customs of Pakistani weddings.',
'/uploads/blogs/wedding.jpg', 3, 'Kainat Malik', '2025-10-03', '11 min read', 0, 1, 0, 26, 1, 'Kainat Malik', GETDATE()),

(27, 'The Poetry Culture of Pakistan', 'poetry-culture-pakistan', 
'Dive into the rich literary tradition and poetry culture that defines Pakistani arts.',
'/uploads/blogs/poetry.jpg', 3, 'Kainat Malik', '2025-10-02', '8 min read', 0, 1, 0, 27, 1, 'Kainat Malik', GETDATE()),

(28, 'The Textile Heritage of Pakistan', 'textile-heritage-pakistan', 
'Discover Pakistan's rich textile traditions and modern innovations.',
'/uploads/blogs/textiles.jpg', 3, 'Kainat Malik', '2025-10-01', '7 min read', 0, 1, 0, 28, 1, 'Kainat Malik', GETDATE()),

(29, 'Pakistani Carpet Craftsmanship', 'pakistani-carpet-craftsmanship', 
'Learn about the intricate art of Pakistani carpet weaving and design.',
'/uploads/blogs/carpets.jpg', 3, 'Kainat Malik', '2025-09-30', '9 min read', 0, 1, 0, 29, 1, 'Kainat Malik', GETDATE()),

(30, 'Jewelry Traditions of Pakistan', 'jewelry-traditions-pakistan', 
'Explore the rich traditions of Pakistani jewelry making and design.',
'/uploads/blogs/jewelry.jpg', 3, 'Kainat Malik', '2025-09-29', '8 min read', 0, 1, 0, 30, 1, 'Kainat Malik', GETDATE()),

(31, 'Adventure Sports in Pakistan', 'adventure-sports-pakistan', 
'From trekking to rafting, discover the adventure opportunities Pakistan offers.',
'/uploads/blogs/adventure-sports.jpg', 4, 'Kainat Malik', '2025-09-28', '10 min read', 0, 1, 0, 31, 1, 'Kainat Malik', GETDATE()),

(32, 'Trekking the K2 Base Camp', 'trekking-k2-base-camp', 
'Join us on an incredible journey to the base camp of the world's second-highest mountain.',
'/uploads/blogs/k2-mountain.jpg', 4, 'Kainat Malik', '2025-09-27', '15 min read', 0, 1, 0, 32, 1, 'Kainat Malik', GETDATE()),

(33, 'Wildlife Safari in Pakistan', 'wildlife-safari-pakistan', 
'Explore Pakistan's diverse wildlife and the national parks that protect these ecosystems.',
'/uploads/blogs/wildlife.jpg', 4, 'Kainat Malik', '2025-09-26', '11 min read', 0, 1, 0, 33, 1, 'Kainat Malik', GETDATE()),

(34, 'Paragliding Adventures', 'paragliding-adventures', 
'Soar through the skies and experience Pakistan's landscapes from above.',
'/uploads/blogs/paragliding.jpg', 4, 'Kainat Malik', '2025-09-25', '7 min read', 0, 1, 0, 34, 1, 'Kainat Malik', GETDATE()),

(35, 'White Water Rafting', 'white-water-rafting', 
'Experience the thrill of white water rafting in Pakistan's rushing rivers.',
'/uploads/blogs/rafting.jpg', 4, 'Kainat Malik', '2025-09-24', '9 min read', 0, 1, 0, 35, 1, 'Kainat Malik', GETDATE()),

(36, 'Rock Climbing in Northern Pakistan', 'rock-climbing-northern-pakistan', 
'Challenge yourself with world-class rock climbing opportunities.',
'/uploads/blogs/rock-climbing.jpg', 4, 'Kainat Malik', '2025-09-23', '8 min read', 0, 1, 0, 36, 1, 'Kainat Malik', GETDATE()),

(37, 'Mountain Biking Trails', 'mountain-biking-trails', 
'Discover the best mountain biking trails and routes across Pakistan.',
'/uploads/blogs/mountain-biking.jpg', 4, 'Kainat Malik', '2025-09-22', '7 min read', 0, 1, 0, 37, 1, 'Kainat Malik', GETDATE()),

(38, 'Cave Exploration in Pakistan', 'cave-exploration-pakistan', 
'Venture into Pakistan's mysterious caves and underground wonders.',
'/uploads/blogs/cave-exploration.jpg', 4, 'Kainat Malik', '2025-09-21', '9 min read', 0, 1, 0, 38, 1, 'Kainat Malik', GETDATE()),

(39, 'Skiing in Pakistan', 'skiing-pakistan', 
'Discover Pakistan's emerging ski destinations and winter sports opportunities.',
'/uploads/blogs/skiing.jpg', 4, 'Kainat Malik', '2025-09-20', '6 min read', 0, 1, 0, 39, 1, 'Kainat Malik', GETDATE()),

(40, 'Desert Safari Adventures', 'desert-safari-adventures', 
'Experience the magic of Pakistan's deserts through exciting safari adventures.',
'/uploads/blogs/desert-safari.jpg', 4, 'Kainat Malik', '2025-09-19', '8 min read', 0, 1, 0, 40, 1, 'Kainat Malik', GETDATE());

SET IDENTITY_INSERT [dbo].[Blogs] OFF;

PRINT '========================================';
PRINT 'Blog Data Seeding Completed Successfully!';
PRINT 'Total Categories: 4';
PRINT 'Total Blog Posts: 40';
PRINT 'Author: Kainat Malik - Content Writer Expert';
PRINT '========================================';
GO
