-- =============================================
-- Hotel ERP - Blog Management Tables
-- Created: 2025-10-31
-- Description: Tables for managing blogs and blog content
-- =============================================

USE HotelERPDB;
GO

-- =============================================
-- Table: BlogCategories
-- Description: Stores blog category information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlogCategories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BlogCategories] (
        [CategoryID] INT IDENTITY(1,1) PRIMARY KEY,
        [CategoryName] NVARCHAR(100) NOT NULL,
        [CategorySlug] NVARCHAR(100) NOT NULL UNIQUE,
        [Description] NVARCHAR(500) NULL,
        [DisplayOrder] INT DEFAULT 0,
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        [ModifiedBy] NVARCHAR(100) NULL,
        [ModifiedDate] DATETIME NULL
    );
    PRINT 'Table BlogCategories created successfully.';
END
ELSE
BEGIN
    PRINT 'Table BlogCategories already exists.';
END
GO

-- =============================================
-- Table: Blogs
-- Description: Stores main blog post information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Blogs]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Blogs] (
        [BlogID] INT IDENTITY(1,1) PRIMARY KEY,
        [Title] NVARCHAR(500) NOT NULL,
        [Slug] NVARCHAR(500) NOT NULL UNIQUE,
        [Excerpt] NVARCHAR(1000) NULL,
        [FeaturedImage] NVARCHAR(500) NULL,
        [CategoryID] INT NOT NULL,
        [Author] NVARCHAR(200) NOT NULL,
        [PublishedDate] DATETIME NOT NULL DEFAULT GETDATE(),
        [ReadTime] NVARCHAR(50) NULL,
        [IsFeatured] BIT DEFAULT 0,
        [IsPublished] BIT DEFAULT 1,
        [ViewCount] INT DEFAULT 0,
        [MetaTitle] NVARCHAR(200) NULL,
        [MetaDescription] NVARCHAR(500) NULL,
        [MetaKeywords] NVARCHAR(500) NULL,
        [DisplayOrder] INT DEFAULT 0,
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        [ModifiedBy] NVARCHAR(100) NULL,
        [ModifiedDate] DATETIME NULL,
        CONSTRAINT FK_Blogs_Category FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[BlogCategories]([CategoryID])
    );
    PRINT 'Table Blogs created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Blogs already exists.';
END
GO

-- =============================================
-- Table: BlogContent
-- Description: Stores detailed blog content (rich text)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlogContent]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BlogContent] (
        [ContentID] INT IDENTITY(1,1) PRIMARY KEY,
        [BlogID] INT NOT NULL,
        [ContentHTML] NVARCHAR(MAX) NULL,
        [ContentText] NVARCHAR(MAX) NULL,
        [SectionOrder] INT DEFAULT 1,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        [ModifiedBy] NVARCHAR(100) NULL,
        [ModifiedDate] DATETIME NULL,
        CONSTRAINT FK_BlogContent_Blog FOREIGN KEY ([BlogID]) REFERENCES [dbo].[Blogs]([BlogID]) ON DELETE CASCADE
    );
    PRINT 'Table BlogContent created successfully.';
END
ELSE
BEGIN
    PRINT 'Table BlogContent already exists.';
END
GO

-- =============================================
-- Table: BlogImages
-- Description: Stores additional images for blog posts
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlogImages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BlogImages] (
        [ImageID] INT IDENTITY(1,1) PRIMARY KEY,
        [BlogID] INT NOT NULL,
        [ImagePath] NVARCHAR(500) NOT NULL,
        [ImageCaption] NVARCHAR(500) NULL,
        [ImageAlt] NVARCHAR(200) NULL,
        [DisplayOrder] INT DEFAULT 0,
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_BlogImages_Blog FOREIGN KEY ([BlogID]) REFERENCES [dbo].[Blogs]([BlogID]) ON DELETE CASCADE
    );
    PRINT 'Table BlogImages created successfully.';
END
ELSE
BEGIN
    PRINT 'Table BlogImages already exists.';
END
GO

-- =============================================
-- Table: BlogTags
-- Description: Stores tags for blog posts
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlogTags]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BlogTags] (
        [TagID] INT IDENTITY(1,1) PRIMARY KEY,
        [TagName] NVARCHAR(100) NOT NULL UNIQUE,
        [TagSlug] NVARCHAR(100) NOT NULL UNIQUE,
        [CreatedDate] DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table BlogTags created successfully.';
END
ELSE
BEGIN
    PRINT 'Table BlogTags already exists.';
END
GO

-- =============================================
-- Table: BlogTagMapping
-- Description: Many-to-many relationship between blogs and tags
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlogTagMapping]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BlogTagMapping] (
        [MappingID] INT IDENTITY(1,1) PRIMARY KEY,
        [BlogID] INT NOT NULL,
        [TagID] INT NOT NULL,
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_BlogTagMapping_Blog FOREIGN KEY ([BlogID]) REFERENCES [dbo].[Blogs]([BlogID]) ON DELETE CASCADE,
        CONSTRAINT FK_BlogTagMapping_Tag FOREIGN KEY ([TagID]) REFERENCES [dbo].[BlogTags]([TagID]) ON DELETE CASCADE,
        CONSTRAINT UQ_BlogTag UNIQUE ([BlogID], [TagID])
    );
    PRINT 'Table BlogTagMapping created successfully.';
END
ELSE
BEGIN
    PRINT 'Table BlogTagMapping already exists.';
END
GO

-- =============================================
-- Create Indexes for Better Performance
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Blogs_CategoryID')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Blogs_CategoryID ON [dbo].[Blogs]([CategoryID]);
    PRINT 'Index IX_Blogs_CategoryID created successfully.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Blogs_PublishedDate')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Blogs_PublishedDate ON [dbo].[Blogs]([PublishedDate] DESC);
    PRINT 'Index IX_Blogs_PublishedDate created successfully.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Blogs_IsFeatured')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Blogs_IsFeatured ON [dbo].[Blogs]([IsFeatured]);
    PRINT 'Index IX_Blogs_IsFeatured created successfully.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BlogContent_BlogID')
BEGIN
    CREATE NONCLUSTERED INDEX IX_BlogContent_BlogID ON [dbo].[BlogContent]([BlogID]);
    PRINT 'Index IX_BlogContent_BlogID created successfully.';
END
GO

PRINT '========================================';
PRINT 'Blog Management Tables Created Successfully!';
PRINT '========================================';
GO
