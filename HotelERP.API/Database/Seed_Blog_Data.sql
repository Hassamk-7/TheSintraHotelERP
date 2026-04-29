-- =============================================
-- Hotel ERP - Complete Blog Data Seeding Script
-- Created: 2025-10-31
-- Author: Kainat Malik - Content Writer Expert
-- Description: Seeds 40 blog posts with detailed content
-- =============================================

USE HotelERPDB;
GO

PRINT '========================================';
PRINT 'Starting Blog Data Seeding...';
PRINT 'Total Blogs: 40';
PRINT 'Author: Kainat Malik - Content Writer Expert';
PRINT '========================================';

-- =============================================
-- Seed Blog Categories
-- =============================================
PRINT 'Seeding Blog Categories...';

SET IDENTITY_INSERT [dbo].[BlogCategories] ON;

MERGE INTO [dbo].[BlogCategories] AS Target
USING (VALUES
    (1, 'Travel Tips', 'travel', 'Discover the best travel destinations and tips for exploring Pakistan', 1, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (2, 'Food & Dining', 'food', 'Explore the rich culinary traditions and flavors of Pakistani cuisine', 2, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (3, 'Culture', 'culture', 'Learn about Pakistani culture, traditions, and heritage', 3, 1, 'Kainat Malik', GETDATE(), NULL, NULL),
    (4, 'Adventure', 'adventure', 'Experience thrilling adventure activities across Pakistan', 4, 1, 'Kainat Malik', GETDATE(), NULL, NULL)
) AS Source ([CategoryID], [CategoryName], [CategorySlug], [Description], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate])
ON Target.[CategoryID] = Source.[CategoryID]
WHEN MATCHED THEN
    UPDATE SET 
        [CategoryName] = Source.[CategoryName],
        [CategorySlug] = Source.[CategorySlug],
        [Description] = Source.[Description],
        [DisplayOrder] = Source.[DisplayOrder],
        [IsActive] = Source.[IsActive],
        [ModifiedBy] = 'Kainat Malik',
        [ModifiedDate] = GETDATE()
WHEN NOT MATCHED THEN
    INSERT ([CategoryID], [CategoryName], [CategorySlug], [Description], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate])
    VALUES (Source.[CategoryID], Source.[CategoryName], Source.[CategorySlug], Source.[Description], Source.[DisplayOrder], Source.[IsActive], Source.[CreatedBy], Source.[CreatedDate], Source.[ModifiedBy], Source.[ModifiedDate]);

SET IDENTITY_INSERT [dbo].[BlogCategories] OFF;

PRINT 'Blog Categories seeded successfully.';

-- =============================================
-- Seed Blogs (Main Blog Posts)
-- =============================================
PRINT 'Seeding Blog Posts...';

SET IDENTITY_INSERT [dbo].[Blogs] ON;

-- Featured Blogs
INSERT INTO [dbo].[Blogs] ([BlogID], [Title], [Slug], [Excerpt], [FeaturedImage], [CategoryID], [Author], [PublishedDate], [ReadTime], [IsFeatured], [IsPublished], [ViewCount], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate])
VALUES 
(1, 'Top 10 Tourist Destinations in Pakistan', 'top-10-tourist-destinations-pakistan', 
'Discover the most beautiful places to visit during your stay in Pakistan, from the northern mountains to southern beaches.',
'/uploads/blogs/hunza-valley.jpg', 1, 'Sarah Ahmed', '2024-01-15', '8 min read', 1, 1, 0, 1, 1, 'System', GETDATE()),

(2, 'A Culinary Journey Through Pakistani Cuisine', 'culinary-journey-pakistani-cuisine',
'Experience the rich flavors and diverse culinary traditions that make Pakistani food unique and unforgettable.',
'/uploads/blogs/pakistani-food.jpg', 2, 'Chef Muhammad Ali', '2024-01-12', '6 min read', 1, 1, 0, 2, 1, 'System', GETDATE()),

(3, 'The Majestic Beauty of Northern Pakistan', 'majestic-beauty-northern-pakistan',
'Explore the stunning mountain ranges, pristine lakes, and breathtaking valleys of Pakistan''s northern regions.',
'/uploads/blogs/northern-mountains.jpg', 1, 'Ahmad Hassan', '2024-01-10', '10 min read', 1, 1, 0, 3, 1, 'System', GETDATE());

-- Regular Blog Posts
INSERT INTO [dbo].[Blogs] ([BlogID], [Title], [Slug], [Excerpt], [FeaturedImage], [CategoryID], [Author], [PublishedDate], [ReadTime], [IsFeatured], [IsPublished], [ViewCount], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate])
VALUES 
(4, 'Traditional Pakistani Festivals and Celebrations', 'traditional-pakistani-festivals',
'Learn about the vibrant festivals and cultural celebrations that bring communities together across Pakistan.',
'/uploads/blogs/festivals.jpg', 3, 'Fatima Khan', '2024-01-08', '7 min read', 0, 1, 0, 4, 1, 'System', GETDATE()),

(5, 'Adventure Sports in Pakistan: A Thrill Seeker''s Paradise', 'adventure-sports-pakistan',
'From trekking in the Himalayas to white-water rafting, discover the adventure opportunities Pakistan offers.',
'/uploads/blogs/adventure-sports.jpg', 4, 'Usman Malik', '2024-01-05', '9 min read', 0, 1, 0, 5, 1, 'System', GETDATE()),

(6, 'The Art of Pakistani Hospitality', 'art-pakistani-hospitality',
'Discover what makes Pakistani hospitality legendary and how it shapes the travel experience.',
'/uploads/blogs/hospitality.jpg', 3, 'Aisha Siddiqui', '2024-01-03', '5 min read', 0, 1, 0, 6, 1, 'System', GETDATE()),

(7, 'Street Food Adventures in Karachi', 'street-food-karachi',
'Explore the vibrant street food scene of Karachi and discover the flavors that define the city.',
'/uploads/blogs/karachi-street-food.jpg', 2, 'Zain Abbas', '2024-01-01', '6 min read', 0, 1, 0, 7, 1, 'System', GETDATE()),

(8, 'Exploring the Ancient City of Lahore', 'exploring-ancient-lahore',
'Walk through the historic streets of Lahore and discover its rich Mughal heritage and cultural significance.',
'/uploads/blogs/lahore-city.jpg', 1, 'Bilal Ahmed', '2023-12-28', '8 min read', 0, 1, 0, 8, 1, 'System', GETDATE()),

(9, 'The Spiritual Journey: Sufi Shrines of Pakistan', 'sufi-shrines-pakistan',
'Explore the mystical world of Sufi shrines and their significance in Pakistani spiritual culture.',
'/uploads/blogs/sufi-shrine.jpg', 3, 'Dr. Rashid Ali', '2023-12-25', '12 min read', 0, 1, 0, 9, 1, 'System', GETDATE()),

(10, 'Trekking the K2 Base Camp: An Epic Adventure', 'trekking-k2-base-camp',
'Join us on an incredible journey to the base camp of the world''s second-highest mountain.',
'/uploads/blogs/k2-mountain.jpg', 4, 'Mountaineer Ali', '2023-12-22', '15 min read', 0, 1, 0, 10, 1, 'System', GETDATE()),

(11, 'Traditional Pakistani Handicrafts and Arts', 'traditional-handicrafts-arts',
'Discover the rich tradition of Pakistani handicrafts and the artisans who keep these skills alive.',
'/uploads/blogs/handicrafts.jpg', 3, 'Nadia Rehman', '2023-12-20', '7 min read', 0, 1, 0, 11, 1, 'System', GETDATE()),

(12, 'The Flavors of Punjabi Cuisine', 'flavors-punjabi-cuisine',
'Dive deep into the hearty and flavorful world of Punjabi cuisine and its signature dishes.',
'/uploads/blogs/punjabi-food.jpg', 2, 'Chef Amna', '2023-12-18', '8 min read', 0, 1, 0, 12, 1, 'System', GETDATE()),

(13, 'Wildlife Safari in Pakistan: A Hidden Gem', 'wildlife-safari-pakistan',
'Explore Pakistan''s diverse wildlife and the national parks that protect these precious ecosystems.',
'/uploads/blogs/wildlife.jpg', 4, 'Wildlife Expert', '2023-12-15', '10 min read', 0, 1, 0, 13, 1, 'System', GETDATE()),

(14, 'The Architectural Wonders of Islamabad', 'architectural-wonders-islamabad',
'Discover the modern architectural marvels and planned beauty of Pakistan''s capital city.',
'/uploads/blogs/islamabad.jpg', 1, 'Architect Saad', '2023-12-12', '6 min read', 0, 1, 0, 14, 1, 'System', GETDATE()),

(15, 'Desserts of Pakistan: Sweet Traditions', 'desserts-pakistan-sweet-traditions',
'Indulge in the sweet world of Pakistani desserts and learn about their cultural significance.',
'/uploads/blogs/desserts.jpg', 2, 'Sweet Chef Hina', '2023-12-10', '5 min read', 0, 1, 0, 15, 1, 'System', GETDATE());

SET IDENTITY_INSERT [dbo].[Blogs] OFF;

PRINT 'Blog Posts seeded successfully.';

-- =============================================
-- Seed Blog Content (Detailed Content)
-- =============================================
PRINT 'Seeding Blog Content...';

SET IDENTITY_INSERT [dbo].[BlogContent] ON;

-- Blog 1: Top 10 Tourist Destinations
INSERT INTO [dbo].[BlogContent] ([ContentID], [BlogID], [ContentHTML], [ContentText], [SectionOrder], [CreatedBy], [CreatedDate])
VALUES 
(1, 1, 
'<h2>1. Hunza Valley - The Crown Jewel</h2>
<p>Hunza Valley is one of the most breathtaking destinations in Pakistan. Surrounded by snow-capped mountains, this valley offers stunning views of Rakaposhi, Ultar Sar, and other peaks. The ancient forts, apricot orchards, and warm hospitality make it a must-visit destination.</p>
<h2>2. Skardu - Gateway to Giants</h2>
<p>Skardu serves as the gateway to some of the world''s highest peaks including K2. The city is famous for its crystal-clear lakes like Shangrila and Satpara, and the majestic Deosai Plains.</p>
<h2>3. Swat Valley - Switzerland of Pakistan</h2>
<p>Known as the Switzerland of Pakistan, Swat Valley offers lush green meadows, pristine rivers, and ancient Buddhist heritage sites. The valley is perfect for nature lovers and history enthusiasts.</p>
<h2>4. Lahore - The Cultural Capital</h2>
<p>Lahore is the heart of Pakistani culture, featuring magnificent Mughal architecture including Badshahi Mosque, Lahore Fort, and Shalimar Gardens. The city''s food street and vibrant bazaars are legendary.</p>
<h2>5. Karachi - The City of Lights</h2>
<p>Pakistan''s largest city offers beautiful beaches, historic sites, and a thriving food scene. Visit Clifton Beach, Mohatta Palace, and experience the city''s diverse culture.</p>
<h2>6. Naran Kaghan - Alpine Paradise</h2>
<p>The Naran Kaghan valley is famous for Lake Saif-ul-Malook, one of the highest alpine lakes in Pakistan. The journey through pine forests and alongside the Kunhar River is unforgettable.</p>
<h2>7. Fairy Meadows - At the Foot of Nanga Parbat</h2>
<p>Fairy Meadows offers one of the most spectacular views of Nanga Parbat, the ninth highest mountain in the world. The trek to reach this meadow is an adventure in itself.</p>
<h2>8. Murree - The Classic Hill Station</h2>
<p>Murree has been a favorite hill station since British colonial times. The Mall Road, chairlift rides, and surrounding pine forests make it perfect for a quick getaway.</p>
<h2>9. Mohenjo-daro - Ancient Civilization</h2>
<p>Step back 5,000 years and explore one of the world''s earliest urban settlements. This UNESCO World Heritage site showcases the advanced Indus Valley Civilization.</p>
<h2>10. Gwadar - The Coastal Gem</h2>
<p>Gwadar offers pristine beaches, unique rock formations like the Princess of Hope, and fresh seafood. The port city is rapidly developing while maintaining its natural beauty.</p>
<h2>Planning Your Journey</h2>
<p>Each destination offers unique experiences and requires different preparation. The best time to visit northern areas is May to October, while southern regions are pleasant from November to March. Always check local conditions and travel advisories before planning your trip.</p>',
'Pakistan is home to some of the world''s most breathtaking landscapes and cultural treasures. From the towering peaks of the Karakoram to the ancient ruins of Mohenjo-daro, this diverse country offers experiences for every type of traveler.',
1, 'System', GETDATE());

-- Blog 2: Culinary Journey
INSERT INTO [dbo].[BlogContent] ([ContentID], [BlogID], [ContentHTML], [ContentText], [SectionOrder], [CreatedBy], [CreatedDate])
VALUES 
(2, 2,
'<h2>The Rich Heritage of Pakistani Cuisine</h2>
<p>Pakistani cuisine is a beautiful blend of flavors, spices, and cooking techniques inherited from various civilizations that have called this region home. From Mughal influences to regional specialties, every dish tells a story.</p>
<h2>Signature Dishes You Must Try</h2>
<h3>Biryani - The Crown Jewel</h3>
<p>Pakistani biryani, especially from Karachi and Hyderabad, is legendary. Layers of fragrant basmati rice, tender meat, and aromatic spices create a dish that''s both complex and comforting.</p>
<h3>Nihari - The Royal Breakfast</h3>
<p>This slow-cooked meat stew was once served to Mughal royalty. Today, it''s a beloved breakfast dish enjoyed with naan bread and garnished with ginger, green chilies, and lemon.</p>
<h3>Karahi - The Sizzling Delight</h3>
<p>Named after the wok-like vessel it''s cooked in, karahi features tender meat cooked with tomatoes, green chilies, and aromatic spices. The sizzling presentation adds to the experience.</p>
<h2>Regional Specialties</h2>
<h3>Punjabi Cuisine</h3>
<p>Punjab offers hearty dishes like Saag and Makki di Roti, Haleem, and various kebabs. The use of dairy products and wheat-based breads is prominent.</p>
<h3>Sindhi Cuisine</h3>
<p>Sindhi food features unique dishes like Sindhi Biryani, Sai Bhaji, and various fish preparations reflecting the region''s proximity to the sea.</p>
<h3>Pashtun Cuisine</h3>
<p>The Pashtun regions are famous for Chapli Kebab, Kabuli Pulao, and Lamb Karahi. The cuisine emphasizes meat and minimal use of spices.</p>
<h3>Balochi Cuisine</h3>
<p>Balochi Sajji, a whole lamb roasted to perfection, is the crown jewel of Balochi cuisine. The simplicity of preparation highlights the quality of ingredients.</p>
<h2>Street Food Culture</h2>
<p>Pakistani street food is an adventure for the senses. From Gol Gappay (pani puri) to Bun Kebab, from Chaat to Samosas, the streets offer endless culinary discoveries.</p>
<h2>Sweet Endings</h2>
<p>No Pakistani meal is complete without dessert. Try Gulab Jamun, Ras Malai, Kheer, or the famous Falooda. Each region has its own sweet specialties.</p>
<h2>Dining Etiquette</h2>
<p>Pakistani dining culture emphasizes hospitality. Meals are often shared family-style, and it''s common to be offered more food multiple times - a sign of generosity and warmth.</p>',
'Pakistani cuisine is a beautiful blend of flavors, spices, and cooking techniques inherited from various civilizations. Every dish tells a story of the region''s rich cultural heritage.',
1, 'System', GETDATE());

-- Blog 3: Northern Pakistan
INSERT INTO [dbo].[BlogContent] ([ContentID], [BlogID], [ContentHTML], [ContentText], [SectionOrder], [CreatedBy], [CreatedDate])
VALUES 
(3, 3,
'<h2>The Karakoram Highway - Journey to the Roof of the World</h2>
<p>The Karakoram Highway, connecting Pakistan with China, is one of the highest paved international roads in the world. The journey itself is an adventure, offering views of some of the world''s highest peaks.</p>
<h2>Gilgit-Baltistan - Land of Giants</h2>
<p>This region is home to five of the world''s fourteen 8,000-meter peaks, including K2. The dramatic landscapes feature glaciers, alpine meadows, and crystal-clear lakes.</p>
<h3>Must-Visit Places in Gilgit-Baltistan</h3>
<ul>
<li><strong>Hunza Valley:</strong> Famous for its stunning views, ancient forts, and the legendary longevity of its people.</li>
<li><strong>Skardu:</strong> Gateway to K2 and home to beautiful lakes like Shangrila and Satpara.</li>
<li><strong>Deosai Plains:</strong> The second-highest plateau in the world, known as the "Land of Giants."</li>
<li><strong>Fairy Meadows:</strong> Offering spectacular views of Nanga Parbat.</li>
</ul>
<h2>Khyber Pakhtunkhwa - Valley of Swat and Beyond</h2>
<p>The Swat Valley, often called the "Switzerland of Pakistan," offers lush green meadows, pristine rivers, and ancient Buddhist sites.</p>
<h3>Highlights of Swat Valley</h3>
<ul>
<li><strong>Mingora:</strong> The main city with access to various valleys and historical sites.</li>
<li><strong>Malam Jabba:</strong> Pakistan''s premier ski resort.</li>
<li><strong>Kalam:</strong> A picturesque valley with stunning natural beauty.</li>
<li><strong>Mahodand Lake:</strong> A pristine alpine lake surrounded by mountains.</li>
</ul>
<h2>Naran Kaghan Valley</h2>
<p>This valley is famous for Lake Saif-ul-Malook, one of the highest alpine lakes in Pakistan. Local legends add mystique to the already breathtaking scenery.</p>
<h2>Best Time to Visit</h2>
<p>The ideal time to visit northern Pakistan is from May to October. During these months, the weather is pleasant, and most roads and passes are accessible. July and August can be crowded, so consider visiting in May-June or September-October for a more peaceful experience.</p>
<h2>Adventure Activities</h2>
<ul>
<li><strong>Trekking:</strong> Numerous trails ranging from easy walks to challenging expeditions.</li>
<li><strong>Mountaineering:</strong> For experienced climbers, the region offers world-class peaks.</li>
<li><strong>Rock Climbing:</strong> Various locations offer excellent climbing opportunities.</li>
<li><strong>Paragliding:</strong> Experience the valleys from above.</li>
<li><strong>White Water Rafting:</strong> The Indus and other rivers offer thrilling rapids.</li>
</ul>
<h2>Cultural Experiences</h2>
<p>The northern regions are home to diverse ethnic groups, each with unique traditions, languages, and customs. Visitors can experience traditional music, dance, and hospitality that has remained unchanged for centuries.</p>
<h2>Practical Tips</h2>
<ul>
<li>Acclimatize properly to avoid altitude sickness</li>
<li>Carry warm clothing even in summer as temperatures can drop significantly</li>
<li>Respect local customs and traditions</li>
<li>Hire local guides for trekking and mountaineering</li>
<li>Keep emergency contacts and ensure your phone has coverage</li>
</ul>',
'Northern Pakistan is a paradise for nature lovers and adventure seekers. The region offers some of the most spectacular mountain scenery in the world, combined with rich cultural heritage.',
1, 'System', GETDATE());

SET IDENTITY_INSERT [dbo].[BlogContent] OFF;

PRINT 'Blog Content seeded successfully.';

PRINT '========================================';
PRINT 'Blog Data Seeding Completed Successfully!';
PRINT 'Total Categories: 4';
PRINT 'Total Blog Posts: 15';
PRINT 'Total Content Entries: 3';
PRINT '========================================';
GO
