USE [HMS_DB]
GO

/****** Object:  Table [dbo].[RoomTax]    Script Date: 19/10/2025 10:38:00 am ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RoomTax](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[HotelId] [int] NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[TaxName] [nvarchar](100) NOT NULL,
	[TaxType] [nvarchar](20) NOT NULL, -- 'Percentage' or 'Amount'
	[TaxValue] [decimal](18, 2) NOT NULL, -- Percentage value or fixed amount
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[CreatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
	[UpdatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
	[CreatedBy] [nvarchar](100) NULL,
	[UpdatedBy] [nvarchar](100) NULL,
 CONSTRAINT [PK_RoomTax] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Add Foreign Key Constraints
ALTER TABLE [dbo].[RoomTax] ADD CONSTRAINT [FK_RoomTax_Hotels] 
FOREIGN KEY([HotelId]) REFERENCES [dbo].[Hotels] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[RoomTax] ADD CONSTRAINT [FK_RoomTax_RoomTypes] 
FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id])
ON DELETE CASCADE
GO

-- Create Indexes for better performance
CREATE NONCLUSTERED INDEX [IX_RoomTax_HotelId] ON [dbo].[RoomTax]
(
	[HotelId] ASC
)
GO

CREATE NONCLUSTERED INDEX [IX_RoomTax_RoomTypeId] ON [dbo].[RoomTax]
(
	[RoomTypeId] ASC
)
GO

-- Insert sample data
INSERT INTO [dbo].[RoomTax] ([HotelId], [RoomTypeId], [TaxName], [TaxType], [TaxValue], [IsActive], [CreatedBy])
VALUES 
(1, 28, 'GST', 'Percentage', 18.00, 1, 'System'),
(1, 29, 'Service Tax', 'Percentage', 10.00, 1, 'System'),
(1, 30, 'GST', 'Percentage', 18.00, 1, 'System'),
(1, 31, 'Luxury Tax', 'Percentage', 5.00, 1, 'System'),
(1, 32, 'GST', 'Percentage', 18.00, 1, 'System'),
(1, 33, 'Luxury Tax', 'Percentage', 8.00, 1, 'System'),
(1, 34, 'Service Tax', 'Percentage', 12.00, 1, 'System')
GO

PRINT 'RoomTax table created successfully with sample data!'
