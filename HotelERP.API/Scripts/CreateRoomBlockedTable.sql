USE [HMS_DB]
GO

-- Check if table exists first
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RoomBlocked' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[RoomBlocked](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [HotelId] [int] NOT NULL,
        [RoomTypeId] [int] NOT NULL,
        [RoomId] [int] NOT NULL,
        [BlockStartDate] [datetime2](7) NOT NULL,
        [BlockEndDate] [datetime2](7) NOT NULL,
        [BlockReason] [nvarchar](200) NOT NULL,
        [BlockType] [nvarchar](50) NOT NULL,
        [BlockedBy] [nvarchar](100) NOT NULL,
        [BlockNotes] [nvarchar](500) NULL,
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
     CONSTRAINT [PK_RoomBlocked] PRIMARY KEY CLUSTERED ([Id] ASC)
    ) ON [PRIMARY]

    -- Add Foreign Key Constraints with NO ACTION to avoid cascade conflicts
    ALTER TABLE [dbo].[RoomBlocked] ADD CONSTRAINT [FK_RoomBlocked_Hotels] 
    FOREIGN KEY([HotelId]) REFERENCES [dbo].[Hotels] ([Id])
    ON DELETE NO ACTION

    ALTER TABLE [dbo].[RoomBlocked] ADD CONSTRAINT [FK_RoomBlocked_RoomTypes] 
    FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id])
    ON DELETE NO ACTION

    ALTER TABLE [dbo].[RoomBlocked] ADD CONSTRAINT [FK_RoomBlocked_Rooms] 
    FOREIGN KEY([RoomId]) REFERENCES [dbo].[Rooms] ([Id])
    ON DELETE NO ACTION

    -- Create Indexes
    CREATE NONCLUSTERED INDEX [IX_RoomBlocked_HotelId] ON [dbo].[RoomBlocked]([HotelId] ASC)
    CREATE NONCLUSTERED INDEX [IX_RoomBlocked_RoomTypeId] ON [dbo].[RoomBlocked]([RoomTypeId] ASC)
    CREATE NONCLUSTERED INDEX [IX_RoomBlocked_RoomId] ON [dbo].[RoomBlocked]([RoomId] ASC)
    CREATE NONCLUSTERED INDEX [IX_RoomBlocked_DateRange] ON [dbo].[RoomBlocked]([BlockStartDate] ASC, [BlockEndDate] ASC)

    -- Insert sample data
    INSERT INTO [dbo].[RoomBlocked] ([HotelId], [RoomTypeId], [RoomId], [BlockStartDate], [BlockEndDate], [BlockReason], [BlockType], [BlockedBy], [BlockNotes], [IsActive], [CreatedBy])
    VALUES 
    (1, 28, 1, '2025-10-25', '2025-10-27', 'AC Maintenance', 'Maintenance', 'Admin', 'Annual AC servicing and cleaning', 1, 'System'),
    (1, 29, 2, '2025-11-01', '2025-11-03', 'Bathroom Renovation', 'Renovation', 'Manager', 'Complete bathroom renovation project', 1, 'System'),
    (1, 30, 3, '2025-10-30', '2025-10-30', 'Electrical Issue', 'OutOfOrder', 'Maintenance', 'Electrical wiring problem - safety concern', 1, 'System'),
    (1, 31, 4, '2025-11-15', '2025-11-20', 'Deep Cleaning', 'Maintenance', 'Housekeeping', 'Deep cleaning and carpet replacement', 1, 'System')

    PRINT 'RoomBlocked table created successfully with sample data!'
END
ELSE
BEGIN
    PRINT 'RoomBlocked table already exists!'
END