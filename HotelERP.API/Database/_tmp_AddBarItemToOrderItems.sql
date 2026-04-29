IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(max) NULL,
    [LastName] nvarchar(max) NULL,
    [EmployeeId] int NULL,
    [ProfilePictureUrl] nvarchar(max) NULL,
    [LastLoginDate] datetime2 NULL,
    [DateOfBirth] datetime2 NULL,
    [Address] nvarchar(max) NULL,
    [Gender] nvarchar(max) NULL,
    [RefreshToken] nvarchar(max) NULL,
    [RefreshTokenExpiryTime] datetime2 NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [BarManagements] (
    [Id] int NOT NULL IDENTITY,
    [DrinkName] nvarchar(100) NOT NULL,
    [DrinkCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [CostPrice] decimal(18,2) NOT NULL,
    [IsAlcoholic] bit NOT NULL,
    [AlcoholContent] decimal(18,2) NOT NULL,
    [Brand] nvarchar(100) NOT NULL,
    [Ingredients] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [ServingSize] nvarchar(50) NOT NULL,
    [IsHappyHourItem] bit NOT NULL,
    [HappyHourPrice] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_BarManagements] PRIMARY KEY ([Id])
);

CREATE TABLE [CompanyContacts] (
    [Id] int NOT NULL IDENTITY,
    [CompanyName] nvarchar(200) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [State] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [PostalCode] nvarchar(20) NOT NULL,
    [Phone] nvarchar(20) NOT NULL,
    [Mobile] nvarchar(20) NOT NULL,
    [Fax] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Website] nvarchar(200) NOT NULL,
    [TaxNumber] nvarchar(50) NOT NULL,
    [RegistrationNumber] nvarchar(50) NOT NULL,
    [ContactPerson] nvarchar(100) NOT NULL,
    [ContactPersonTitle] nvarchar(100) NOT NULL,
    [ContactPersonPhone] nvarchar(20) NOT NULL,
    [ContactPersonEmail] nvarchar(100) NOT NULL,
    [LogoPath] nvarchar(255) NOT NULL,
    [Currency] nvarchar(50) NOT NULL,
    [TimeZone] nvarchar(50) NOT NULL,
    [DateFormat] nvarchar(10) NOT NULL,
    [TimeFormat] nvarchar(10) NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CompanyContacts] PRIMARY KEY ([Id])
);

CREATE TABLE [Currencies] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(10) NOT NULL,
    [Symbol] nvarchar(10) NOT NULL,
    [ExchangeRate] decimal(18,2) NOT NULL,
    [IsBaseCurrency] bit NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Currencies] PRIMARY KEY ([Id])
);

CREATE TABLE [CustomerDatabases] (
    [Id] int NOT NULL IDENTITY,
    [CustomerCode] nvarchar(50) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [Gender] nvarchar(20) NOT NULL,
    [MaritalStatus] nvarchar(50) NOT NULL,
    [Occupation] nvarchar(100) NOT NULL,
    [IncomeRange] nvarchar(50) NOT NULL,
    [Preferences] nvarchar(500) NOT NULL,
    [Interests] nvarchar(500) NOT NULL,
    [FirstVisit] datetime2 NOT NULL,
    [LastVisit] datetime2 NULL,
    [TotalVisits] int NOT NULL,
    [TotalSpent] decimal(18,2) NOT NULL,
    [AverageSpending] decimal(18,2) NOT NULL,
    [CustomerSegment] nvarchar(50) NOT NULL,
    [PreferredCommunication] nvarchar(50) NOT NULL,
    [OptInMarketing] bit NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CustomerDatabases] PRIMARY KEY ([Id])
);

CREATE TABLE [DayBooks] (
    [Id] int NOT NULL IDENTITY,
    [TransactionDate] datetime2 NOT NULL,
    [TransactionNumber] nvarchar(50) NOT NULL,
    [Description] nvarchar(100) NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [AccountHead] nvarchar(100) NOT NULL,
    [DebitAmount] decimal(18,2) NOT NULL,
    [CreditAmount] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DayBooks] PRIMARY KEY ([Id])
);

CREATE TABLE [DeliveryPersonMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [VehicleType] nvarchar(50) NOT NULL,
    [VehicleNumber] nvarchar(50) NOT NULL,
    [LicenseNumber] nvarchar(50) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [DeliveryChargePerKm] decimal(18,2) NOT NULL,
    [WorkingArea] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DeliveryPersonMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [Departments] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [ParentDepartmentId] int NULL,
    [HeadOfDepartment] nvarchar(100) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [Phone] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Budget] decimal(18,2) NULL,
    [CostCenter] nvarchar(50) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Departments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Departments_Departments_ParentDepartmentId] FOREIGN KEY ([ParentDepartmentId]) REFERENCES [Departments] ([Id])
);

CREATE TABLE [DishCategories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DishCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [DrinksCategories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CategoryType] nvarchar(50) NOT NULL,
    [IsAlcoholic] bit NOT NULL,
    [IsHot] bit NOT NULL,
    [ColorCode] nvarchar(7) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DrinksCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [DrinksMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [IsAlcoholic] bit NOT NULL,
    [AlcoholContent] decimal(18,2) NOT NULL,
    [Brand] nvarchar(100) NOT NULL,
    [Ingredients] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DrinksMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [DrinksPricings] (
    [Id] int NOT NULL IDENTITY,
    [DrinkName] nvarchar(100) NOT NULL,
    [DrinkCode] nvarchar(20) NOT NULL,
    [Quantity] nvarchar(50) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [CostPrice] decimal(18,2) NOT NULL,
    [PriceCategory] nvarchar(50) NOT NULL,
    [IsHappyHourPrice] bit NOT NULL,
    [HappyHourPrice] decimal(18,2) NOT NULL,
    [EffectiveFrom] datetime2 NULL,
    [EffectiveTo] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DrinksPricings] PRIMARY KEY ([Id])
);

CREATE TABLE [DrinksQuantities] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Volume] decimal(18,2) NOT NULL,
    [Unit] nvarchar(20) NOT NULL,
    [IsStandard] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_DrinksQuantities] PRIMARY KEY ([Id])
);

CREATE TABLE [EmailSettings] (
    [Id] int NOT NULL IDENTITY,
    [SmtpServer] nvarchar(100) NOT NULL,
    [SmtpPort] int NOT NULL,
    [Username] nvarchar(100) NOT NULL,
    [Password] nvarchar(255) NOT NULL,
    [FromEmail] nvarchar(100) NOT NULL,
    [FromName] nvarchar(100) NOT NULL,
    [EnableSsl] bit NOT NULL,
    [UseDefaultCredentials] bit NOT NULL,
    [AuthenticationMethod] nvarchar(50) NOT NULL,
    [TimeoutSeconds] int NOT NULL,
    [IsDefault] bit NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EmailSettings] PRIMARY KEY ([Id])
);

CREATE TABLE [ExpensesMasters] (
    [Id] int NOT NULL IDENTITY,
    [ExpenseTitle] nvarchar(100) NOT NULL,
    [ExpenseCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [ExpenseType] nvarchar(50) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [ExpenseDate] datetime2 NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ReceiptPath] nvarchar(200) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ExpensesMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [ExpenseTypeMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [IsTaxDeductible] bit NOT NULL,
    [RequiresApproval] bit NOT NULL,
    [ApprovalLevel] nvarchar(100) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ExpenseTypeMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [ExpenseTypes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [IsTaxDeductible] bit NOT NULL,
    [AccountCode] nvarchar(100) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ExpenseTypes] PRIMARY KEY ([Id])
);

CREATE TABLE [ExtraBeds] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [ChargePerNight] decimal(18,2) NOT NULL,
    [BedType] nvarchar(50) NOT NULL,
    [Size] nvarchar(50) NOT NULL,
    [MaxAge] int NOT NULL,
    [MinAge] int NOT NULL,
    [IsAvailable] bit NOT NULL,
    [ApplicableRoomTypes] nvarchar(100) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ExtraBeds] PRIMARY KEY ([Id])
);

CREATE TABLE [ExtraPersons] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [ChargePerNight] decimal(18,2) NOT NULL,
    [AgeGroup] nvarchar(50) NOT NULL,
    [MinAge] int NOT NULL,
    [MaxAge] int NOT NULL,
    [IncludesBreakfast] bit NOT NULL,
    [IncludesBedding] bit NOT NULL,
    [ApplicableRoomTypes] nvarchar(100) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ExtraPersons] PRIMARY KEY ([Id])
);

CREATE TABLE [FloorManagements] (
    [Id] int NOT NULL IDENTITY,
    [FloorNumber] int NOT NULL,
    [FloorName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [TotalRooms] int NOT NULL,
    [AvailableRooms] int NOT NULL,
    [OccupiedRooms] int NOT NULL,
    [OutOfOrderRooms] int NOT NULL,
    [FloorManager] nvarchar(100) NOT NULL,
    [HousekeepingSupervisor] nvarchar(100) NOT NULL,
    [HasElevatorAccess] bit NOT NULL,
    [HasFireExit] bit NOT NULL,
    [SafetyFeatures] nvarchar(500) NOT NULL,
    [SpecialFeatures] nvarchar(500) NOT NULL,
    [FloorPlanPath] nvarchar(200) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_FloorManagements] PRIMARY KEY ([Id])
);

CREATE TABLE [FoodCategories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Type] nvarchar(50) NOT NULL,
    [IsVegetarian] bit NOT NULL,
    [IsHalal] bit NOT NULL,
    [Cuisine] nvarchar(100) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [ColorCode] nvarchar(7) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_FoodCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [GardenMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Capacity] int NOT NULL,
    [HourlyRate] decimal(18,2) NOT NULL,
    [DailyRate] decimal(18,2) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [GardenType] nvarchar(50) NOT NULL,
    [HasGazebo] bit NOT NULL,
    [HasLighting] bit NOT NULL,
    [HasWaterFeature] bit NOT NULL,
    [Features] nvarchar(500) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GardenMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [GeneralLedgers] (
    [Id] int NOT NULL IDENTITY,
    [AccountCode] nvarchar(100) NOT NULL,
    [AccountName] nvarchar(200) NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [Description] nvarchar(100) NOT NULL,
    [DebitAmount] decimal(18,2) NOT NULL,
    [CreditAmount] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GeneralLedgers] PRIMARY KEY ([Id])
);

CREATE TABLE [GuestMasters] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [GuestCode] nvarchar(20) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [IdType] nvarchar(50) NOT NULL,
    [IdNumber] nvarchar(50) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [Gender] nvarchar(20) NOT NULL,
    [Nationality] nvarchar(50) NOT NULL,
    [Company] nvarchar(100) NOT NULL,
    [GuestType] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [GuestRegistrations] (
    [Id] int NOT NULL IDENTITY,
    [RegistrationNumber] nvarchar(50) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [IdType] nvarchar(50) NOT NULL,
    [IdNumber] nvarchar(50) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [Gender] nvarchar(20) NOT NULL,
    [Nationality] nvarchar(50) NOT NULL,
    [Company] nvarchar(100) NOT NULL,
    [Purpose] nvarchar(50) NOT NULL,
    [RegisteredBy] nvarchar(100) NOT NULL,
    [RegistrationDate] datetime2 NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestRegistrations] PRIMARY KEY ([Id])
);

CREATE TABLE [Guests] (
    [Id] int NOT NULL IDENTITY,
    [GuestId] nvarchar(100) NOT NULL,
    [FullName] nvarchar(200) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(50) NOT NULL,
    [Gender] nvarchar(10) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [IdType] nvarchar(100) NOT NULL,
    [IdNumber] nvarchar(50) NOT NULL,
    [IdProof] varbinary(max) NOT NULL,
    [Company] nvarchar(200) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Guests] PRIMARY KEY ([Id])
);

CREATE TABLE [HallMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Capacity] int NOT NULL,
    [HourlyRate] decimal(18,2) NOT NULL,
    [DailyRate] decimal(18,2) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [HallType] nvarchar(50) NOT NULL,
    [HasAC] bit NOT NULL,
    [HasProjector] bit NOT NULL,
    [HasSoundSystem] bit NOT NULL,
    [Amenities] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_HallMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [Hotels] (
    [Id] int NOT NULL IDENTITY,
    [HotelName] nvarchar(100) NOT NULL,
    [HotelCode] nvarchar(20) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [State] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [PostalCode] nvarchar(20) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Website] nvarchar(100) NOT NULL,
    [GSTNumber] nvarchar(50) NOT NULL,
    [PANNumber] nvarchar(50) NOT NULL,
    [LicenseNumber] nvarchar(50) NOT NULL,
    [ManagerName] nvarchar(100) NOT NULL,
    [ManagerPhone] nvarchar(20) NOT NULL,
    [ManagerEmail] nvarchar(100) NOT NULL,
    [TotalRooms] int NOT NULL,
    [TotalFloors] int NOT NULL,
    [EstablishedDate] datetime2 NOT NULL,
    [StarRating] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [LogoPath] nvarchar(200) NOT NULL,
    [IsMainBranch] bit NOT NULL,
    [Currency] nvarchar(50) NOT NULL,
    [TimeZone] nvarchar(50) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Code] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Hotels] PRIMARY KEY ([Id])
);

CREATE TABLE [IdTypes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [IsRequired] bit NOT NULL,
    [Country] nvarchar(50) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_IdTypes] PRIMARY KEY ([Id])
);

CREATE TABLE [InventoryCategories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [ParentCategoryId] int NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_InventoryCategories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InventoryCategories_InventoryCategories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [InventoryCategories] ([Id])
);

CREATE TABLE [InventoryReports] (
    [Id] int NOT NULL IDENTITY,
    [ReportName] nvarchar(100) NOT NULL,
    [ReportType] nvarchar(50) NOT NULL,
    [ReportDate] datetime2 NOT NULL,
    [FromDate] datetime2 NOT NULL,
    [ToDate] datetime2 NOT NULL,
    [GeneratedBy] nvarchar(100) NOT NULL,
    [FilePath] nvarchar(200) NOT NULL,
    [Parameters] nvarchar(500) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_InventoryReports] PRIMARY KEY ([Id])
);

CREATE TABLE [ItemMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Unit] nvarchar(50) NOT NULL,
    [PurchasePrice] decimal(18,2) NOT NULL,
    [SalePrice] decimal(18,2) NOT NULL,
    [MinStockLevel] int NOT NULL,
    [MaxStockLevel] int NOT NULL,
    [CurrentStock] int NOT NULL,
    [Supplier] nvarchar(100) NOT NULL,
    [Brand] nvarchar(50) NOT NULL,
    [IsPerishable] bit NOT NULL,
    [ExpiryDate] datetime2 NULL,
    [StorageLocation] nvarchar(200) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ItemMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [KitchenSections] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [SectionType] nvarchar(50) NOT NULL,
    [IsActive] bit NOT NULL,
    [ResponsibleChef] nvarchar(100) NOT NULL,
    [Specialties] nvarchar(500) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_KitchenSections] PRIMARY KEY ([Id])
);

CREATE TABLE [LaundryMasters] (
    [Id] int NOT NULL IDENTITY,
    [ServiceName] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [ServiceType] nvarchar(50) NOT NULL,
    [Unit] nvarchar(50) NOT NULL,
    [ProcessingHours] int NOT NULL,
    [IsExpressService] bit NOT NULL,
    [ExpressCharge] decimal(18,2) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_LaundryMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [MarketingCampaigns] (
    [Id] int NOT NULL IDENTITY,
    [CampaignCode] nvarchar(50) NOT NULL,
    [CampaignName] nvarchar(200) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CampaignType] nvarchar(50) NOT NULL,
    [TargetAudience] nvarchar(100) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [Budget] decimal(18,2) NOT NULL,
    [ActualCost] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [TargetReach] int NOT NULL,
    [ActualReach] int NOT NULL,
    [Impressions] int NOT NULL,
    [Clicks] int NOT NULL,
    [Conversions] int NOT NULL,
    [ConversionRate] decimal(18,2) NOT NULL,
    [ROI] decimal(18,2) NOT NULL,
    [CampaignManager] nvarchar(100) NOT NULL,
    [Objectives] nvarchar(500) NOT NULL,
    [Results] nvarchar(500) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_MarketingCampaigns] PRIMARY KEY ([Id])
);

CREATE TABLE [MenuItemMasters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Cuisine] nvarchar(50) NOT NULL,
    [IsVegetarian] bit NOT NULL,
    [IsHalal] bit NOT NULL,
    [IsSpicy] bit NOT NULL,
    [Ingredients] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [PreparationTime] int NOT NULL,
    [IsAvailable] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_MenuItemMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [MenuManagements] (
    [Id] int NOT NULL IDENTITY,
    [MenuName] nvarchar(100) NOT NULL,
    [MenuCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [MenuType] nvarchar(50) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [CostPrice] decimal(18,2) NOT NULL,
    [Cuisine] nvarchar(50) NOT NULL,
    [IsVegetarian] bit NOT NULL,
    [IsHalal] bit NOT NULL,
    [IsSpicy] bit NOT NULL,
    [Ingredients] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [PreparationTime] int NOT NULL,
    [IsAvailable] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [ChefSpecial] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_MenuManagements] PRIMARY KEY ([Id])
);

CREATE TABLE [OtherCharges] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [ChargeType] nvarchar(50) NOT NULL,
    [ApplicableTo] nvarchar(50) NOT NULL,
    [IsTaxable] bit NOT NULL,
    [IsOptional] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_OtherCharges] PRIMARY KEY ([Id])
);

CREATE TABLE [Plans] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [BasePrice] decimal(18,2) NOT NULL,
    [IsBreakfastIncluded] bit NOT NULL,
    [IsLunchIncluded] bit NOT NULL,
    [IsDinnerIncluded] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [TermsAndConditions] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Plans] PRIMARY KEY ([Id])
);

CREATE TABLE [RestaurantTables] (
    [Id] int NOT NULL IDENTITY,
    [TableNumber] nvarchar(50) NOT NULL,
    [SeatingCapacity] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RestaurantTables] PRIMARY KEY ([Id])
);

CREATE TABLE [RoomAmenities] (
    [Id] int NOT NULL IDENTITY,
    [AmenityName] nvarchar(100) NOT NULL,
    [AmenityCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [IsChargeable] bit NOT NULL,
    [ChargeAmount] decimal(18,2) NOT NULL,
    [ChargeType] nvarchar(50) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [DisplayOrder] int NOT NULL,
    [Specifications] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomAmenities] PRIMARY KEY ([Id])
);

CREATE TABLE [RoomMasters] (
    [Id] int NOT NULL IDENTITY,
    [RoomNumber] nvarchar(20) NOT NULL,
    [RoomCode] nvarchar(20) NOT NULL,
    [RoomType] nvarchar(50) NOT NULL,
    [FloorNumber] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [BaseRate] decimal(18,2) NOT NULL,
    [MaxOccupancy] int NOT NULL,
    [HasBalcony] bit NOT NULL,
    [HasSeaView] bit NOT NULL,
    [HasCityView] bit NOT NULL,
    [Amenities] nvarchar(500) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [LastMaintenance] datetime2 NULL,
    [NextMaintenance] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [RoomTypes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [BasePrice] decimal(18,2) NOT NULL,
    [MaxOccupancy] int NOT NULL,
    [Amenities] nvarchar(200) NOT NULL,
    [BaseRate] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomTypes] PRIMARY KEY ([Id])
);

CREATE TABLE [SMSSettings] (
    [Id] int NOT NULL IDENTITY,
    [ProviderName] nvarchar(100) NOT NULL,
    [ApiKey] nvarchar(255) NOT NULL,
    [ApiSecret] nvarchar(255) NOT NULL,
    [ApiUrl] nvarchar(100) NOT NULL,
    [FromNumber] nvarchar(20) NOT NULL,
    [AccountSid] nvarchar(50) NOT NULL,
    [AuthToken] nvarchar(255) NOT NULL,
    [Region] nvarchar(100) NOT NULL,
    [IsDefault] bit NOT NULL,
    [TimeoutSeconds] int NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_SMSSettings] PRIMARY KEY ([Id])
);

CREATE TABLE [SocialMediaManagements] (
    [Id] int NOT NULL IDENTITY,
    [PostNumber] nvarchar(50) NOT NULL,
    [Platform] nvarchar(50) NOT NULL,
    [PostTitle] nvarchar(200) NOT NULL,
    [PostContent] nvarchar(2000) NOT NULL,
    [PostType] nvarchar(50) NOT NULL,
    [ScheduledDate] datetime2 NOT NULL,
    [PublishedDate] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [Likes] int NOT NULL,
    [Shares] int NOT NULL,
    [Comments] int NOT NULL,
    [Reach] int NOT NULL,
    [Impressions] int NOT NULL,
    [Clicks] int NOT NULL,
    [EngagementRate] decimal(18,2) NOT NULL,
    [Hashtags] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [VideoPath] nvarchar(200) NOT NULL,
    [CreatedBy] nvarchar(100) NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_SocialMediaManagements] PRIMARY KEY ([Id])
);

CREATE TABLE [Suppliers] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [ContactPerson] nvarchar(100) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Phone] nvarchar(50) NOT NULL,
    [Mobile] nvarchar(50) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [TaxNumber] nvarchar(50) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id])
);

CREATE TABLE [TableManagements] (
    [Id] int NOT NULL IDENTITY,
    [TableNumber] nvarchar(50) NOT NULL,
    [TableCode] nvarchar(20) NOT NULL,
    [Capacity] int NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [TableType] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [IsReservable] bit NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [ReservedFrom] datetime2 NULL,
    [ReservedTo] datetime2 NULL,
    [ReservedBy] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_TableManagements] PRIMARY KEY ([Id])
);

CREATE TABLE [TableMasters] (
    [Id] int NOT NULL IDENTITY,
    [TableNumber] nvarchar(50) NOT NULL,
    [Code] nvarchar(20) NOT NULL,
    [Capacity] int NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [TableType] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [IsReservable] bit NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_TableMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [TaxMasters] (
    [Id] int NOT NULL IDENTITY,
    [TaxName] nvarchar(100) NOT NULL,
    [TaxCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [TaxRate] decimal(18,2) NOT NULL,
    [TaxType] nvarchar(50) NOT NULL,
    [ApplicableTo] nvarchar(100) NOT NULL,
    [IsInclusive] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [EffectiveFrom] datetime2 NOT NULL,
    [EffectiveTo] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_TaxMasters] PRIMARY KEY ([Id])
);

CREATE TABLE [TrainingPrograms] (
    [Id] int NOT NULL IDENTITY,
    [ProgramName] nvarchar(100) NOT NULL,
    [ProgramCode] nvarchar(20) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [TrainingType] nvarchar(50) NOT NULL,
    [Trainer] nvarchar(100) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [Duration] int NOT NULL,
    [MaxParticipants] int NOT NULL,
    [TrainingCost] decimal(18,2) NOT NULL,
    [Venue] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Prerequisites] nvarchar(500) NOT NULL,
    [Objectives] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_TrainingPrograms] PRIMARY KEY ([Id])
);

CREATE TABLE [TrialBalances] (
    [Id] int NOT NULL IDENTITY,
    [BalanceDate] datetime2 NOT NULL,
    [AccountCode] nvarchar(100) NOT NULL,
    [AccountName] nvarchar(200) NOT NULL,
    [AccountType] nvarchar(50) NOT NULL,
    [OpeningBalance] decimal(18,2) NOT NULL,
    [DebitAmount] decimal(18,2) NOT NULL,
    [CreditAmount] decimal(18,2) NOT NULL,
    [ClosingBalance] decimal(18,2) NOT NULL,
    [PreparedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_TrialBalances] PRIMARY KEY ([Id])
);

CREATE TABLE [Vouchers] (
    [Id] int NOT NULL IDENTITY,
    [VoucherNumber] nvarchar(50) NOT NULL,
    [VoucherDate] datetime2 NOT NULL,
    [VoucherType] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [PreparedBy] nvarchar(100) NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Vouchers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [LoyaltyPrograms] (
    [Id] int NOT NULL IDENTITY,
    [MembershipNumber] nvarchar(50) NOT NULL,
    [CustomerId] int NOT NULL,
    [ProgramTier] nvarchar(50) NOT NULL,
    [JoinDate] datetime2 NOT NULL,
    [ExpiryDate] datetime2 NULL,
    [CurrentPoints] int NOT NULL,
    [LifetimePoints] int NOT NULL,
    [RedeemedPoints] int NOT NULL,
    [TotalSpending] decimal(18,2) NOT NULL,
    [StaysCompleted] int NOT NULL,
    [NightsStayed] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [LastActivity] datetime2 NULL,
    [NextTierDate] datetime2 NULL,
    [PointsToNextTier] int NOT NULL,
    [Benefits] nvarchar(500) NOT NULL,
    [SpecialOffers] nvarchar(500) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_LoyaltyPrograms] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_LoyaltyPrograms_CustomerDatabases_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [CustomerDatabases] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ReviewsManagements] (
    [Id] int NOT NULL IDENTITY,
    [ReviewNumber] nvarchar(50) NOT NULL,
    [CustomerId] int NOT NULL,
    [ReviewSource] nvarchar(100) NOT NULL,
    [ReviewDate] datetime2 NOT NULL,
    [OverallRating] int NOT NULL,
    [ReviewTitle] nvarchar(200) NOT NULL,
    [ReviewText] nvarchar(2000) NOT NULL,
    [ReviewType] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ResponseDate] datetime2 NULL,
    [ManagementResponse] nvarchar(1000) NOT NULL,
    [RespondedBy] nvarchar(100) NOT NULL,
    [IsPublic] bit NOT NULL,
    [IsVerified] bit NOT NULL,
    [HelpfulVotes] int NOT NULL,
    [ActionsTaken] nvarchar(500) NOT NULL,
    [InternalNotes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ReviewsManagements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReviewsManagements_CustomerDatabases_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [CustomerDatabases] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Designations] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(100) NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [DepartmentId] int NOT NULL,
    [Level] nvarchar(50) NOT NULL,
    [MinSalary] decimal(18,2) NULL,
    [MaxSalary] decimal(18,2) NULL,
    [Responsibilities] nvarchar(1000) NOT NULL,
    [Requirements] nvarchar(1000) NOT NULL,
    [Skills] nvarchar(1000) NOT NULL,
    [ReportsToDesignationId] int NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Designations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Designations_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Designations_Designations_ReportsToDesignationId] FOREIGN KEY ([ReportsToDesignationId]) REFERENCES [Designations] ([Id])
);

CREATE TABLE [Dishes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [CategoryId] int NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [ImageUrl] nvarchar(255) NOT NULL,
    [DietaryInfo] nvarchar(50) NOT NULL,
    [IsAvailable] bit NOT NULL,
    [PreparationTime] int NOT NULL,
    [Calories] int NOT NULL,
    [Ingredients] nvarchar(1000) NOT NULL,
    [Allergens] nvarchar(1000) NOT NULL,
    [SpiceLevel] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Dishes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Dishes_DishCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [DishCategories] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Expenses] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [ExpenseTypeId] int NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [ExpenseDate] datetime2 NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [ReferenceNumber] nvarchar(100) NOT NULL,
    [VendorName] nvarchar(200) NOT NULL,
    [VendorAddress] nvarchar(500) NOT NULL,
    [VendorPhone] nvarchar(20) NOT NULL,
    [VendorEmail] nvarchar(100) NOT NULL,
    [InvoiceNumber] nvarchar(50) NOT NULL,
    [InvoiceDate] datetime2 NULL,
    [AttachmentPath] nvarchar(255) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Notes] nvarchar(1000) NOT NULL,
    [ApprovedBy] nvarchar(50) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [PaidBy] nvarchar(50) NOT NULL,
    [PaymentDate] datetime2 NULL,
    [TaxAmount] decimal(18,2) NULL,
    [TaxRate] decimal(5,2) NULL,
    [Category] nvarchar(50) NOT NULL,
    [IsRecurring] bit NOT NULL,
    [RecurrencePattern] nvarchar(50) NOT NULL,
    [RecurrenceInterval] int NULL,
    [NextRecurrenceDate] datetime2 NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Expenses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Expenses_ExpenseTypes_ExpenseTypeId] FOREIGN KEY ([ExpenseTypeId]) REFERENCES [ExpenseTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [EventManagements] (
    [Id] int NOT NULL IDENTITY,
    [EventNumber] nvarchar(50) NOT NULL,
    [EventName] nvarchar(200) NOT NULL,
    [EventType] nvarchar(50) NOT NULL,
    [OrganizerGuestId] int NOT NULL,
    [EventDate] datetime2 NOT NULL,
    [StartTime] time NOT NULL,
    [EndTime] time NOT NULL,
    [ExpectedGuests] int NOT NULL,
    [ActualGuests] int NOT NULL,
    [Venue] nvarchar(100) NOT NULL,
    [VenueCharge] decimal(18,2) NOT NULL,
    [CateringCharge] decimal(18,2) NOT NULL,
    [DecorationCharge] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [AdvancePaid] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [SpecialRequirements] nvarchar(500) NOT NULL,
    [EventManager] nvarchar(100) NOT NULL,
    [EventNotes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EventManagements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EventManagements_Guests_OrganizerGuestId] FOREIGN KEY ([OrganizerGuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestDocuments] (
    [Id] int NOT NULL IDENTITY,
    [GuestId] int NOT NULL,
    [DocumentType] nvarchar(max) NOT NULL,
    [DocumentNumber] nvarchar(max) NOT NULL,
    [IssueDate] datetime2 NULL,
    [ExpiryDate] datetime2 NULL,
    [DocumentPath] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestDocuments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestDocuments_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestHistories] (
    [Id] int NOT NULL IDENTITY,
    [GuestId] int NOT NULL,
    [VisitNumber] nvarchar(50) NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [RoomNumber] nvarchar(50) NOT NULL,
    [RoomType] nvarchar(50) NOT NULL,
    [TotalBill] decimal(18,2) NOT NULL,
    [AmountPaid] decimal(18,2) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [Feedback] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [Purpose] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestHistories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestHistories_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestLedgers] (
    [Id] int NOT NULL IDENTITY,
    [GuestId] int NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [TransactionType] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Debit] decimal(18,2) NOT NULL,
    [Credit] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestLedgers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestLedgers_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SpaWellnesses] (
    [Id] int NOT NULL IDENTITY,
    [BookingNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [ServiceName] nvarchar(100) NOT NULL,
    [ServiceDescription] nvarchar(500) NOT NULL,
    [ServiceCategory] nvarchar(50) NOT NULL,
    [BookingDate] datetime2 NOT NULL,
    [ServiceDate] datetime2 NOT NULL,
    [ServiceTime] time NOT NULL,
    [Duration] int NOT NULL,
    [ServicePrice] decimal(18,2) NOT NULL,
    [Therapist] nvarchar(100) NOT NULL,
    [RoomFacility] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [SpecialRequests] nvarchar(500) NOT NULL,
    [TreatmentNotes] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [GuestFeedback] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_SpaWellnesses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SpaWellnesses_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TourTravels] (
    [Id] int NOT NULL IDENTITY,
    [BookingNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [TourName] nvarchar(200) NOT NULL,
    [TourDescription] nvarchar(500) NOT NULL,
    [TourType] nvarchar(50) NOT NULL,
    [BookingDate] datetime2 NOT NULL,
    [TourDate] datetime2 NOT NULL,
    [StartTime] time NOT NULL,
    [Duration] int NOT NULL,
    [ParticipantCount] int NOT NULL,
    [TourPrice] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [TourGuide] nvarchar(100) NOT NULL,
    [GuidePhone] nvarchar(20) NOT NULL,
    [TransportArrangement] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Inclusions] nvarchar(500) NOT NULL,
    [Exclusions] nvarchar(500) NOT NULL,
    [SpecialRequirements] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [GuestFeedback] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_TourTravels] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TourTravels_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Transportations] (
    [Id] int NOT NULL IDENTITY,
    [BookingNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [TransportType] nvarchar(50) NOT NULL,
    [PickupLocation] nvarchar(200) NOT NULL,
    [DropoffLocation] nvarchar(200) NOT NULL,
    [BookingDate] datetime2 NOT NULL,
    [ServiceDate] datetime2 NOT NULL,
    [ServiceTime] time NOT NULL,
    [VehicleType] nvarchar(50) NOT NULL,
    [PassengerCount] int NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [DriverName] nvarchar(100) NOT NULL,
    [DriverPhone] nvarchar(20) NOT NULL,
    [VehicleNumber] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [ServiceNotes] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [GuestFeedback] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Transportations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Transportations_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [StockAccountings] (
    [Id] int NOT NULL IDENTITY,
    [ItemId] int NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalValue] decimal(18,2) NOT NULL,
    [StockBalance] decimal(18,2) NOT NULL,
    [StockValue] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_StockAccountings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StockAccountings_ItemMasters_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [ItemMasters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [StockAlerts] (
    [Id] int NOT NULL IDENTITY,
    [ItemId] int NOT NULL,
    [AlertType] nvarchar(50) NOT NULL,
    [AlertDate] datetime2 NOT NULL,
    [CurrentStock] decimal(18,2) NOT NULL,
    [MinimumLevel] decimal(18,2) NOT NULL,
    [ExpiryDate] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [AlertedTo] nvarchar(100) NOT NULL,
    [ResolvedDate] datetime2 NULL,
    [ResolvedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_StockAlerts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StockAlerts_ItemMasters_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [ItemMasters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [StockManagements] (
    [Id] int NOT NULL IDENTITY,
    [ItemId] int NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalValue] decimal(18,2) NOT NULL,
    [StockBalance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [Department] nvarchar(100) NOT NULL,
    [IssuedTo] nvarchar(100) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_StockManagements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StockManagements_ItemMasters_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [ItemMasters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestCommunications] (
    [Id] int NOT NULL IDENTITY,
    [CommunicationNumber] nvarchar(50) NOT NULL,
    [CustomerId] int NOT NULL,
    [CommunicationType] nvarchar(50) NOT NULL,
    [Subject] nvarchar(100) NOT NULL,
    [Message] nvarchar(1000) NOT NULL,
    [SentDate] datetime2 NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [DeliveredDate] datetime2 NULL,
    [ReadDate] datetime2 NULL,
    [ReplyDate] datetime2 NULL,
    [ReplyMessage] nvarchar(1000) NOT NULL,
    [Priority] nvarchar(50) NOT NULL,
    [SentBy] nvarchar(100) NOT NULL,
    [Purpose] nvarchar(50) NOT NULL,
    [CampaignId] int NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestCommunications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestCommunications_CustomerDatabases_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [CustomerDatabases] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_GuestCommunications_MarketingCampaigns_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [MarketingCampaigns] ([Id])
);

CREATE TABLE [RoomRates] (
    [Id] int NOT NULL IDENTITY,
    [RoomTypeId] int NOT NULL,
    [RateCode] nvarchar(50) NOT NULL,
    [RateName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [BaseRate] decimal(18,2) NOT NULL,
    [WeekendRate] decimal(18,2) NOT NULL,
    [SeasonalRate] decimal(18,2) NOT NULL,
    [Season] nvarchar(50) NOT NULL,
    [EffectiveFrom] datetime2 NOT NULL,
    [EffectiveTo] datetime2 NOT NULL,
    [Currency] nvarchar(50) NOT NULL,
    [IncludesBreakfast] bit NOT NULL,
    [IncludesTax] bit NOT NULL,
    [TaxPercentage] decimal(18,2) NOT NULL,
    [Terms] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomRates] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomRates_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Rooms] (
    [Id] int NOT NULL IDENTITY,
    [RoomNumber] nvarchar(20) NOT NULL,
    [RoomTypeId] int NOT NULL,
    [FloorNumber] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [MaxAdults] int NOT NULL,
    [MaxChildren] int NOT NULL,
    [BasePrice] decimal(18,2) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Features] nvarchar(200) NOT NULL,
    [PlanId] int NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Rooms_Plans_PlanId] FOREIGN KEY ([PlanId]) REFERENCES [Plans] ([Id]),
    CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RoomTypeAmenityMappings] (
    [Id] int NOT NULL IDENTITY,
    [RoomTypeId] int NOT NULL,
    [AmenityId] int NOT NULL,
    [IsStandard] bit NOT NULL,
    [IsOptional] bit NOT NULL,
    [AdditionalCharge] decimal(18,2) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomTypeAmenityMappings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomTypeAmenityMappings_RoomAmenities_AmenityId] FOREIGN KEY ([AmenityId]) REFERENCES [RoomAmenities] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RoomTypeAmenityMappings_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [InventoryItems] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CategoryId] int NOT NULL,
    [SupplierId] int NULL,
    [UnitOfMeasure] nvarchar(50) NOT NULL,
    [CostPrice] decimal(18,2) NOT NULL,
    [SellingPrice] decimal(18,2) NOT NULL,
    [TaxRate] decimal(5,2) NOT NULL,
    [StockQuantity] decimal(18,3) NOT NULL,
    [ReorderLevel] decimal(18,3) NOT NULL,
    [ReorderQuantity] decimal(18,3) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [ImageUrl] nvarchar(255) NOT NULL,
    [Notes] nvarchar(1000) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_InventoryItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InventoryItems_InventoryCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [InventoryCategories] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_InventoryItems_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id])
);

CREATE TABLE [PurchaseOrders] (
    [Id] int NOT NULL IDENTITY,
    [PONumber] nvarchar(50) NOT NULL,
    [SupplierId] int NOT NULL,
    [OrderDate] datetime2 NOT NULL,
    [ExpectedDeliveryDate] datetime2 NULL,
    [ActualDeliveryDate] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [SubTotal] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [OrderedBy] nvarchar(100) NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [Terms] nvarchar(500) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_PurchaseOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PurchaseOrders_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Purchases] (
    [Id] int NOT NULL IDENTITY,
    [PurchaseNumber] nvarchar(50) NOT NULL,
    [SupplierId] int NOT NULL,
    [PurchaseDate] datetime2 NOT NULL,
    [ExpectedDeliveryDate] datetime2 NULL,
    [DeliveryDate] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [Reference] nvarchar(100) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [SubTotal] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [DiscountAmount] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Purchases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Purchases_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SupplierLedgers] (
    [Id] int NOT NULL IDENTITY,
    [SupplierId] int NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [Description] nvarchar(100) NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [DebitAmount] decimal(18,2) NOT NULL,
    [CreditAmount] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_SupplierLedgers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SupplierLedgers_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Employees] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] nvarchar(50) NOT NULL,
    [EmployeeCode] nvarchar(max) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [MiddleName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Gender] nvarchar(20) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [MaritalStatus] nvarchar(20) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [PhoneNumber] nvarchar(50) NOT NULL,
    [MobileNumber] nvarchar(50) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [State] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [PostalCode] nvarchar(20) NOT NULL,
    [Designation] nvarchar(100) NOT NULL,
    [Position] nvarchar(max) NOT NULL,
    [Department] nvarchar(100) NOT NULL,
    [JoiningDate] datetime2 NULL,
    [TerminationDate] datetime2 NULL,
    [EmploymentType] nvarchar(50) NOT NULL,
    [BasicSalary] decimal(18,2) NOT NULL,
    [EmergencyContactName] nvarchar(500) NOT NULL,
    [EmergencyContact] nvarchar(max) NOT NULL,
    [EmergencyContactPhone] nvarchar(50) NOT NULL,
    [EmergencyPhone] nvarchar(max) NOT NULL,
    [EmergencyContactRelation] nvarchar(200) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [DepartmentId] int NULL,
    [DesignationId] int NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Employees] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Employees_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]),
    CONSTRAINT [FK_Employees_Designations_DesignationId] FOREIGN KEY ([DesignationId]) REFERENCES [Designations] ([Id])
);

CREATE TABLE [CheckInWithIDs] (
    [Id] int NOT NULL IDENTITY,
    [CheckInNumber] nvarchar(50) NOT NULL,
    [GuestName] nvarchar(100) NOT NULL,
    [IdType] nvarchar(50) NOT NULL,
    [IdNumber] nvarchar(50) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [RoomId] int NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [ExpectedCheckOutDate] datetime2 NOT NULL,
    [NumberOfGuests] int NOT NULL,
    [RoomRate] decimal(18,2) NOT NULL,
    [SecurityDeposit] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [CheckedInBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckInWithIDs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckInWithIDs_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CleaningSchedules] (
    [Id] int NOT NULL IDENTITY,
    [ScheduleNumber] nvarchar(50) NOT NULL,
    [RoomId] int NOT NULL,
    [ScheduledDate] datetime2 NOT NULL,
    [ScheduledTime] datetime2 NOT NULL,
    [CleaningType] nvarchar(50) NOT NULL,
    [AssignedHousekeeper] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [StartTime] datetime2 NULL,
    [CompletionTime] datetime2 NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [CompletionNotes] nvarchar(500) NOT NULL,
    [EstimatedDuration] int NOT NULL,
    [ActualDuration] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CleaningSchedules] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CleaningSchedules_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ConciergeServices] (
    [Id] int NOT NULL IDENTITY,
    [ServiceNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [RoomId] int NULL,
    [ServiceType] nvarchar(100) NOT NULL,
    [ServiceDescription] nvarchar(500) NOT NULL,
    [RequestDate] datetime2 NOT NULL,
    [CompletionDate] datetime2 NULL,
    [Priority] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [AssignedTo] nvarchar(100) NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [CompletionNotes] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [GuestFeedback] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ConciergeServices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ConciergeServices_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ConciergeServices_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [HousekeepingLaundries] (
    [Id] int NOT NULL IDENTITY,
    [LaundryNumber] nvarchar(50) NOT NULL,
    [RoomId] int NULL,
    [GuestId] int NULL,
    [ServiceType] nvarchar(100) NOT NULL,
    [RequestDate] datetime2 NOT NULL,
    [PickupDate] datetime2 NULL,
    [DeliveryDate] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [ItemCount] int NOT NULL,
    [TotalWeight] decimal(18,2) NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [ExpressCharge] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [ProcessedBy] nvarchar(100) NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [IsExpress] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_HousekeepingLaundries] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HousekeepingLaundries_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]),
    CONSTRAINT [FK_HousekeepingLaundries_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [HousekeepingRoomStatuses] (
    [Id] int NOT NULL IDENTITY,
    [RoomId] int NOT NULL,
    [CleaningStatus] nvarchar(50) NOT NULL,
    [OccupancyStatus] nvarchar(50) NOT NULL,
    [LastCleaned] datetime2 NOT NULL,
    [NextCleaningScheduled] datetime2 NULL,
    [AssignedHousekeeper] nvarchar(100) NOT NULL,
    [CleaningNotes] nvarchar(500) NOT NULL,
    [RequiresInspection] bit NOT NULL,
    [InspectionDate] datetime2 NULL,
    [InspectedBy] nvarchar(100) NOT NULL,
    [InspectionNotes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_HousekeepingRoomStatuses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HousekeepingRoomStatuses_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [LostAndFounds] (
    [Id] int NOT NULL IDENTITY,
    [ItemNumber] nvarchar(50) NOT NULL,
    [ItemDescription] nvarchar(100) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [RoomId] int NULL,
    [LocationFound] nvarchar(100) NOT NULL,
    [DateFound] datetime2 NOT NULL,
    [FoundBy] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [GuestName] nvarchar(100) NOT NULL,
    [GuestPhone] nvarchar(20) NOT NULL,
    [GuestEmail] nvarchar(100) NOT NULL,
    [ClaimedDate] datetime2 NULL,
    [ClaimedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [ImagePath] nvarchar(200) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_LostAndFounds] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_LostAndFounds_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [MaintenanceRequests] (
    [Id] int NOT NULL IDENTITY,
    [RequestNumber] nvarchar(50) NOT NULL,
    [RoomId] int NOT NULL,
    [IssueType] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Priority] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ReportedDate] datetime2 NOT NULL,
    [ReportedBy] nvarchar(100) NOT NULL,
    [AssignedTo] nvarchar(100) NOT NULL,
    [ScheduledDate] datetime2 NULL,
    [StartDate] datetime2 NULL,
    [CompletionDate] datetime2 NULL,
    [EstimatedCost] decimal(18,2) NOT NULL,
    [ActualCost] decimal(18,2) NOT NULL,
    [WorkPerformed] nvarchar(500) NOT NULL,
    [PartsUsed] nvarchar(500) NOT NULL,
    [CompletionNotes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_MaintenanceRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MaintenanceRequests_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ReservationMasters] (
    [Id] int NOT NULL IDENTITY,
    [ReservationNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [RoomTypeId] int NOT NULL,
    [RoomId] int NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [NumberOfGuests] int NOT NULL,
    [NumberOfRooms] int NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [AdvanceAmount] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [SpecialRequests] nvarchar(500) NOT NULL,
    [BookingSource] nvarchar(50) NOT NULL,
    [BookedBy] nvarchar(100) NOT NULL,
    [BookingDate] datetime2 NOT NULL,
    [CancellationReason] nvarchar(500) NOT NULL,
    [CancellationDate] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ReservationMasters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReservationMasters_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ReservationMasters_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ReservationMasters_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [Reservations] (
    [Id] int NOT NULL IDENTITY,
    [ReservationNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [RoomId] int NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [NumberOfAdults] int NOT NULL,
    [NumberOfChildren] int NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [SpecialRequests] nvarchar(500) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [TotalPaid] decimal(18,2) NOT NULL,
    [PaymentStatus] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Reservations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reservations_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reservations_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [RoomAmenityMappings] (
    [Id] int NOT NULL IDENTITY,
    [RoomId] int NOT NULL,
    [AmenityId] int NOT NULL,
    [IsIncluded] bit NOT NULL,
    [AdditionalCharge] decimal(18,2) NOT NULL,
    [Notes] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomAmenityMappings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomAmenityMappings_RoomAmenities_AmenityId] FOREIGN KEY ([AmenityId]) REFERENCES [RoomAmenities] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RoomAmenityMappings_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RoomImage] (
    [Id] int NOT NULL IDENTITY,
    [RoomId] int NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [IsPrimary] bit NOT NULL,
    [Caption] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomImage] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomImage_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RoomStatusMasters] (
    [Id] int NOT NULL IDENTITY,
    [RoomId] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [HousekeepingStatus] nvarchar(50) NOT NULL,
    [StatusDate] datetime2 NOT NULL,
    [UpdatedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [MaintenanceScheduled] datetime2 NULL,
    [CleaningScheduled] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomStatusMasters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomStatusMasters_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [WalkInGuests] (
    [Id] int NOT NULL IDENTITY,
    [WalkInNumber] nvarchar(50) NOT NULL,
    [GuestName] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [IdType] nvarchar(50) NOT NULL,
    [IdNumber] nvarchar(50) NOT NULL,
    [RoomTypeId] int NOT NULL,
    [RoomId] int NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [NumberOfGuests] int NOT NULL,
    [RoomRate] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [HandledBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_WalkInGuests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WalkInGuests_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_WalkInGuests_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [StockMovements] (
    [Id] int NOT NULL IDENTITY,
    [ItemId] int NOT NULL,
    [MovementDate] datetime2 NOT NULL,
    [MovementType] nvarchar(50) NOT NULL,
    [Quantity] decimal(18,3) NOT NULL,
    [ReferenceId] nvarchar(100) NOT NULL,
    [ReferenceType] nvarchar(100) NOT NULL,
    [UnitCost] decimal(18,2) NULL,
    [TotalCost] decimal(18,2) NULL,
    [Notes] nvarchar(1000) NOT NULL,
    [CreatedBy] nvarchar(50) NOT NULL,
    [UpdatedBy] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_StockMovements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StockMovements_InventoryItems_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [InventoryItems] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [PurchaseOrderItems] (
    [Id] int NOT NULL IDENTITY,
    [PurchaseOrderId] int NOT NULL,
    [ItemId] int NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [ReceivedQuantity] decimal(18,2) NOT NULL,
    [PendingQuantity] decimal(18,2) NOT NULL,
    [Specifications] nvarchar(500) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_PurchaseOrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PurchaseOrderItems_ItemMasters_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [ItemMasters] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [PurchaseOrders] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [PurchaseItems] (
    [Id] int NOT NULL IDENTITY,
    [PurchaseId] int NOT NULL,
    [ItemId] int NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [ReceivedQuantity] decimal(18,2) NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_PurchaseItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PurchaseItems_InventoryItems_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [InventoryItems] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PurchaseItems_Purchases_PurchaseId] FOREIGN KEY ([PurchaseId]) REFERENCES [Purchases] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [EmployeeAttendances] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] int NOT NULL,
    [AttendanceDate] datetime2 NOT NULL,
    [CheckInTime] datetime2 NULL,
    [CheckOutTime] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [WorkingHours] decimal(18,2) NULL,
    [OvertimeHours] decimal(18,2) NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EmployeeAttendances] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EmployeeAttendances_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [EmployeeDocuments] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] int NOT NULL,
    [DocumentType] nvarchar(max) NOT NULL,
    [DocumentNumber] nvarchar(max) NOT NULL,
    [IssueDate] datetime2 NULL,
    [ExpiryDate] datetime2 NULL,
    [DocumentPath] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EmployeeDocuments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EmployeeDocuments_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [EmployeeLeave] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] int NOT NULL,
    [LeaveType] nvarchar(max) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [NumberOfDays] int NOT NULL,
    [Reason] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [ApprovedBy] nvarchar(max) NOT NULL,
    [ApprovedDate] datetime2 NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EmployeeLeave] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EmployeeLeave_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [EmployeePayments] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] int NOT NULL,
    [PaymentType] nvarchar(max) NOT NULL,
    [PaymentMethod] nvarchar(max) NOT NULL,
    [PaymentDate] datetime2 NOT NULL,
    [PeriodFrom] nvarchar(max) NOT NULL,
    [PeriodTo] nvarchar(max) NOT NULL,
    [BasicSalary] decimal(18,2) NOT NULL,
    [Allowances] decimal(18,2) NOT NULL,
    [Deductions] decimal(18,2) NOT NULL,
    [OvertimeAmount] decimal(18,2) NOT NULL,
    [Bonus] decimal(18,2) NOT NULL,
    [NetSalary] decimal(18,2) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [PaymentMonth] int NOT NULL,
    [PaymentYear] int NOT NULL,
    [GrossSalary] decimal(18,2) NOT NULL,
    [TaxDeduction] decimal(18,2) NOT NULL,
    [ProvidentFund] decimal(18,2) NOT NULL,
    [OtherDeductions] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_EmployeePayments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EmployeePayments_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [LeaveManagements] (
    [Id] int NOT NULL IDENTITY,
    [LeaveNumber] nvarchar(50) NOT NULL,
    [EmployeeId] int NOT NULL,
    [LeaveType] nvarchar(50) NOT NULL,
    [FromDate] datetime2 NOT NULL,
    [ToDate] datetime2 NOT NULL,
    [TotalDays] int NOT NULL,
    [Reason] nvarchar(500) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [ApprovalRemarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_LeaveManagements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_LeaveManagements_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [PayrollAdvances] (
    [Id] int NOT NULL IDENTITY,
    [AdvanceNumber] nvarchar(50) NOT NULL,
    [EmployeeId] int NOT NULL,
    [RequestDate] datetime2 NOT NULL,
    [RequestedAmount] decimal(18,2) NOT NULL,
    [ApprovedAmount] decimal(18,2) NOT NULL,
    [Purpose] nvarchar(500) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ApprovedBy] nvarchar(100) NOT NULL,
    [ApprovalDate] datetime2 NULL,
    [PaymentDate] datetime2 NULL,
    [OutstandingAmount] decimal(18,2) NOT NULL,
    [InstallmentMonths] int NOT NULL,
    [MonthlyDeduction] decimal(18,2) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_PayrollAdvances] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PayrollAdvances_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [PerformanceReviews] (
    [Id] int NOT NULL IDENTITY,
    [EmployeeId] int NOT NULL,
    [ReviewDate] datetime2 NOT NULL,
    [ReviewPeriod] nvarchar(50) NOT NULL,
    [OverallRating] int NOT NULL,
    [QualityRating] int NOT NULL,
    [ProductivityRating] int NOT NULL,
    [TeamworkRating] int NOT NULL,
    [CommunicationRating] int NOT NULL,
    [Strengths] nvarchar(500) NOT NULL,
    [AreasForImprovement] nvarchar(500) NOT NULL,
    [Goals] nvarchar(500) NOT NULL,
    [ReviewedBy] nvarchar(100) NOT NULL,
    [EmployeeComments] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_PerformanceReviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PerformanceReviews_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CheckOutWithIDs] (
    [Id] int NOT NULL IDENTITY,
    [CheckOutNumber] nvarchar(50) NOT NULL,
    [CheckInWithIDId] int NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [RoomCharges] decimal(18,2) NOT NULL,
    [ServiceCharges] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [TotalBill] decimal(18,2) NOT NULL,
    [SecurityDepositRefund] decimal(18,2) NOT NULL,
    [TotalPaid] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [CheckedOutBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [LateCheckOut] bit NOT NULL,
    [LateCheckOutCharges] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckOutWithIDs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckOutWithIDs_CheckInWithIDs_CheckInWithIDId] FOREIGN KEY ([CheckInWithIDId]) REFERENCES [CheckInWithIDs] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CheckInMasters] (
    [Id] int NOT NULL IDENTITY,
    [CheckInNumber] nvarchar(50) NOT NULL,
    [ReservationId] int NULL,
    [GuestId] int NOT NULL,
    [RoomId] int NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [ExpectedCheckOutDate] datetime2 NOT NULL,
    [NumberOfGuests] int NOT NULL,
    [RoomRate] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [AdvancePaid] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [SpecialRequests] nvarchar(500) NOT NULL,
    [CheckedInBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckInMasters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckInMasters_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]),
    CONSTRAINT [FK_CheckInMasters_ReservationMasters_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [ReservationMasters] ([Id]),
    CONSTRAINT [FK_CheckInMasters_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [CheckIns] (
    [Id] int NOT NULL IDENTITY,
    [ReservationId] int NOT NULL,
    [CheckInDateTime] datetime2 NOT NULL,
    [CheckedInBy] int NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckIns] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckIns_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CheckOuts] (
    [Id] int NOT NULL IDENTITY,
    [ReservationId] int NOT NULL,
    [CheckOutDateTime] datetime2 NOT NULL,
    [CheckedOutBy] int NOT NULL,
    [TotalBill] decimal(18,2) NOT NULL,
    [TotalPaid] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [PaymentStatus] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckOuts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckOuts_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ReservationDetails] (
    [Id] int NOT NULL IDENTITY,
    [ReservationId] int NOT NULL,
    [RoomId] int NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [Rate] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [SpecialRequest] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ReservationDetails] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReservationDetails_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ReservationDetails_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ReservationPayments] (
    [Id] int NOT NULL IDENTITY,
    [ReservationId] int NOT NULL,
    [PaymentDate] datetime2 NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [PaymentMethod] nvarchar(max) NOT NULL,
    [TransactionId] nvarchar(max) NOT NULL,
    [PaymentStatus] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_ReservationPayments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReservationPayments_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RestaurantOrders] (
    [Id] int NOT NULL IDENTITY,
    [OrderNumber] nvarchar(50) NOT NULL,
    [ReservationId] int NULL,
    [RoomId] int NULL,
    [TableId] int NULL,
    [OrderType] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [OrderDate] datetime2 NOT NULL,
    [DeliveryTime] datetime2 NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [SubTotal] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [DiscountAmount] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RestaurantOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RestaurantOrders_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id]),
    CONSTRAINT [FK_RestaurantOrders_RestaurantTables_TableId] FOREIGN KEY ([TableId]) REFERENCES [RestaurantTables] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_RestaurantOrders_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [CheckOutMasters] (
    [Id] int NOT NULL IDENTITY,
    [CheckOutNumber] nvarchar(50) NOT NULL,
    [CheckInId] int NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [RoomCharges] decimal(18,2) NOT NULL,
    [ServiceCharges] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [TotalBill] decimal(18,2) NOT NULL,
    [TotalPaid] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [CheckedOutBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [LateCheckOut] bit NOT NULL,
    [LateCheckOutCharges] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_CheckOutMasters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CheckOutMasters_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id])
);

CREATE TABLE [GuestAccounts] (
    [Id] int NOT NULL IDENTITY,
    [AccountNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [CheckInId] int NULL,
    [TransactionDate] datetime2 NOT NULL,
    [Description] nvarchar(100) NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [DebitAmount] decimal(18,2) NOT NULL,
    [CreditAmount] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestAccounts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestAccounts_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]),
    CONSTRAINT [FK_GuestAccounts_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestFeedbackServices] (
    [Id] int NOT NULL IDENTITY,
    [FeedbackNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [CheckInId] int NULL,
    [FeedbackDate] datetime2 NOT NULL,
    [FeedbackType] nvarchar(50) NOT NULL,
    [OverallRating] int NOT NULL,
    [ServiceRating] int NOT NULL,
    [CleanlinessRating] int NOT NULL,
    [FoodRating] int NOT NULL,
    [StaffRating] int NOT NULL,
    [ValueForMoneyRating] int NOT NULL,
    [Comments] nvarchar(1000) NOT NULL,
    [Suggestions] nvarchar(500) NOT NULL,
    [Complaints] nvarchar(500) NOT NULL,
    [WouldRecommend] bit NOT NULL,
    [WouldReturnAgain] bit NOT NULL,
    [FeedbackSource] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ReviewedBy] nvarchar(100) NOT NULL,
    [ResponseDate] datetime2 NULL,
    [ManagementResponse] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestFeedbackServices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestFeedbackServices_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]),
    CONSTRAINT [FK_GuestFeedbackServices_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GuestFolios] (
    [Id] int NOT NULL IDENTITY,
    [FolioNumber] nvarchar(50) NOT NULL,
    [CheckInId] int NOT NULL,
    [TransactionDate] datetime2 NOT NULL,
    [Description] nvarchar(100) NOT NULL,
    [TransactionType] nvarchar(50) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    [Reference] nvarchar(50) NOT NULL,
    [PostedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_GuestFolios] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestFolios_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Payments] (
    [Id] int NOT NULL IDENTITY,
    [PaymentNumber] nvarchar(50) NOT NULL,
    [GuestId] int NOT NULL,
    [CheckInId] int NULL,
    [PaymentDate] datetime2 NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [PaymentType] nvarchar(50) NOT NULL,
    [Reference] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ReceivedBy] nvarchar(100) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CardNumber] nvarchar(50) NOT NULL,
    [BankName] nvarchar(100) NOT NULL,
    [ChequeNumber] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payments_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]),
    CONSTRAINT [FK_Payments_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RoomTransfers] (
    [Id] int NOT NULL IDENTITY,
    [TransferNumber] nvarchar(50) NOT NULL,
    [CheckInId] int NOT NULL,
    [FromRoomId] int NOT NULL,
    [ToRoomId] int NOT NULL,
    [TransferDate] datetime2 NOT NULL,
    [Reason] nvarchar(500) NOT NULL,
    [AdditionalCharges] decimal(18,2) NOT NULL,
    [AuthorizedBy] nvarchar(100) NOT NULL,
    [ProcessedBy] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomTransfers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomTransfers_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RoomTransfers_Rooms_FromRoomId] FOREIGN KEY ([FromRoomId]) REFERENCES [Rooms] ([Id]),
    CONSTRAINT [FK_RoomTransfers_Rooms_ToRoomId] FOREIGN KEY ([ToRoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [MenuItemId] int NOT NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_MenuManagements_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuManagements] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_RestaurantOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [RestaurantOrders] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RestaurantBillingInfos] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [BillingNumber] nvarchar(max) NOT NULL,
    [BillingDate] datetime2 NOT NULL,
    [PaymentMethod] nvarchar(max) NOT NULL,
    [TransactionId] nvarchar(max) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RestaurantBillingInfos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RestaurantBillingInfos_RestaurantOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [RestaurantOrders] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RestaurantOrderedProducts] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [DishId] int NOT NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [SpecialInstructions] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RestaurantOrderedProducts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RestaurantOrderedProducts_Dishes_DishId] FOREIGN KEY ([DishId]) REFERENCES [Dishes] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_RestaurantOrderedProducts_RestaurantOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [RestaurantOrders] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RoomServices] (
    [Id] int NOT NULL IDENTITY,
    [ServiceNumber] nvarchar(50) NOT NULL,
    [RoomId] int NOT NULL,
    [OrderId] int NOT NULL,
    [RequestTime] datetime2 NOT NULL,
    [DeliveryTime] datetime2 NULL,
    [Status] nvarchar(50) NOT NULL,
    [DeliveryCharge] decimal(18,2) NOT NULL,
    [DeliveredBy] nvarchar(100) NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [Remarks] nvarchar(500) NOT NULL,
    [Rating] int NOT NULL,
    [Feedback] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RoomServices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomServices_RestaurantOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [RestaurantOrders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RoomServices_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [KitchenDisplays] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [OrderItemId] int NOT NULL,
    [ItemName] nvarchar(100) NOT NULL,
    [Quantity] int NOT NULL,
    [SpecialInstructions] nvarchar(500) NOT NULL,
    [Priority] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [OrderTime] datetime2 NOT NULL,
    [StartTime] datetime2 NULL,
    [CompletionTime] datetime2 NULL,
    [AssignedChef] nvarchar(100) NOT NULL,
    [KitchenSection] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_KitchenDisplays] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_KitchenDisplays_OrderItems_OrderItemId] FOREIGN KEY ([OrderItemId]) REFERENCES [OrderItems] ([Id]),
    CONSTRAINT [FK_KitchenDisplays_RestaurantOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [RestaurantOrders] ([Id])
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_CheckInMasters_GuestId] ON [CheckInMasters] ([GuestId]);

CREATE INDEX [IX_CheckInMasters_ReservationId] ON [CheckInMasters] ([ReservationId]);

CREATE INDEX [IX_CheckInMasters_RoomId] ON [CheckInMasters] ([RoomId]);

CREATE UNIQUE INDEX [IX_CheckIns_ReservationId] ON [CheckIns] ([ReservationId]);

CREATE INDEX [IX_CheckInWithIDs_RoomId] ON [CheckInWithIDs] ([RoomId]);

CREATE INDEX [IX_CheckOutMasters_CheckInId] ON [CheckOutMasters] ([CheckInId]);

CREATE UNIQUE INDEX [IX_CheckOuts_ReservationId] ON [CheckOuts] ([ReservationId]);

CREATE INDEX [IX_CheckOutWithIDs_CheckInWithIDId] ON [CheckOutWithIDs] ([CheckInWithIDId]);

CREATE INDEX [IX_CleaningSchedules_RoomId] ON [CleaningSchedules] ([RoomId]);

CREATE INDEX [IX_ConciergeServices_GuestId] ON [ConciergeServices] ([GuestId]);

CREATE INDEX [IX_ConciergeServices_RoomId] ON [ConciergeServices] ([RoomId]);

CREATE INDEX [IX_Departments_ParentDepartmentId] ON [Departments] ([ParentDepartmentId]);

CREATE INDEX [IX_Designations_DepartmentId] ON [Designations] ([DepartmentId]);

CREATE INDEX [IX_Designations_ReportsToDesignationId] ON [Designations] ([ReportsToDesignationId]);

CREATE INDEX [IX_Dishes_CategoryId] ON [Dishes] ([CategoryId]);

CREATE INDEX [IX_EmployeeAttendances_EmployeeId] ON [EmployeeAttendances] ([EmployeeId]);

CREATE INDEX [IX_EmployeeDocuments_EmployeeId] ON [EmployeeDocuments] ([EmployeeId]);

CREATE INDEX [IX_EmployeeLeave_EmployeeId] ON [EmployeeLeave] ([EmployeeId]);

CREATE INDEX [IX_EmployeePayments_EmployeeId] ON [EmployeePayments] ([EmployeeId]);

CREATE INDEX [IX_Employees_DepartmentId] ON [Employees] ([DepartmentId]);

CREATE INDEX [IX_Employees_DesignationId] ON [Employees] ([DesignationId]);

CREATE INDEX [IX_EventManagements_OrganizerGuestId] ON [EventManagements] ([OrganizerGuestId]);

CREATE INDEX [IX_Expenses_ExpenseTypeId] ON [Expenses] ([ExpenseTypeId]);

CREATE INDEX [IX_GuestAccounts_CheckInId] ON [GuestAccounts] ([CheckInId]);

CREATE INDEX [IX_GuestAccounts_GuestId] ON [GuestAccounts] ([GuestId]);

CREATE INDEX [IX_GuestCommunications_CampaignId] ON [GuestCommunications] ([CampaignId]);

CREATE INDEX [IX_GuestCommunications_CustomerId] ON [GuestCommunications] ([CustomerId]);

CREATE INDEX [IX_GuestDocuments_GuestId] ON [GuestDocuments] ([GuestId]);

CREATE INDEX [IX_GuestFeedbackServices_CheckInId] ON [GuestFeedbackServices] ([CheckInId]);

CREATE INDEX [IX_GuestFeedbackServices_GuestId] ON [GuestFeedbackServices] ([GuestId]);

CREATE INDEX [IX_GuestFolios_CheckInId] ON [GuestFolios] ([CheckInId]);

CREATE INDEX [IX_GuestHistories_GuestId] ON [GuestHistories] ([GuestId]);

CREATE INDEX [IX_GuestLedgers_GuestId] ON [GuestLedgers] ([GuestId]);

CREATE INDEX [IX_HousekeepingLaundries_GuestId] ON [HousekeepingLaundries] ([GuestId]);

CREATE INDEX [IX_HousekeepingLaundries_RoomId] ON [HousekeepingLaundries] ([RoomId]);

CREATE INDEX [IX_HousekeepingRoomStatuses_RoomId] ON [HousekeepingRoomStatuses] ([RoomId]);

CREATE INDEX [IX_InventoryCategories_ParentCategoryId] ON [InventoryCategories] ([ParentCategoryId]);

CREATE INDEX [IX_InventoryItems_CategoryId] ON [InventoryItems] ([CategoryId]);

CREATE INDEX [IX_InventoryItems_SupplierId] ON [InventoryItems] ([SupplierId]);

CREATE INDEX [IX_KitchenDisplays_OrderId] ON [KitchenDisplays] ([OrderId]);

CREATE INDEX [IX_KitchenDisplays_OrderItemId] ON [KitchenDisplays] ([OrderItemId]);

CREATE INDEX [IX_LeaveManagements_EmployeeId] ON [LeaveManagements] ([EmployeeId]);

CREATE INDEX [IX_LostAndFounds_RoomId] ON [LostAndFounds] ([RoomId]);

CREATE INDEX [IX_LoyaltyPrograms_CustomerId] ON [LoyaltyPrograms] ([CustomerId]);

CREATE INDEX [IX_MaintenanceRequests_RoomId] ON [MaintenanceRequests] ([RoomId]);

CREATE INDEX [IX_OrderItems_MenuItemId] ON [OrderItems] ([MenuItemId]);

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_Payments_CheckInId] ON [Payments] ([CheckInId]);

CREATE INDEX [IX_Payments_GuestId] ON [Payments] ([GuestId]);

CREATE INDEX [IX_PayrollAdvances_EmployeeId] ON [PayrollAdvances] ([EmployeeId]);

CREATE INDEX [IX_PerformanceReviews_EmployeeId] ON [PerformanceReviews] ([EmployeeId]);

CREATE INDEX [IX_PurchaseItems_ItemId] ON [PurchaseItems] ([ItemId]);

CREATE INDEX [IX_PurchaseItems_PurchaseId] ON [PurchaseItems] ([PurchaseId]);

CREATE INDEX [IX_PurchaseOrderItems_ItemId] ON [PurchaseOrderItems] ([ItemId]);

CREATE INDEX [IX_PurchaseOrderItems_PurchaseOrderId] ON [PurchaseOrderItems] ([PurchaseOrderId]);

CREATE INDEX [IX_PurchaseOrders_SupplierId] ON [PurchaseOrders] ([SupplierId]);

CREATE INDEX [IX_Purchases_SupplierId] ON [Purchases] ([SupplierId]);

CREATE INDEX [IX_ReservationDetails_ReservationId] ON [ReservationDetails] ([ReservationId]);

CREATE INDEX [IX_ReservationDetails_RoomId] ON [ReservationDetails] ([RoomId]);

CREATE INDEX [IX_ReservationMasters_GuestId] ON [ReservationMasters] ([GuestId]);

CREATE INDEX [IX_ReservationMasters_RoomId] ON [ReservationMasters] ([RoomId]);

CREATE INDEX [IX_ReservationMasters_RoomTypeId] ON [ReservationMasters] ([RoomTypeId]);

CREATE INDEX [IX_ReservationPayments_ReservationId] ON [ReservationPayments] ([ReservationId]);

CREATE INDEX [IX_Reservations_GuestId] ON [Reservations] ([GuestId]);

CREATE INDEX [IX_Reservations_RoomId] ON [Reservations] ([RoomId]);

CREATE INDEX [IX_RestaurantBillingInfos_OrderId] ON [RestaurantBillingInfos] ([OrderId]);

CREATE INDEX [IX_RestaurantOrderedProducts_DishId] ON [RestaurantOrderedProducts] ([DishId]);

CREATE INDEX [IX_RestaurantOrderedProducts_OrderId] ON [RestaurantOrderedProducts] ([OrderId]);

CREATE INDEX [IX_RestaurantOrders_ReservationId] ON [RestaurantOrders] ([ReservationId]);

CREATE INDEX [IX_RestaurantOrders_RoomId] ON [RestaurantOrders] ([RoomId]);

CREATE INDEX [IX_RestaurantOrders_TableId] ON [RestaurantOrders] ([TableId]);

CREATE INDEX [IX_ReviewsManagements_CustomerId] ON [ReviewsManagements] ([CustomerId]);

CREATE INDEX [IX_RoomAmenityMappings_AmenityId] ON [RoomAmenityMappings] ([AmenityId]);

CREATE INDEX [IX_RoomAmenityMappings_RoomId] ON [RoomAmenityMappings] ([RoomId]);

CREATE INDEX [IX_RoomImage_RoomId] ON [RoomImage] ([RoomId]);

CREATE INDEX [IX_RoomRates_RoomTypeId] ON [RoomRates] ([RoomTypeId]);

CREATE INDEX [IX_Rooms_PlanId] ON [Rooms] ([PlanId]);

CREATE INDEX [IX_Rooms_RoomTypeId] ON [Rooms] ([RoomTypeId]);

CREATE INDEX [IX_RoomServices_OrderId] ON [RoomServices] ([OrderId]);

CREATE INDEX [IX_RoomServices_RoomId] ON [RoomServices] ([RoomId]);

CREATE INDEX [IX_RoomStatusMasters_RoomId] ON [RoomStatusMasters] ([RoomId]);

CREATE INDEX [IX_RoomTransfers_CheckInId] ON [RoomTransfers] ([CheckInId]);

CREATE INDEX [IX_RoomTransfers_FromRoomId] ON [RoomTransfers] ([FromRoomId]);

CREATE INDEX [IX_RoomTransfers_ToRoomId] ON [RoomTransfers] ([ToRoomId]);

CREATE INDEX [IX_RoomTypeAmenityMappings_AmenityId] ON [RoomTypeAmenityMappings] ([AmenityId]);

CREATE INDEX [IX_RoomTypeAmenityMappings_RoomTypeId] ON [RoomTypeAmenityMappings] ([RoomTypeId]);

CREATE INDEX [IX_SpaWellnesses_GuestId] ON [SpaWellnesses] ([GuestId]);

CREATE INDEX [IX_StockAccountings_ItemId] ON [StockAccountings] ([ItemId]);

CREATE INDEX [IX_StockAlerts_ItemId] ON [StockAlerts] ([ItemId]);

CREATE INDEX [IX_StockManagements_ItemId] ON [StockManagements] ([ItemId]);

CREATE INDEX [IX_StockMovements_ItemId] ON [StockMovements] ([ItemId]);

CREATE INDEX [IX_SupplierLedgers_SupplierId] ON [SupplierLedgers] ([SupplierId]);

CREATE INDEX [IX_TourTravels_GuestId] ON [TourTravels] ([GuestId]);

CREATE INDEX [IX_Transportations_GuestId] ON [Transportations] ([GuestId]);

CREATE INDEX [IX_WalkInGuests_RoomId] ON [WalkInGuests] ([RoomId]);

CREATE INDEX [IX_WalkInGuests_RoomTypeId] ON [WalkInGuests] ([RoomTypeId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250928063740_InitialCreateWithNoCascade', N'9.0.9');

EXEC sp_rename N'[TableMasters].[Code]', N'TableCode', 'COLUMN';

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TaxMasters]') AND [c].[name] = N'TaxRate');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [TaxMasters] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [TaxMasters] ALTER COLUMN [TaxRate] decimal(5,2) NOT NULL;

ALTER TABLE [TableMasters] ADD [Features] nvarchar(200) NOT NULL DEFAULT N'';

ALTER TABLE [TableMasters] ADD [FloorNumber] int NOT NULL DEFAULT 0;

ALTER TABLE [TableMasters] ADD [HasView] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [TableMasters] ADD [MinOrderAmount] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [TableMasters] ADD [Shape] nvarchar(50) NOT NULL DEFAULT N'';

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'StockBalance');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [StockBalance] decimal(10,3) NOT NULL;

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'Quantity');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [Quantity] decimal(10,3) NOT NULL;

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'MinimumLevel');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [MinimumLevel] decimal(10,3) NOT NULL;

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'CurrentStock');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [CurrentStock] decimal(10,3) NOT NULL;

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'StockBalance');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [StockBalance] decimal(10,3) NOT NULL;

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'Quantity');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [Quantity] decimal(10,3) NOT NULL;

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'EngagementRate');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [EngagementRate] decimal(5,4) NOT NULL;

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomRates]') AND [c].[name] = N'TaxPercentage');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [RoomRates] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [RoomRates] ALTER COLUMN [TaxPercentage] decimal(5,2) NOT NULL;

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrderItems]') AND [c].[name] = N'ReceivedQuantity');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [PurchaseOrderItems] ALTER COLUMN [ReceivedQuantity] decimal(10,3) NOT NULL;

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrderItems]') AND [c].[name] = N'Quantity');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [PurchaseOrderItems] ALTER COLUMN [Quantity] decimal(10,3) NOT NULL;

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrderItems]') AND [c].[name] = N'PendingQuantity');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [PurchaseOrderItems] ALTER COLUMN [PendingQuantity] decimal(10,3) NOT NULL;

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseItems]') AND [c].[name] = N'ReceivedQuantity');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseItems] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [PurchaseItems] ALTER COLUMN [ReceivedQuantity] decimal(10,3) NULL;

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseItems]') AND [c].[name] = N'Quantity');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseItems] DROP CONSTRAINT [' + @var13 + '];');
ALTER TABLE [PurchaseItems] ALTER COLUMN [Quantity] decimal(10,3) NOT NULL;

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'ROI');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var14 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [ROI] decimal(8,4) NOT NULL;

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'ConversionRate');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var15 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [ConversionRate] decimal(5,4) NOT NULL;

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HousekeepingLaundries]') AND [c].[name] = N'TotalWeight');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [HousekeepingLaundries] DROP CONSTRAINT [' + @var16 + '];');
ALTER TABLE [HousekeepingLaundries] ALTER COLUMN [TotalWeight] decimal(10,2) NOT NULL;

DECLARE @var17 sysname;
SELECT @var17 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeAttendances]') AND [c].[name] = N'WorkingHours');
IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeAttendances] DROP CONSTRAINT [' + @var17 + '];');
ALTER TABLE [EmployeeAttendances] ALTER COLUMN [WorkingHours] decimal(8,2) NULL;

DECLARE @var18 sysname;
SELECT @var18 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeAttendances]') AND [c].[name] = N'OvertimeHours');
IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeAttendances] DROP CONSTRAINT [' + @var18 + '];');
ALTER TABLE [EmployeeAttendances] ALTER COLUMN [OvertimeHours] decimal(8,2) NULL;

DECLARE @var19 sysname;
SELECT @var19 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksQuantities]') AND [c].[name] = N'Volume');
IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [DrinksQuantities] DROP CONSTRAINT [' + @var19 + '];');
ALTER TABLE [DrinksQuantities] ALTER COLUMN [Volume] decimal(10,3) NOT NULL;

DECLARE @var20 sysname;
SELECT @var20 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'AlcoholContent');
IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var20 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [AlcoholContent] decimal(5,2) NOT NULL;

DECLARE @var21 sysname;
SELECT @var21 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Currencies]') AND [c].[name] = N'ExchangeRate');
IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [Currencies] DROP CONSTRAINT [' + @var21 + '];');
ALTER TABLE [Currencies] ALTER COLUMN [ExchangeRate] decimal(18,6) NOT NULL;

DECLARE @var22 sysname;
SELECT @var22 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'AlcoholContent');
IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var22 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [AlcoholContent] decimal(5,2) NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251002082314_FixDecimalPrecision', N'9.0.9');

ALTER TABLE [LostAndFounds] DROP CONSTRAINT [FK_LostAndFounds_Rooms_RoomId];

DECLARE @var23 sysname;
SELECT @var23 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'Status');
IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var23 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var24 sysname;
SELECT @var24 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'Remarks');
IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var24 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var25 sysname;
SELECT @var25 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'PhoneNumber');
IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var25 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var26 sysname;
SELECT @var26 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'IdType');
IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var26 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [IdType] nvarchar(50) NULL;

DECLARE @var27 sysname;
SELECT @var27 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'IdNumber');
IF @var27 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var27 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [IdNumber] nvarchar(50) NULL;

DECLARE @var28 sysname;
SELECT @var28 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'HandledBy');
IF @var28 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var28 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [HandledBy] nvarchar(100) NULL;

DECLARE @var29 sysname;
SELECT @var29 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalkInGuests]') AND [c].[name] = N'Email');
IF @var29 IS NOT NULL EXEC(N'ALTER TABLE [WalkInGuests] DROP CONSTRAINT [' + @var29 + '];');
ALTER TABLE [WalkInGuests] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var30 sysname;
SELECT @var30 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'VoucherType');
IF @var30 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var30 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [VoucherType] nvarchar(50) NULL;

DECLARE @var31 sysname;
SELECT @var31 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'Status');
IF @var31 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var31 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var32 sysname;
SELECT @var32 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'Remarks');
IF @var32 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var32 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var33 sysname;
SELECT @var33 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'PreparedBy');
IF @var33 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var33 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [PreparedBy] nvarchar(100) NULL;

DECLARE @var34 sysname;
SELECT @var34 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'Description');
IF @var34 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var34 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var35 sysname;
SELECT @var35 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vouchers]') AND [c].[name] = N'ApprovedBy');
IF @var35 IS NOT NULL EXEC(N'ALTER TABLE [Vouchers] DROP CONSTRAINT [' + @var35 + '];');
ALTER TABLE [Vouchers] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var36 sysname;
SELECT @var36 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrialBalances]') AND [c].[name] = N'Remarks');
IF @var36 IS NOT NULL EXEC(N'ALTER TABLE [TrialBalances] DROP CONSTRAINT [' + @var36 + '];');
ALTER TABLE [TrialBalances] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var37 sysname;
SELECT @var37 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrialBalances]') AND [c].[name] = N'PreparedBy');
IF @var37 IS NOT NULL EXEC(N'ALTER TABLE [TrialBalances] DROP CONSTRAINT [' + @var37 + '];');
ALTER TABLE [TrialBalances] ALTER COLUMN [PreparedBy] nvarchar(100) NULL;

DECLARE @var38 sysname;
SELECT @var38 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrialBalances]') AND [c].[name] = N'AccountType');
IF @var38 IS NOT NULL EXEC(N'ALTER TABLE [TrialBalances] DROP CONSTRAINT [' + @var38 + '];');
ALTER TABLE [TrialBalances] ALTER COLUMN [AccountType] nvarchar(50) NULL;

DECLARE @var39 sysname;
SELECT @var39 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'VehicleType');
IF @var39 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var39 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [VehicleType] nvarchar(50) NULL;

DECLARE @var40 sysname;
SELECT @var40 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'VehicleNumber');
IF @var40 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var40 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [VehicleNumber] nvarchar(50) NULL;

DECLARE @var41 sysname;
SELECT @var41 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'Status');
IF @var41 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var41 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var42 sysname;
SELECT @var42 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'SpecialInstructions');
IF @var42 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var42 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var43 sysname;
SELECT @var43 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'ServiceNotes');
IF @var43 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var43 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [ServiceNotes] nvarchar(500) NULL;

DECLARE @var44 sysname;
SELECT @var44 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'GuestFeedback');
IF @var44 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var44 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [GuestFeedback] nvarchar(500) NULL;

DECLARE @var45 sysname;
SELECT @var45 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'DriverPhone');
IF @var45 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var45 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [DriverPhone] nvarchar(20) NULL;

DECLARE @var46 sysname;
SELECT @var46 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transportations]') AND [c].[name] = N'DriverName');
IF @var46 IS NOT NULL EXEC(N'ALTER TABLE [Transportations] DROP CONSTRAINT [' + @var46 + '];');
ALTER TABLE [Transportations] ALTER COLUMN [DriverName] nvarchar(100) NULL;

DECLARE @var47 sysname;
SELECT @var47 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Venue');
IF @var47 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var47 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Venue] nvarchar(100) NULL;

DECLARE @var48 sysname;
SELECT @var48 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'TrainingType');
IF @var48 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var48 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [TrainingType] nvarchar(50) NULL;

DECLARE @var49 sysname;
SELECT @var49 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Trainer');
IF @var49 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var49 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Trainer] nvarchar(100) NULL;

DECLARE @var50 sysname;
SELECT @var50 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Status');
IF @var50 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var50 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var51 sysname;
SELECT @var51 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Prerequisites');
IF @var51 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var51 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Prerequisites] nvarchar(500) NULL;

DECLARE @var52 sysname;
SELECT @var52 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Objectives');
IF @var52 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var52 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Objectives] nvarchar(500) NULL;

DECLARE @var53 sysname;
SELECT @var53 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrainingPrograms]') AND [c].[name] = N'Description');
IF @var53 IS NOT NULL EXEC(N'ALTER TABLE [TrainingPrograms] DROP CONSTRAINT [' + @var53 + '];');
ALTER TABLE [TrainingPrograms] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var54 sysname;
SELECT @var54 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'TransportArrangement');
IF @var54 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var54 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [TransportArrangement] nvarchar(50) NULL;

DECLARE @var55 sysname;
SELECT @var55 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'TourType');
IF @var55 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var55 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [TourType] nvarchar(50) NULL;

DECLARE @var56 sysname;
SELECT @var56 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'TourGuide');
IF @var56 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var56 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [TourGuide] nvarchar(100) NULL;

DECLARE @var57 sysname;
SELECT @var57 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'TourDescription');
IF @var57 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var57 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [TourDescription] nvarchar(500) NULL;

DECLARE @var58 sysname;
SELECT @var58 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'Status');
IF @var58 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var58 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var59 sysname;
SELECT @var59 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'SpecialRequirements');
IF @var59 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var59 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [SpecialRequirements] nvarchar(500) NULL;

DECLARE @var60 sysname;
SELECT @var60 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'Inclusions');
IF @var60 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var60 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [Inclusions] nvarchar(500) NULL;

DECLARE @var61 sysname;
SELECT @var61 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'GuidePhone');
IF @var61 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var61 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [GuidePhone] nvarchar(20) NULL;

DECLARE @var62 sysname;
SELECT @var62 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'GuestFeedback');
IF @var62 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var62 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [GuestFeedback] nvarchar(500) NULL;

DECLARE @var63 sysname;
SELECT @var63 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TourTravels]') AND [c].[name] = N'Exclusions');
IF @var63 IS NOT NULL EXEC(N'ALTER TABLE [TourTravels] DROP CONSTRAINT [' + @var63 + '];');
ALTER TABLE [TourTravels] ALTER COLUMN [Exclusions] nvarchar(500) NULL;

DECLARE @var64 sysname;
SELECT @var64 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TaxMasters]') AND [c].[name] = N'TaxType');
IF @var64 IS NOT NULL EXEC(N'ALTER TABLE [TaxMasters] DROP CONSTRAINT [' + @var64 + '];');
ALTER TABLE [TaxMasters] ALTER COLUMN [TaxType] nvarchar(50) NULL;

DECLARE @var65 sysname;
SELECT @var65 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TaxMasters]') AND [c].[name] = N'Description');
IF @var65 IS NOT NULL EXEC(N'ALTER TABLE [TaxMasters] DROP CONSTRAINT [' + @var65 + '];');
ALTER TABLE [TaxMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var66 sysname;
SELECT @var66 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TaxMasters]') AND [c].[name] = N'ApplicableTo');
IF @var66 IS NOT NULL EXEC(N'ALTER TABLE [TaxMasters] DROP CONSTRAINT [' + @var66 + '];');
ALTER TABLE [TaxMasters] ALTER COLUMN [ApplicableTo] nvarchar(100) NULL;

DECLARE @var67 sysname;
SELECT @var67 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'TableType');
IF @var67 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var67 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [TableType] nvarchar(50) NULL;

DECLARE @var68 sysname;
SELECT @var68 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'Status');
IF @var68 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var68 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var69 sysname;
SELECT @var69 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'Shape');
IF @var69 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var69 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [Shape] nvarchar(50) NULL;

DECLARE @var70 sysname;
SELECT @var70 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'Location');
IF @var70 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var70 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var71 sysname;
SELECT @var71 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'Features');
IF @var71 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var71 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [Features] nvarchar(200) NULL;

DECLARE @var72 sysname;
SELECT @var72 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableMasters]') AND [c].[name] = N'Description');
IF @var72 IS NOT NULL EXEC(N'ALTER TABLE [TableMasters] DROP CONSTRAINT [' + @var72 + '];');
ALTER TABLE [TableMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var73 sysname;
SELECT @var73 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableManagements]') AND [c].[name] = N'TableType');
IF @var73 IS NOT NULL EXEC(N'ALTER TABLE [TableManagements] DROP CONSTRAINT [' + @var73 + '];');
ALTER TABLE [TableManagements] ALTER COLUMN [TableType] nvarchar(50) NULL;

DECLARE @var74 sysname;
SELECT @var74 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableManagements]') AND [c].[name] = N'Status');
IF @var74 IS NOT NULL EXEC(N'ALTER TABLE [TableManagements] DROP CONSTRAINT [' + @var74 + '];');
ALTER TABLE [TableManagements] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var75 sysname;
SELECT @var75 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableManagements]') AND [c].[name] = N'ReservedBy');
IF @var75 IS NOT NULL EXEC(N'ALTER TABLE [TableManagements] DROP CONSTRAINT [' + @var75 + '];');
ALTER TABLE [TableManagements] ALTER COLUMN [ReservedBy] nvarchar(100) NULL;

DECLARE @var76 sysname;
SELECT @var76 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableManagements]') AND [c].[name] = N'Location');
IF @var76 IS NOT NULL EXEC(N'ALTER TABLE [TableManagements] DROP CONSTRAINT [' + @var76 + '];');
ALTER TABLE [TableManagements] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var77 sysname;
SELECT @var77 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TableManagements]') AND [c].[name] = N'Description');
IF @var77 IS NOT NULL EXEC(N'ALTER TABLE [TableManagements] DROP CONSTRAINT [' + @var77 + '];');
ALTER TABLE [TableManagements] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var78 sysname;
SELECT @var78 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'UpdatedBy');
IF @var78 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var78 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var79 sysname;
SELECT @var79 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'TaxNumber');
IF @var79 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var79 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [TaxNumber] nvarchar(50) NULL;

DECLARE @var80 sysname;
SELECT @var80 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Phone');
IF @var80 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var80 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Phone] nvarchar(50) NULL;

DECLARE @var81 sysname;
SELECT @var81 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Notes');
IF @var81 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var81 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var82 sysname;
SELECT @var82 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Mobile');
IF @var82 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var82 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Mobile] nvarchar(50) NULL;

DECLARE @var83 sysname;
SELECT @var83 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Email');
IF @var83 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var83 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var84 sysname;
SELECT @var84 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'CreatedBy');
IF @var84 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var84 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var85 sysname;
SELECT @var85 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Country');
IF @var85 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var85 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var86 sysname;
SELECT @var86 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'ContactPerson');
IF @var86 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var86 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [ContactPerson] nvarchar(100) NULL;

DECLARE @var87 sysname;
SELECT @var87 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Code');
IF @var87 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var87 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Code] nvarchar(20) NULL;

DECLARE @var88 sysname;
SELECT @var88 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'City');
IF @var88 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var88 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var89 sysname;
SELECT @var89 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'Address');
IF @var89 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var89 + '];');
ALTER TABLE [Suppliers] ALTER COLUMN [Address] nvarchar(500) NULL;

DECLARE @var90 sysname;
SELECT @var90 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SupplierLedgers]') AND [c].[name] = N'TransactionType');
IF @var90 IS NOT NULL EXEC(N'ALTER TABLE [SupplierLedgers] DROP CONSTRAINT [' + @var90 + '];');
ALTER TABLE [SupplierLedgers] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var91 sysname;
SELECT @var91 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SupplierLedgers]') AND [c].[name] = N'Remarks');
IF @var91 IS NOT NULL EXEC(N'ALTER TABLE [SupplierLedgers] DROP CONSTRAINT [' + @var91 + '];');
ALTER TABLE [SupplierLedgers] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var92 sysname;
SELECT @var92 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SupplierLedgers]') AND [c].[name] = N'Reference');
IF @var92 IS NOT NULL EXEC(N'ALTER TABLE [SupplierLedgers] DROP CONSTRAINT [' + @var92 + '];');
ALTER TABLE [SupplierLedgers] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var93 sysname;
SELECT @var93 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SupplierLedgers]') AND [c].[name] = N'PostedBy');
IF @var93 IS NOT NULL EXEC(N'ALTER TABLE [SupplierLedgers] DROP CONSTRAINT [' + @var93 + '];');
ALTER TABLE [SupplierLedgers] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var94 sysname;
SELECT @var94 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SupplierLedgers]') AND [c].[name] = N'Description');
IF @var94 IS NOT NULL EXEC(N'ALTER TABLE [SupplierLedgers] DROP CONSTRAINT [' + @var94 + '];');
ALTER TABLE [SupplierLedgers] ALTER COLUMN [Description] nvarchar(100) NULL;

DECLARE @var95 sysname;
SELECT @var95 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'UpdatedBy');
IF @var95 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var95 + '];');
ALTER TABLE [StockMovements] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var96 sysname;
SELECT @var96 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'ReferenceType');
IF @var96 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var96 + '];');
ALTER TABLE [StockMovements] ALTER COLUMN [ReferenceType] nvarchar(100) NULL;

DECLARE @var97 sysname;
SELECT @var97 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'ReferenceId');
IF @var97 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var97 + '];');
ALTER TABLE [StockMovements] ALTER COLUMN [ReferenceId] nvarchar(100) NULL;

DECLARE @var98 sysname;
SELECT @var98 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'Notes');
IF @var98 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var98 + '];');
ALTER TABLE [StockMovements] ALTER COLUMN [Notes] nvarchar(1000) NULL;

DECLARE @var99 sysname;
SELECT @var99 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'CreatedBy');
IF @var99 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var99 + '];');
ALTER TABLE [StockMovements] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var100 sysname;
SELECT @var100 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'TransactionType');
IF @var100 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var100 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var101 sysname;
SELECT @var101 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'Remarks');
IF @var101 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var101 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var102 sysname;
SELECT @var102 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'Reference');
IF @var102 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var102 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var103 sysname;
SELECT @var103 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'PostedBy');
IF @var103 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var103 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var104 sysname;
SELECT @var104 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'IssuedTo');
IF @var104 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var104 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [IssuedTo] nvarchar(100) NULL;

DECLARE @var105 sysname;
SELECT @var105 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockManagements]') AND [c].[name] = N'Department');
IF @var105 IS NOT NULL EXEC(N'ALTER TABLE [StockManagements] DROP CONSTRAINT [' + @var105 + '];');
ALTER TABLE [StockManagements] ALTER COLUMN [Department] nvarchar(100) NULL;

DECLARE @var106 sysname;
SELECT @var106 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'Status');
IF @var106 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var106 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var107 sysname;
SELECT @var107 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'ResolvedBy');
IF @var107 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var107 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [ResolvedBy] nvarchar(100) NULL;

DECLARE @var108 sysname;
SELECT @var108 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'Remarks');
IF @var108 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var108 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var109 sysname;
SELECT @var109 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAlerts]') AND [c].[name] = N'AlertedTo');
IF @var109 IS NOT NULL EXEC(N'ALTER TABLE [StockAlerts] DROP CONSTRAINT [' + @var109 + '];');
ALTER TABLE [StockAlerts] ALTER COLUMN [AlertedTo] nvarchar(100) NULL;

DECLARE @var110 sysname;
SELECT @var110 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'TransactionType');
IF @var110 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var110 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var111 sysname;
SELECT @var111 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'Remarks');
IF @var111 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var111 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var112 sysname;
SELECT @var112 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'Reference');
IF @var112 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var112 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var113 sysname;
SELECT @var113 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockAccountings]') AND [c].[name] = N'PostedBy');
IF @var113 IS NOT NULL EXEC(N'ALTER TABLE [StockAccountings] DROP CONSTRAINT [' + @var113 + '];');
ALTER TABLE [StockAccountings] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var114 sysname;
SELECT @var114 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'TreatmentNotes');
IF @var114 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var114 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [TreatmentNotes] nvarchar(500) NULL;

DECLARE @var115 sysname;
SELECT @var115 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'Therapist');
IF @var115 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var115 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [Therapist] nvarchar(100) NULL;

DECLARE @var116 sysname;
SELECT @var116 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'Status');
IF @var116 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var116 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var117 sysname;
SELECT @var117 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'SpecialRequests');
IF @var117 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var117 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [SpecialRequests] nvarchar(500) NULL;

DECLARE @var118 sysname;
SELECT @var118 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'ServiceDescription');
IF @var118 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var118 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [ServiceDescription] nvarchar(500) NULL;

DECLARE @var119 sysname;
SELECT @var119 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'ServiceCategory');
IF @var119 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var119 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [ServiceCategory] nvarchar(50) NULL;

DECLARE @var120 sysname;
SELECT @var120 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'RoomFacility');
IF @var120 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var120 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [RoomFacility] nvarchar(50) NULL;

DECLARE @var121 sysname;
SELECT @var121 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SpaWellnesses]') AND [c].[name] = N'GuestFeedback');
IF @var121 IS NOT NULL EXEC(N'ALTER TABLE [SpaWellnesses] DROP CONSTRAINT [' + @var121 + '];');
ALTER TABLE [SpaWellnesses] ALTER COLUMN [GuestFeedback] nvarchar(500) NULL;

DECLARE @var122 sysname;
SELECT @var122 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'VideoPath');
IF @var122 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var122 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [VideoPath] nvarchar(200) NULL;

DECLARE @var123 sysname;
SELECT @var123 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'Status');
IF @var123 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var123 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var124 sysname;
SELECT @var124 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'PostType');
IF @var124 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var124 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [PostType] nvarchar(50) NULL;

DECLARE @var125 sysname;
SELECT @var125 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'Notes');
IF @var125 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var125 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var126 sysname;
SELECT @var126 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'ImagePath');
IF @var126 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var126 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var127 sysname;
SELECT @var127 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'Hashtags');
IF @var127 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var127 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [Hashtags] nvarchar(500) NULL;

DECLARE @var128 sysname;
SELECT @var128 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'CreatedBy');
IF @var128 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var128 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [CreatedBy] nvarchar(100) NULL;

DECLARE @var129 sysname;
SELECT @var129 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SocialMediaManagements]') AND [c].[name] = N'ApprovedBy');
IF @var129 IS NOT NULL EXEC(N'ALTER TABLE [SocialMediaManagements] DROP CONSTRAINT [' + @var129 + '];');
ALTER TABLE [SocialMediaManagements] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var130 sysname;
SELECT @var130 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'UpdatedBy');
IF @var130 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var130 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var131 sysname;
SELECT @var131 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'Region');
IF @var131 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var131 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [Region] nvarchar(100) NULL;

DECLARE @var132 sysname;
SELECT @var132 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'FromNumber');
IF @var132 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var132 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [FromNumber] nvarchar(20) NULL;

DECLARE @var133 sysname;
SELECT @var133 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'Description');
IF @var133 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var133 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [Description] nvarchar(1000) NULL;

DECLARE @var134 sysname;
SELECT @var134 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'CreatedBy');
IF @var134 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var134 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var135 sysname;
SELECT @var135 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'AuthToken');
IF @var135 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var135 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [AuthToken] nvarchar(255) NULL;

DECLARE @var136 sysname;
SELECT @var136 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'ApiUrl');
IF @var136 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var136 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [ApiUrl] nvarchar(100) NULL;

DECLARE @var137 sysname;
SELECT @var137 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'ApiSecret');
IF @var137 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var137 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [ApiSecret] nvarchar(255) NULL;

DECLARE @var138 sysname;
SELECT @var138 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SMSSettings]') AND [c].[name] = N'AccountSid');
IF @var138 IS NOT NULL EXEC(N'ALTER TABLE [SMSSettings] DROP CONSTRAINT [' + @var138 + '];');
ALTER TABLE [SMSSettings] ALTER COLUMN [AccountSid] nvarchar(50) NULL;

DECLARE @var139 sysname;
SELECT @var139 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypes]') AND [c].[name] = N'Description');
IF @var139 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypes] DROP CONSTRAINT [' + @var139 + '];');
ALTER TABLE [RoomTypes] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var140 sysname;
SELECT @var140 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypes]') AND [c].[name] = N'Code');
IF @var140 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypes] DROP CONSTRAINT [' + @var140 + '];');
ALTER TABLE [RoomTypes] ALTER COLUMN [Code] nvarchar(20) NULL;

DECLARE @var141 sysname;
SELECT @var141 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypes]') AND [c].[name] = N'Amenities');
IF @var141 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypes] DROP CONSTRAINT [' + @var141 + '];');
ALTER TABLE [RoomTypes] ALTER COLUMN [Amenities] nvarchar(200) NULL;

DECLARE @var142 sysname;
SELECT @var142 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeAmenityMappings]') AND [c].[name] = N'Notes');
IF @var142 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeAmenityMappings] DROP CONSTRAINT [' + @var142 + '];');
ALTER TABLE [RoomTypeAmenityMappings] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var143 sysname;
SELECT @var143 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTransfers]') AND [c].[name] = N'Status');
IF @var143 IS NOT NULL EXEC(N'ALTER TABLE [RoomTransfers] DROP CONSTRAINT [' + @var143 + '];');
ALTER TABLE [RoomTransfers] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var144 sysname;
SELECT @var144 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTransfers]') AND [c].[name] = N'Remarks');
IF @var144 IS NOT NULL EXEC(N'ALTER TABLE [RoomTransfers] DROP CONSTRAINT [' + @var144 + '];');
ALTER TABLE [RoomTransfers] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var145 sysname;
SELECT @var145 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTransfers]') AND [c].[name] = N'Reason');
IF @var145 IS NOT NULL EXEC(N'ALTER TABLE [RoomTransfers] DROP CONSTRAINT [' + @var145 + '];');
ALTER TABLE [RoomTransfers] ALTER COLUMN [Reason] nvarchar(500) NULL;

DECLARE @var146 sysname;
SELECT @var146 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTransfers]') AND [c].[name] = N'ProcessedBy');
IF @var146 IS NOT NULL EXEC(N'ALTER TABLE [RoomTransfers] DROP CONSTRAINT [' + @var146 + '];');
ALTER TABLE [RoomTransfers] ALTER COLUMN [ProcessedBy] nvarchar(100) NULL;

DECLARE @var147 sysname;
SELECT @var147 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTransfers]') AND [c].[name] = N'AuthorizedBy');
IF @var147 IS NOT NULL EXEC(N'ALTER TABLE [RoomTransfers] DROP CONSTRAINT [' + @var147 + '];');
ALTER TABLE [RoomTransfers] ALTER COLUMN [AuthorizedBy] nvarchar(100) NULL;

DECLARE @var148 sysname;
SELECT @var148 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomStatusMasters]') AND [c].[name] = N'UpdatedBy');
IF @var148 IS NOT NULL EXEC(N'ALTER TABLE [RoomStatusMasters] DROP CONSTRAINT [' + @var148 + '];');
ALTER TABLE [RoomStatusMasters] ALTER COLUMN [UpdatedBy] nvarchar(100) NULL;

DECLARE @var149 sysname;
SELECT @var149 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomStatusMasters]') AND [c].[name] = N'Remarks');
IF @var149 IS NOT NULL EXEC(N'ALTER TABLE [RoomStatusMasters] DROP CONSTRAINT [' + @var149 + '];');
ALTER TABLE [RoomStatusMasters] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var150 sysname;
SELECT @var150 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomStatusMasters]') AND [c].[name] = N'HousekeepingStatus');
IF @var150 IS NOT NULL EXEC(N'ALTER TABLE [RoomStatusMasters] DROP CONSTRAINT [' + @var150 + '];');
ALTER TABLE [RoomStatusMasters] ALTER COLUMN [HousekeepingStatus] nvarchar(50) NULL;

DECLARE @var151 sysname;
SELECT @var151 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomServices]') AND [c].[name] = N'Status');
IF @var151 IS NOT NULL EXEC(N'ALTER TABLE [RoomServices] DROP CONSTRAINT [' + @var151 + '];');
ALTER TABLE [RoomServices] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var152 sysname;
SELECT @var152 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomServices]') AND [c].[name] = N'SpecialInstructions');
IF @var152 IS NOT NULL EXEC(N'ALTER TABLE [RoomServices] DROP CONSTRAINT [' + @var152 + '];');
ALTER TABLE [RoomServices] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var153 sysname;
SELECT @var153 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomServices]') AND [c].[name] = N'Remarks');
IF @var153 IS NOT NULL EXEC(N'ALTER TABLE [RoomServices] DROP CONSTRAINT [' + @var153 + '];');
ALTER TABLE [RoomServices] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var154 sysname;
SELECT @var154 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomServices]') AND [c].[name] = N'Feedback');
IF @var154 IS NOT NULL EXEC(N'ALTER TABLE [RoomServices] DROP CONSTRAINT [' + @var154 + '];');
ALTER TABLE [RoomServices] ALTER COLUMN [Feedback] nvarchar(500) NULL;

DECLARE @var155 sysname;
SELECT @var155 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomServices]') AND [c].[name] = N'DeliveredBy');
IF @var155 IS NOT NULL EXEC(N'ALTER TABLE [RoomServices] DROP CONSTRAINT [' + @var155 + '];');
ALTER TABLE [RoomServices] ALTER COLUMN [DeliveredBy] nvarchar(100) NULL;

DECLARE @var156 sysname;
SELECT @var156 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Status');
IF @var156 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var156 + '];');
ALTER TABLE [Rooms] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var157 sysname;
SELECT @var157 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Features');
IF @var157 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var157 + '];');
ALTER TABLE [Rooms] ALTER COLUMN [Features] nvarchar(200) NULL;

DECLARE @var158 sysname;
SELECT @var158 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Description');
IF @var158 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var158 + '];');
ALTER TABLE [Rooms] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var159 sysname;
SELECT @var159 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomRates]') AND [c].[name] = N'Terms');
IF @var159 IS NOT NULL EXEC(N'ALTER TABLE [RoomRates] DROP CONSTRAINT [' + @var159 + '];');
ALTER TABLE [RoomRates] ALTER COLUMN [Terms] nvarchar(500) NULL;

DECLARE @var160 sysname;
SELECT @var160 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomRates]') AND [c].[name] = N'Season');
IF @var160 IS NOT NULL EXEC(N'ALTER TABLE [RoomRates] DROP CONSTRAINT [' + @var160 + '];');
ALTER TABLE [RoomRates] ALTER COLUMN [Season] nvarchar(50) NULL;

DECLARE @var161 sysname;
SELECT @var161 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomRates]') AND [c].[name] = N'Description');
IF @var161 IS NOT NULL EXEC(N'ALTER TABLE [RoomRates] DROP CONSTRAINT [' + @var161 + '];');
ALTER TABLE [RoomRates] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var162 sysname;
SELECT @var162 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomRates]') AND [c].[name] = N'Currency');
IF @var162 IS NOT NULL EXEC(N'ALTER TABLE [RoomRates] DROP CONSTRAINT [' + @var162 + '];');
ALTER TABLE [RoomRates] ALTER COLUMN [Currency] nvarchar(50) NULL;

DECLARE @var163 sysname;
SELECT @var163 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomMasters]') AND [c].[name] = N'Status');
IF @var163 IS NOT NULL EXEC(N'ALTER TABLE [RoomMasters] DROP CONSTRAINT [' + @var163 + '];');
ALTER TABLE [RoomMasters] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var164 sysname;
SELECT @var164 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomMasters]') AND [c].[name] = N'RoomType');
IF @var164 IS NOT NULL EXEC(N'ALTER TABLE [RoomMasters] DROP CONSTRAINT [' + @var164 + '];');
ALTER TABLE [RoomMasters] ALTER COLUMN [RoomType] nvarchar(50) NULL;

DECLARE @var165 sysname;
SELECT @var165 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomMasters]') AND [c].[name] = N'Description');
IF @var165 IS NOT NULL EXEC(N'ALTER TABLE [RoomMasters] DROP CONSTRAINT [' + @var165 + '];');
ALTER TABLE [RoomMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var166 sysname;
SELECT @var166 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomMasters]') AND [c].[name] = N'Amenities');
IF @var166 IS NOT NULL EXEC(N'ALTER TABLE [RoomMasters] DROP CONSTRAINT [' + @var166 + '];');
ALTER TABLE [RoomMasters] ALTER COLUMN [Amenities] nvarchar(500) NULL;

DECLARE @var167 sysname;
SELECT @var167 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomImage]') AND [c].[name] = N'ImageUrl');
IF @var167 IS NOT NULL EXEC(N'ALTER TABLE [RoomImage] DROP CONSTRAINT [' + @var167 + '];');
ALTER TABLE [RoomImage] ALTER COLUMN [ImageUrl] nvarchar(max) NULL;

DECLARE @var168 sysname;
SELECT @var168 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomImage]') AND [c].[name] = N'Caption');
IF @var168 IS NOT NULL EXEC(N'ALTER TABLE [RoomImage] DROP CONSTRAINT [' + @var168 + '];');
ALTER TABLE [RoomImage] ALTER COLUMN [Caption] nvarchar(max) NULL;

DECLARE @var169 sysname;
SELECT @var169 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenityMappings]') AND [c].[name] = N'Notes');
IF @var169 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenityMappings] DROP CONSTRAINT [' + @var169 + '];');
ALTER TABLE [RoomAmenityMappings] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var170 sysname;
SELECT @var170 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenities]') AND [c].[name] = N'Specifications');
IF @var170 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenities] DROP CONSTRAINT [' + @var170 + '];');
ALTER TABLE [RoomAmenities] ALTER COLUMN [Specifications] nvarchar(500) NULL;

DECLARE @var171 sysname;
SELECT @var171 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenities]') AND [c].[name] = N'ImagePath');
IF @var171 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenities] DROP CONSTRAINT [' + @var171 + '];');
ALTER TABLE [RoomAmenities] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var172 sysname;
SELECT @var172 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenities]') AND [c].[name] = N'Description');
IF @var172 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenities] DROP CONSTRAINT [' + @var172 + '];');
ALTER TABLE [RoomAmenities] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var173 sysname;
SELECT @var173 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenities]') AND [c].[name] = N'ChargeType');
IF @var173 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenities] DROP CONSTRAINT [' + @var173 + '];');
ALTER TABLE [RoomAmenities] ALTER COLUMN [ChargeType] nvarchar(50) NULL;

DECLARE @var174 sysname;
SELECT @var174 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomAmenities]') AND [c].[name] = N'Category');
IF @var174 IS NOT NULL EXEC(N'ALTER TABLE [RoomAmenities] DROP CONSTRAINT [' + @var174 + '];');
ALTER TABLE [RoomAmenities] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var175 sysname;
SELECT @var175 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'Status');
IF @var175 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var175 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var176 sysname;
SELECT @var176 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'ReviewType');
IF @var176 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var176 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [ReviewType] nvarchar(50) NULL;

DECLARE @var177 sysname;
SELECT @var177 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'ReviewTitle');
IF @var177 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var177 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [ReviewTitle] nvarchar(200) NULL;

DECLARE @var178 sysname;
SELECT @var178 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'RespondedBy');
IF @var178 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var178 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [RespondedBy] nvarchar(100) NULL;

DECLARE @var179 sysname;
SELECT @var179 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'ManagementResponse');
IF @var179 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var179 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [ManagementResponse] nvarchar(1000) NULL;

DECLARE @var180 sysname;
SELECT @var180 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'InternalNotes');
IF @var180 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var180 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [InternalNotes] nvarchar(500) NULL;

DECLARE @var181 sysname;
SELECT @var181 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReviewsManagements]') AND [c].[name] = N'ActionsTaken');
IF @var181 IS NOT NULL EXEC(N'ALTER TABLE [ReviewsManagements] DROP CONSTRAINT [' + @var181 + '];');
ALTER TABLE [ReviewsManagements] ALTER COLUMN [ActionsTaken] nvarchar(500) NULL;

DECLARE @var182 sysname;
SELECT @var182 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantTables]') AND [c].[name] = N'Status');
IF @var182 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantTables] DROP CONSTRAINT [' + @var182 + '];');
ALTER TABLE [RestaurantTables] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var183 sysname;
SELECT @var183 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantTables]') AND [c].[name] = N'Location');
IF @var183 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantTables] DROP CONSTRAINT [' + @var183 + '];');
ALTER TABLE [RestaurantTables] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var184 sysname;
SELECT @var184 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrders]') AND [c].[name] = N'Status');
IF @var184 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrders] DROP CONSTRAINT [' + @var184 + '];');
ALTER TABLE [RestaurantOrders] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var185 sysname;
SELECT @var185 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrders]') AND [c].[name] = N'SpecialInstructions');
IF @var185 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrders] DROP CONSTRAINT [' + @var185 + '];');
ALTER TABLE [RestaurantOrders] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var186 sysname;
SELECT @var186 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrders]') AND [c].[name] = N'PaymentStatus');
IF @var186 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrders] DROP CONSTRAINT [' + @var186 + '];');
ALTER TABLE [RestaurantOrders] ALTER COLUMN [PaymentStatus] nvarchar(50) NULL;

DECLARE @var187 sysname;
SELECT @var187 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrders]') AND [c].[name] = N'OrderType');
IF @var187 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrders] DROP CONSTRAINT [' + @var187 + '];');
ALTER TABLE [RestaurantOrders] ALTER COLUMN [OrderType] nvarchar(50) NULL;

DECLARE @var188 sysname;
SELECT @var188 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrders]') AND [c].[name] = N'OrderNumber');
IF @var188 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrders] DROP CONSTRAINT [' + @var188 + '];');
ALTER TABLE [RestaurantOrders] ALTER COLUMN [OrderNumber] nvarchar(50) NULL;

DECLARE @var189 sysname;
SELECT @var189 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrderedProducts]') AND [c].[name] = N'Status');
IF @var189 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrderedProducts] DROP CONSTRAINT [' + @var189 + '];');
ALTER TABLE [RestaurantOrderedProducts] ALTER COLUMN [Status] nvarchar(max) NULL;

DECLARE @var190 sysname;
SELECT @var190 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantOrderedProducts]') AND [c].[name] = N'SpecialInstructions');
IF @var190 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantOrderedProducts] DROP CONSTRAINT [' + @var190 + '];');
ALTER TABLE [RestaurantOrderedProducts] ALTER COLUMN [SpecialInstructions] nvarchar(max) NULL;

DECLARE @var191 sysname;
SELECT @var191 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantBillingInfos]') AND [c].[name] = N'TransactionId');
IF @var191 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantBillingInfos] DROP CONSTRAINT [' + @var191 + '];');
ALTER TABLE [RestaurantBillingInfos] ALTER COLUMN [TransactionId] nvarchar(max) NULL;

DECLARE @var192 sysname;
SELECT @var192 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantBillingInfos]') AND [c].[name] = N'Status');
IF @var192 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantBillingInfos] DROP CONSTRAINT [' + @var192 + '];');
ALTER TABLE [RestaurantBillingInfos] ALTER COLUMN [Status] nvarchar(max) NULL;

DECLARE @var193 sysname;
SELECT @var193 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantBillingInfos]') AND [c].[name] = N'PaymentMethod');
IF @var193 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantBillingInfos] DROP CONSTRAINT [' + @var193 + '];');
ALTER TABLE [RestaurantBillingInfos] ALTER COLUMN [PaymentMethod] nvarchar(max) NULL;

DECLARE @var194 sysname;
SELECT @var194 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantBillingInfos]') AND [c].[name] = N'Notes');
IF @var194 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantBillingInfos] DROP CONSTRAINT [' + @var194 + '];');
ALTER TABLE [RestaurantBillingInfos] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var195 sysname;
SELECT @var195 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestaurantBillingInfos]') AND [c].[name] = N'BillingNumber');
IF @var195 IS NOT NULL EXEC(N'ALTER TABLE [RestaurantBillingInfos] DROP CONSTRAINT [' + @var195 + '];');
ALTER TABLE [RestaurantBillingInfos] ALTER COLUMN [BillingNumber] nvarchar(max) NULL;

DECLARE @var196 sysname;
SELECT @var196 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Reservations]') AND [c].[name] = N'Status');
IF @var196 IS NOT NULL EXEC(N'ALTER TABLE [Reservations] DROP CONSTRAINT [' + @var196 + '];');
ALTER TABLE [Reservations] ALTER COLUMN [Status] nvarchar(20) NULL;

DECLARE @var197 sysname;
SELECT @var197 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Reservations]') AND [c].[name] = N'SpecialRequests');
IF @var197 IS NOT NULL EXEC(N'ALTER TABLE [Reservations] DROP CONSTRAINT [' + @var197 + '];');
ALTER TABLE [Reservations] ALTER COLUMN [SpecialRequests] nvarchar(500) NULL;

DECLARE @var198 sysname;
SELECT @var198 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Reservations]') AND [c].[name] = N'PaymentStatus');
IF @var198 IS NOT NULL EXEC(N'ALTER TABLE [Reservations] DROP CONSTRAINT [' + @var198 + '];');
ALTER TABLE [Reservations] ALTER COLUMN [PaymentStatus] nvarchar(max) NULL;

DECLARE @var199 sysname;
SELECT @var199 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationPayments]') AND [c].[name] = N'TransactionId');
IF @var199 IS NOT NULL EXEC(N'ALTER TABLE [ReservationPayments] DROP CONSTRAINT [' + @var199 + '];');
ALTER TABLE [ReservationPayments] ALTER COLUMN [TransactionId] nvarchar(max) NULL;

DECLARE @var200 sysname;
SELECT @var200 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationPayments]') AND [c].[name] = N'PaymentStatus');
IF @var200 IS NOT NULL EXEC(N'ALTER TABLE [ReservationPayments] DROP CONSTRAINT [' + @var200 + '];');
ALTER TABLE [ReservationPayments] ALTER COLUMN [PaymentStatus] nvarchar(max) NULL;

DECLARE @var201 sysname;
SELECT @var201 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationPayments]') AND [c].[name] = N'PaymentMethod');
IF @var201 IS NOT NULL EXEC(N'ALTER TABLE [ReservationPayments] DROP CONSTRAINT [' + @var201 + '];');
ALTER TABLE [ReservationPayments] ALTER COLUMN [PaymentMethod] nvarchar(max) NULL;

DECLARE @var202 sysname;
SELECT @var202 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationPayments]') AND [c].[name] = N'Notes');
IF @var202 IS NOT NULL EXEC(N'ALTER TABLE [ReservationPayments] DROP CONSTRAINT [' + @var202 + '];');
ALTER TABLE [ReservationPayments] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var203 sysname;
SELECT @var203 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationMasters]') AND [c].[name] = N'Status');
IF @var203 IS NOT NULL EXEC(N'ALTER TABLE [ReservationMasters] DROP CONSTRAINT [' + @var203 + '];');
ALTER TABLE [ReservationMasters] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var204 sysname;
SELECT @var204 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationMasters]') AND [c].[name] = N'SpecialRequests');
IF @var204 IS NOT NULL EXEC(N'ALTER TABLE [ReservationMasters] DROP CONSTRAINT [' + @var204 + '];');
ALTER TABLE [ReservationMasters] ALTER COLUMN [SpecialRequests] nvarchar(500) NULL;

DECLARE @var205 sysname;
SELECT @var205 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationMasters]') AND [c].[name] = N'CancellationReason');
IF @var205 IS NOT NULL EXEC(N'ALTER TABLE [ReservationMasters] DROP CONSTRAINT [' + @var205 + '];');
ALTER TABLE [ReservationMasters] ALTER COLUMN [CancellationReason] nvarchar(500) NULL;

DECLARE @var206 sysname;
SELECT @var206 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationMasters]') AND [c].[name] = N'BookingSource');
IF @var206 IS NOT NULL EXEC(N'ALTER TABLE [ReservationMasters] DROP CONSTRAINT [' + @var206 + '];');
ALTER TABLE [ReservationMasters] ALTER COLUMN [BookingSource] nvarchar(50) NULL;

DECLARE @var207 sysname;
SELECT @var207 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationMasters]') AND [c].[name] = N'BookedBy');
IF @var207 IS NOT NULL EXEC(N'ALTER TABLE [ReservationMasters] DROP CONSTRAINT [' + @var207 + '];');
ALTER TABLE [ReservationMasters] ALTER COLUMN [BookedBy] nvarchar(100) NULL;

DECLARE @var208 sysname;
SELECT @var208 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReservationDetails]') AND [c].[name] = N'SpecialRequest');
IF @var208 IS NOT NULL EXEC(N'ALTER TABLE [ReservationDetails] DROP CONSTRAINT [' + @var208 + '];');
ALTER TABLE [ReservationDetails] ALTER COLUMN [SpecialRequest] nvarchar(max) NULL;

DECLARE @var209 sysname;
SELECT @var209 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Purchases]') AND [c].[name] = N'Status');
IF @var209 IS NOT NULL EXEC(N'ALTER TABLE [Purchases] DROP CONSTRAINT [' + @var209 + '];');
ALTER TABLE [Purchases] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var210 sysname;
SELECT @var210 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Purchases]') AND [c].[name] = N'Reference');
IF @var210 IS NOT NULL EXEC(N'ALTER TABLE [Purchases] DROP CONSTRAINT [' + @var210 + '];');
ALTER TABLE [Purchases] ALTER COLUMN [Reference] nvarchar(100) NULL;

DECLARE @var211 sysname;
SELECT @var211 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Purchases]') AND [c].[name] = N'Notes');
IF @var211 IS NOT NULL EXEC(N'ALTER TABLE [Purchases] DROP CONSTRAINT [' + @var211 + '];');
ALTER TABLE [Purchases] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var212 sysname;
SELECT @var212 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'Terms');
IF @var212 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var212 + '];');
ALTER TABLE [PurchaseOrders] ALTER COLUMN [Terms] nvarchar(500) NULL;

DECLARE @var213 sysname;
SELECT @var213 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'Status');
IF @var213 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var213 + '];');
ALTER TABLE [PurchaseOrders] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var214 sysname;
SELECT @var214 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'Remarks');
IF @var214 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var214 + '];');
ALTER TABLE [PurchaseOrders] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var215 sysname;
SELECT @var215 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'OrderedBy');
IF @var215 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var215 + '];');
ALTER TABLE [PurchaseOrders] ALTER COLUMN [OrderedBy] nvarchar(100) NULL;

DECLARE @var216 sysname;
SELECT @var216 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'ApprovedBy');
IF @var216 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var216 + '];');
ALTER TABLE [PurchaseOrders] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var217 sysname;
SELECT @var217 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrderItems]') AND [c].[name] = N'Specifications');
IF @var217 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [' + @var217 + '];');
ALTER TABLE [PurchaseOrderItems] ALTER COLUMN [Specifications] nvarchar(500) NULL;

DECLARE @var218 sysname;
SELECT @var218 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrderItems]') AND [c].[name] = N'Remarks');
IF @var218 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [' + @var218 + '];');
ALTER TABLE [PurchaseOrderItems] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var219 sysname;
SELECT @var219 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseItems]') AND [c].[name] = N'Notes');
IF @var219 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseItems] DROP CONSTRAINT [' + @var219 + '];');
ALTER TABLE [PurchaseItems] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var220 sysname;
SELECT @var220 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Plans]') AND [c].[name] = N'TermsAndConditions');
IF @var220 IS NOT NULL EXEC(N'ALTER TABLE [Plans] DROP CONSTRAINT [' + @var220 + '];');
ALTER TABLE [Plans] ALTER COLUMN [TermsAndConditions] nvarchar(500) NULL;

DECLARE @var221 sysname;
SELECT @var221 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Plans]') AND [c].[name] = N'Description');
IF @var221 IS NOT NULL EXEC(N'ALTER TABLE [Plans] DROP CONSTRAINT [' + @var221 + '];');
ALTER TABLE [Plans] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var222 sysname;
SELECT @var222 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Plans]') AND [c].[name] = N'Code');
IF @var222 IS NOT NULL EXEC(N'ALTER TABLE [Plans] DROP CONSTRAINT [' + @var222 + '];');
ALTER TABLE [Plans] ALTER COLUMN [Code] nvarchar(20) NULL;

DECLARE @var223 sysname;
SELECT @var223 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PerformanceReviews]') AND [c].[name] = N'Strengths');
IF @var223 IS NOT NULL EXEC(N'ALTER TABLE [PerformanceReviews] DROP CONSTRAINT [' + @var223 + '];');
ALTER TABLE [PerformanceReviews] ALTER COLUMN [Strengths] nvarchar(500) NULL;

DECLARE @var224 sysname;
SELECT @var224 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PerformanceReviews]') AND [c].[name] = N'ReviewedBy');
IF @var224 IS NOT NULL EXEC(N'ALTER TABLE [PerformanceReviews] DROP CONSTRAINT [' + @var224 + '];');
ALTER TABLE [PerformanceReviews] ALTER COLUMN [ReviewedBy] nvarchar(100) NULL;

DECLARE @var225 sysname;
SELECT @var225 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PerformanceReviews]') AND [c].[name] = N'Goals');
IF @var225 IS NOT NULL EXEC(N'ALTER TABLE [PerformanceReviews] DROP CONSTRAINT [' + @var225 + '];');
ALTER TABLE [PerformanceReviews] ALTER COLUMN [Goals] nvarchar(500) NULL;

DECLARE @var226 sysname;
SELECT @var226 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PerformanceReviews]') AND [c].[name] = N'EmployeeComments');
IF @var226 IS NOT NULL EXEC(N'ALTER TABLE [PerformanceReviews] DROP CONSTRAINT [' + @var226 + '];');
ALTER TABLE [PerformanceReviews] ALTER COLUMN [EmployeeComments] nvarchar(500) NULL;

DECLARE @var227 sysname;
SELECT @var227 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PerformanceReviews]') AND [c].[name] = N'AreasForImprovement');
IF @var227 IS NOT NULL EXEC(N'ALTER TABLE [PerformanceReviews] DROP CONSTRAINT [' + @var227 + '];');
ALTER TABLE [PerformanceReviews] ALTER COLUMN [AreasForImprovement] nvarchar(500) NULL;

DECLARE @var228 sysname;
SELECT @var228 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollAdvances]') AND [c].[name] = N'Status');
IF @var228 IS NOT NULL EXEC(N'ALTER TABLE [PayrollAdvances] DROP CONSTRAINT [' + @var228 + '];');
ALTER TABLE [PayrollAdvances] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var229 sysname;
SELECT @var229 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollAdvances]') AND [c].[name] = N'Remarks');
IF @var229 IS NOT NULL EXEC(N'ALTER TABLE [PayrollAdvances] DROP CONSTRAINT [' + @var229 + '];');
ALTER TABLE [PayrollAdvances] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var230 sysname;
SELECT @var230 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollAdvances]') AND [c].[name] = N'Purpose');
IF @var230 IS NOT NULL EXEC(N'ALTER TABLE [PayrollAdvances] DROP CONSTRAINT [' + @var230 + '];');
ALTER TABLE [PayrollAdvances] ALTER COLUMN [Purpose] nvarchar(500) NULL;

DECLARE @var231 sysname;
SELECT @var231 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollAdvances]') AND [c].[name] = N'ApprovedBy');
IF @var231 IS NOT NULL EXEC(N'ALTER TABLE [PayrollAdvances] DROP CONSTRAINT [' + @var231 + '];');
ALTER TABLE [PayrollAdvances] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var232 sysname;
SELECT @var232 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'Status');
IF @var232 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var232 + '];');
ALTER TABLE [Payments] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var233 sysname;
SELECT @var233 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'Remarks');
IF @var233 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var233 + '];');
ALTER TABLE [Payments] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var234 sysname;
SELECT @var234 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'Reference');
IF @var234 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var234 + '];');
ALTER TABLE [Payments] ALTER COLUMN [Reference] nvarchar(100) NULL;

DECLARE @var235 sysname;
SELECT @var235 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'ReceivedBy');
IF @var235 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var235 + '];');
ALTER TABLE [Payments] ALTER COLUMN [ReceivedBy] nvarchar(100) NULL;

DECLARE @var236 sysname;
SELECT @var236 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'PaymentType');
IF @var236 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var236 + '];');
ALTER TABLE [Payments] ALTER COLUMN [PaymentType] nvarchar(50) NULL;

DECLARE @var237 sysname;
SELECT @var237 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'PaymentMethod');
IF @var237 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var237 + '];');
ALTER TABLE [Payments] ALTER COLUMN [PaymentMethod] nvarchar(50) NULL;

DECLARE @var238 sysname;
SELECT @var238 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'ChequeNumber');
IF @var238 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var238 + '];');
ALTER TABLE [Payments] ALTER COLUMN [ChequeNumber] nvarchar(50) NULL;

DECLARE @var239 sysname;
SELECT @var239 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'CardNumber');
IF @var239 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var239 + '];');
ALTER TABLE [Payments] ALTER COLUMN [CardNumber] nvarchar(50) NULL;

DECLARE @var240 sysname;
SELECT @var240 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'BankName');
IF @var240 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var240 + '];');
ALTER TABLE [Payments] ALTER COLUMN [BankName] nvarchar(100) NULL;

DECLARE @var241 sysname;
SELECT @var241 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OtherCharges]') AND [c].[name] = N'Description');
IF @var241 IS NOT NULL EXEC(N'ALTER TABLE [OtherCharges] DROP CONSTRAINT [' + @var241 + '];');
ALTER TABLE [OtherCharges] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var242 sysname;
SELECT @var242 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OtherCharges]') AND [c].[name] = N'ChargeType');
IF @var242 IS NOT NULL EXEC(N'ALTER TABLE [OtherCharges] DROP CONSTRAINT [' + @var242 + '];');
ALTER TABLE [OtherCharges] ALTER COLUMN [ChargeType] nvarchar(50) NULL;

DECLARE @var243 sysname;
SELECT @var243 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OtherCharges]') AND [c].[name] = N'ApplicableTo');
IF @var243 IS NOT NULL EXEC(N'ALTER TABLE [OtherCharges] DROP CONSTRAINT [' + @var243 + '];');
ALTER TABLE [OtherCharges] ALTER COLUMN [ApplicableTo] nvarchar(50) NULL;

DECLARE @var244 sysname;
SELECT @var244 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OrderItems]') AND [c].[name] = N'Status');
IF @var244 IS NOT NULL EXEC(N'ALTER TABLE [OrderItems] DROP CONSTRAINT [' + @var244 + '];');
ALTER TABLE [OrderItems] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var245 sysname;
SELECT @var245 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OrderItems]') AND [c].[name] = N'SpecialInstructions');
IF @var245 IS NOT NULL EXEC(N'ALTER TABLE [OrderItems] DROP CONSTRAINT [' + @var245 + '];');
ALTER TABLE [OrderItems] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var246 sysname;
SELECT @var246 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'MenuType');
IF @var246 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var246 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [MenuType] nvarchar(50) NULL;

DECLARE @var247 sysname;
SELECT @var247 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'Ingredients');
IF @var247 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var247 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [Ingredients] nvarchar(500) NULL;

DECLARE @var248 sysname;
SELECT @var248 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'ImagePath');
IF @var248 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var248 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var249 sysname;
SELECT @var249 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'Description');
IF @var249 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var249 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var250 sysname;
SELECT @var250 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'Cuisine');
IF @var250 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var250 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [Cuisine] nvarchar(50) NULL;

DECLARE @var251 sysname;
SELECT @var251 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'ChefSpecial');
IF @var251 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var251 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [ChefSpecial] nvarchar(100) NULL;

DECLARE @var252 sysname;
SELECT @var252 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuManagements]') AND [c].[name] = N'Category');
IF @var252 IS NOT NULL EXEC(N'ALTER TABLE [MenuManagements] DROP CONSTRAINT [' + @var252 + '];');
ALTER TABLE [MenuManagements] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var253 sysname;
SELECT @var253 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuItemMasters]') AND [c].[name] = N'Ingredients');
IF @var253 IS NOT NULL EXEC(N'ALTER TABLE [MenuItemMasters] DROP CONSTRAINT [' + @var253 + '];');
ALTER TABLE [MenuItemMasters] ALTER COLUMN [Ingredients] nvarchar(500) NULL;

DECLARE @var254 sysname;
SELECT @var254 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuItemMasters]') AND [c].[name] = N'ImagePath');
IF @var254 IS NOT NULL EXEC(N'ALTER TABLE [MenuItemMasters] DROP CONSTRAINT [' + @var254 + '];');
ALTER TABLE [MenuItemMasters] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var255 sysname;
SELECT @var255 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuItemMasters]') AND [c].[name] = N'Description');
IF @var255 IS NOT NULL EXEC(N'ALTER TABLE [MenuItemMasters] DROP CONSTRAINT [' + @var255 + '];');
ALTER TABLE [MenuItemMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var256 sysname;
SELECT @var256 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuItemMasters]') AND [c].[name] = N'Cuisine');
IF @var256 IS NOT NULL EXEC(N'ALTER TABLE [MenuItemMasters] DROP CONSTRAINT [' + @var256 + '];');
ALTER TABLE [MenuItemMasters] ALTER COLUMN [Cuisine] nvarchar(50) NULL;

DECLARE @var257 sysname;
SELECT @var257 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MenuItemMasters]') AND [c].[name] = N'Category');
IF @var257 IS NOT NULL EXEC(N'ALTER TABLE [MenuItemMasters] DROP CONSTRAINT [' + @var257 + '];');
ALTER TABLE [MenuItemMasters] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var258 sysname;
SELECT @var258 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'TargetAudience');
IF @var258 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var258 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [TargetAudience] nvarchar(100) NULL;

DECLARE @var259 sysname;
SELECT @var259 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'Status');
IF @var259 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var259 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var260 sysname;
SELECT @var260 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'Results');
IF @var260 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var260 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [Results] nvarchar(500) NULL;

DECLARE @var261 sysname;
SELECT @var261 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'Objectives');
IF @var261 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var261 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [Objectives] nvarchar(500) NULL;

DECLARE @var262 sysname;
SELECT @var262 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'Notes');
IF @var262 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var262 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var263 sysname;
SELECT @var263 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'Description');
IF @var263 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var263 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var264 sysname;
SELECT @var264 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'CampaignType');
IF @var264 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var264 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [CampaignType] nvarchar(50) NULL;

DECLARE @var265 sysname;
SELECT @var265 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarketingCampaigns]') AND [c].[name] = N'CampaignManager');
IF @var265 IS NOT NULL EXEC(N'ALTER TABLE [MarketingCampaigns] DROP CONSTRAINT [' + @var265 + '];');
ALTER TABLE [MarketingCampaigns] ALTER COLUMN [CampaignManager] nvarchar(100) NULL;

DECLARE @var266 sysname;
SELECT @var266 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'WorkPerformed');
IF @var266 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var266 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [WorkPerformed] nvarchar(500) NULL;

DECLARE @var267 sysname;
SELECT @var267 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'UpdatedAt');
IF @var267 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var267 + '];');
UPDATE [MaintenanceRequests] SET [UpdatedAt] = '0001-01-01T00:00:00.0000000' WHERE [UpdatedAt] IS NULL;
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [UpdatedAt] datetime2 NOT NULL;
ALTER TABLE [MaintenanceRequests] ADD DEFAULT '0001-01-01T00:00:00.0000000' FOR [UpdatedAt];

DECLARE @var268 sysname;
SELECT @var268 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'ReportedBy');
IF @var268 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var268 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [ReportedBy] nvarchar(100) NULL;

DECLARE @var269 sysname;
SELECT @var269 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'Priority');
IF @var269 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var269 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [Priority] nvarchar(20) NOT NULL;

DECLARE @var270 sysname;
SELECT @var270 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'PartsUsed');
IF @var270 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var270 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [PartsUsed] nvarchar(200) NULL;

DECLARE @var271 sysname;
SELECT @var271 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'IssueType');
IF @var271 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var271 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [IssueType] nvarchar(50) NOT NULL;

DECLARE @var272 sysname;
SELECT @var272 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'EstimatedCost');
IF @var272 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var272 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [EstimatedCost] decimal(10,2) NULL;

DECLARE @var273 sysname;
SELECT @var273 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'CompletionNotes');
IF @var273 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var273 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [CompletionNotes] nvarchar(500) NULL;

DECLARE @var274 sysname;
SELECT @var274 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'AssignedTo');
IF @var274 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var274 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [AssignedTo] nvarchar(100) NULL;

DECLARE @var275 sysname;
SELECT @var275 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MaintenanceRequests]') AND [c].[name] = N'ActualCost');
IF @var275 IS NOT NULL EXEC(N'ALTER TABLE [MaintenanceRequests] DROP CONSTRAINT [' + @var275 + '];');
ALTER TABLE [MaintenanceRequests] ALTER COLUMN [ActualCost] decimal(10,2) NULL;

DECLARE @var276 sysname;
SELECT @var276 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LoyaltyPrograms]') AND [c].[name] = N'Status');
IF @var276 IS NOT NULL EXEC(N'ALTER TABLE [LoyaltyPrograms] DROP CONSTRAINT [' + @var276 + '];');
ALTER TABLE [LoyaltyPrograms] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var277 sysname;
SELECT @var277 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LoyaltyPrograms]') AND [c].[name] = N'SpecialOffers');
IF @var277 IS NOT NULL EXEC(N'ALTER TABLE [LoyaltyPrograms] DROP CONSTRAINT [' + @var277 + '];');
ALTER TABLE [LoyaltyPrograms] ALTER COLUMN [SpecialOffers] nvarchar(500) NULL;

DECLARE @var278 sysname;
SELECT @var278 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LoyaltyPrograms]') AND [c].[name] = N'Notes');
IF @var278 IS NOT NULL EXEC(N'ALTER TABLE [LoyaltyPrograms] DROP CONSTRAINT [' + @var278 + '];');
ALTER TABLE [LoyaltyPrograms] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var279 sysname;
SELECT @var279 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LoyaltyPrograms]') AND [c].[name] = N'Benefits');
IF @var279 IS NOT NULL EXEC(N'ALTER TABLE [LoyaltyPrograms] DROP CONSTRAINT [' + @var279 + '];');
ALTER TABLE [LoyaltyPrograms] ALTER COLUMN [Benefits] nvarchar(500) NULL;

DECLARE @var280 sysname;
SELECT @var280 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'Status');
IF @var280 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var280 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [Status] nvarchar(50) NULL;

DROP INDEX [IX_LostAndFounds_RoomId] ON [LostAndFounds];
DECLARE @var281 sysname;
SELECT @var281 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'RoomId');
IF @var281 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var281 + '];');
UPDATE [LostAndFounds] SET [RoomId] = 0 WHERE [RoomId] IS NULL;
ALTER TABLE [LostAndFounds] ALTER COLUMN [RoomId] int NOT NULL;
ALTER TABLE [LostAndFounds] ADD DEFAULT 0 FOR [RoomId];
CREATE INDEX [IX_LostAndFounds_RoomId] ON [LostAndFounds] ([RoomId]);

DECLARE @var282 sysname;
SELECT @var282 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'Remarks');
IF @var282 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var282 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var283 sysname;
SELECT @var283 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'LocationFound');
IF @var283 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var283 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [LocationFound] nvarchar(100) NULL;

DECLARE @var284 sysname;
SELECT @var284 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'ItemNumber');
IF @var284 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var284 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [ItemNumber] nvarchar(50) NULL;

DECLARE @var285 sysname;
SELECT @var285 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'ItemDescription');
IF @var285 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var285 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [ItemDescription] nvarchar(100) NULL;

DECLARE @var286 sysname;
SELECT @var286 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'IsActive');
IF @var286 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var286 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [IsActive] bit NULL;

DECLARE @var287 sysname;
SELECT @var287 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'ImagePath');
IF @var287 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var287 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var288 sysname;
SELECT @var288 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'GuestPhone');
IF @var288 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var288 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [GuestPhone] nvarchar(20) NULL;

DECLARE @var289 sysname;
SELECT @var289 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'GuestName');
IF @var289 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var289 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [GuestName] nvarchar(100) NULL;

DECLARE @var290 sysname;
SELECT @var290 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'GuestEmail');
IF @var290 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var290 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [GuestEmail] nvarchar(100) NULL;

DECLARE @var291 sysname;
SELECT @var291 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'FoundBy');
IF @var291 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var291 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [FoundBy] nvarchar(100) NULL;

DECLARE @var292 sysname;
SELECT @var292 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'DateFound');
IF @var292 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var292 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [DateFound] datetime2 NULL;

DECLARE @var293 sysname;
SELECT @var293 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'CreatedAt');
IF @var293 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var293 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [CreatedAt] datetime2 NULL;

DECLARE @var294 sysname;
SELECT @var294 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'ClaimedBy');
IF @var294 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var294 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [ClaimedBy] nvarchar(100) NULL;

DECLARE @var295 sysname;
SELECT @var295 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LostAndFounds]') AND [c].[name] = N'Category');
IF @var295 IS NOT NULL EXEC(N'ALTER TABLE [LostAndFounds] DROP CONSTRAINT [' + @var295 + '];');
ALTER TABLE [LostAndFounds] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var296 sysname;
SELECT @var296 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveManagements]') AND [c].[name] = N'Status');
IF @var296 IS NOT NULL EXEC(N'ALTER TABLE [LeaveManagements] DROP CONSTRAINT [' + @var296 + '];');
ALTER TABLE [LeaveManagements] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var297 sysname;
SELECT @var297 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveManagements]') AND [c].[name] = N'Reason');
IF @var297 IS NOT NULL EXEC(N'ALTER TABLE [LeaveManagements] DROP CONSTRAINT [' + @var297 + '];');
ALTER TABLE [LeaveManagements] ALTER COLUMN [Reason] nvarchar(500) NULL;

DECLARE @var298 sysname;
SELECT @var298 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveManagements]') AND [c].[name] = N'ApprovedBy');
IF @var298 IS NOT NULL EXEC(N'ALTER TABLE [LeaveManagements] DROP CONSTRAINT [' + @var298 + '];');
ALTER TABLE [LeaveManagements] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var299 sysname;
SELECT @var299 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveManagements]') AND [c].[name] = N'ApprovalRemarks');
IF @var299 IS NOT NULL EXEC(N'ALTER TABLE [LeaveManagements] DROP CONSTRAINT [' + @var299 + '];');
ALTER TABLE [LeaveManagements] ALTER COLUMN [ApprovalRemarks] nvarchar(500) NULL;

DECLARE @var300 sysname;
SELECT @var300 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LaundryMasters]') AND [c].[name] = N'Unit');
IF @var300 IS NOT NULL EXEC(N'ALTER TABLE [LaundryMasters] DROP CONSTRAINT [' + @var300 + '];');
ALTER TABLE [LaundryMasters] ALTER COLUMN [Unit] nvarchar(50) NULL;

DECLARE @var301 sysname;
SELECT @var301 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LaundryMasters]') AND [c].[name] = N'ServiceType');
IF @var301 IS NOT NULL EXEC(N'ALTER TABLE [LaundryMasters] DROP CONSTRAINT [' + @var301 + '];');
ALTER TABLE [LaundryMasters] ALTER COLUMN [ServiceType] nvarchar(50) NULL;

DECLARE @var302 sysname;
SELECT @var302 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LaundryMasters]') AND [c].[name] = N'Description');
IF @var302 IS NOT NULL EXEC(N'ALTER TABLE [LaundryMasters] DROP CONSTRAINT [' + @var302 + '];');
ALTER TABLE [LaundryMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var303 sysname;
SELECT @var303 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenSections]') AND [c].[name] = N'Specialties');
IF @var303 IS NOT NULL EXEC(N'ALTER TABLE [KitchenSections] DROP CONSTRAINT [' + @var303 + '];');
ALTER TABLE [KitchenSections] ALTER COLUMN [Specialties] nvarchar(500) NULL;

DECLARE @var304 sysname;
SELECT @var304 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenSections]') AND [c].[name] = N'SectionType');
IF @var304 IS NOT NULL EXEC(N'ALTER TABLE [KitchenSections] DROP CONSTRAINT [' + @var304 + '];');
ALTER TABLE [KitchenSections] ALTER COLUMN [SectionType] nvarchar(50) NULL;

DECLARE @var305 sysname;
SELECT @var305 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenSections]') AND [c].[name] = N'ResponsibleChef');
IF @var305 IS NOT NULL EXEC(N'ALTER TABLE [KitchenSections] DROP CONSTRAINT [' + @var305 + '];');
ALTER TABLE [KitchenSections] ALTER COLUMN [ResponsibleChef] nvarchar(100) NULL;

DECLARE @var306 sysname;
SELECT @var306 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenSections]') AND [c].[name] = N'Location');
IF @var306 IS NOT NULL EXEC(N'ALTER TABLE [KitchenSections] DROP CONSTRAINT [' + @var306 + '];');
ALTER TABLE [KitchenSections] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var307 sysname;
SELECT @var307 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenSections]') AND [c].[name] = N'Description');
IF @var307 IS NOT NULL EXEC(N'ALTER TABLE [KitchenSections] DROP CONSTRAINT [' + @var307 + '];');
ALTER TABLE [KitchenSections] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var308 sysname;
SELECT @var308 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenDisplays]') AND [c].[name] = N'Status');
IF @var308 IS NOT NULL EXEC(N'ALTER TABLE [KitchenDisplays] DROP CONSTRAINT [' + @var308 + '];');
ALTER TABLE [KitchenDisplays] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var309 sysname;
SELECT @var309 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenDisplays]') AND [c].[name] = N'SpecialInstructions');
IF @var309 IS NOT NULL EXEC(N'ALTER TABLE [KitchenDisplays] DROP CONSTRAINT [' + @var309 + '];');
ALTER TABLE [KitchenDisplays] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var310 sysname;
SELECT @var310 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenDisplays]') AND [c].[name] = N'Priority');
IF @var310 IS NOT NULL EXEC(N'ALTER TABLE [KitchenDisplays] DROP CONSTRAINT [' + @var310 + '];');
ALTER TABLE [KitchenDisplays] ALTER COLUMN [Priority] nvarchar(50) NULL;

DECLARE @var311 sysname;
SELECT @var311 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenDisplays]') AND [c].[name] = N'KitchenSection');
IF @var311 IS NOT NULL EXEC(N'ALTER TABLE [KitchenDisplays] DROP CONSTRAINT [' + @var311 + '];');
ALTER TABLE [KitchenDisplays] ALTER COLUMN [KitchenSection] nvarchar(50) NULL;

DECLARE @var312 sysname;
SELECT @var312 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[KitchenDisplays]') AND [c].[name] = N'AssignedChef');
IF @var312 IS NOT NULL EXEC(N'ALTER TABLE [KitchenDisplays] DROP CONSTRAINT [' + @var312 + '];');
ALTER TABLE [KitchenDisplays] ALTER COLUMN [AssignedChef] nvarchar(100) NULL;

DECLARE @var313 sysname;
SELECT @var313 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'Unit');
IF @var313 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var313 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [Unit] nvarchar(50) NULL;

DECLARE @var314 sysname;
SELECT @var314 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'Supplier');
IF @var314 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var314 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [Supplier] nvarchar(100) NULL;

DECLARE @var315 sysname;
SELECT @var315 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'StorageLocation');
IF @var315 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var315 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [StorageLocation] nvarchar(200) NULL;

DECLARE @var316 sysname;
SELECT @var316 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'Description');
IF @var316 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var316 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var317 sysname;
SELECT @var317 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'Category');
IF @var317 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var317 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var318 sysname;
SELECT @var318 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemMasters]') AND [c].[name] = N'Brand');
IF @var318 IS NOT NULL EXEC(N'ALTER TABLE [ItemMasters] DROP CONSTRAINT [' + @var318 + '];');
ALTER TABLE [ItemMasters] ALTER COLUMN [Brand] nvarchar(50) NULL;

DECLARE @var319 sysname;
SELECT @var319 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryReports]') AND [c].[name] = N'Remarks');
IF @var319 IS NOT NULL EXEC(N'ALTER TABLE [InventoryReports] DROP CONSTRAINT [' + @var319 + '];');
ALTER TABLE [InventoryReports] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var320 sysname;
SELECT @var320 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryReports]') AND [c].[name] = N'Parameters');
IF @var320 IS NOT NULL EXEC(N'ALTER TABLE [InventoryReports] DROP CONSTRAINT [' + @var320 + '];');
ALTER TABLE [InventoryReports] ALTER COLUMN [Parameters] nvarchar(500) NULL;

DECLARE @var321 sysname;
SELECT @var321 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryReports]') AND [c].[name] = N'GeneratedBy');
IF @var321 IS NOT NULL EXEC(N'ALTER TABLE [InventoryReports] DROP CONSTRAINT [' + @var321 + '];');
ALTER TABLE [InventoryReports] ALTER COLUMN [GeneratedBy] nvarchar(100) NULL;

DECLARE @var322 sysname;
SELECT @var322 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryReports]') AND [c].[name] = N'FilePath');
IF @var322 IS NOT NULL EXEC(N'ALTER TABLE [InventoryReports] DROP CONSTRAINT [' + @var322 + '];');
ALTER TABLE [InventoryReports] ALTER COLUMN [FilePath] nvarchar(200) NULL;

DECLARE @var323 sysname;
SELECT @var323 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'UpdatedBy');
IF @var323 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var323 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var324 sysname;
SELECT @var324 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'Notes');
IF @var324 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var324 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [Notes] nvarchar(1000) NULL;

DECLARE @var325 sysname;
SELECT @var325 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'Location');
IF @var325 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var325 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var326 sysname;
SELECT @var326 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'ImageUrl');
IF @var326 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var326 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [ImageUrl] nvarchar(255) NULL;

DECLARE @var327 sysname;
SELECT @var327 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'Description');
IF @var327 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var327 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var328 sysname;
SELECT @var328 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'CreatedBy');
IF @var328 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var328 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var329 sysname;
SELECT @var329 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryItems]') AND [c].[name] = N'Code');
IF @var329 IS NOT NULL EXEC(N'ALTER TABLE [InventoryItems] DROP CONSTRAINT [' + @var329 + '];');
ALTER TABLE [InventoryItems] ALTER COLUMN [Code] nvarchar(50) NULL;

DECLARE @var330 sysname;
SELECT @var330 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryCategories]') AND [c].[name] = N'UpdatedBy');
IF @var330 IS NOT NULL EXEC(N'ALTER TABLE [InventoryCategories] DROP CONSTRAINT [' + @var330 + '];');
ALTER TABLE [InventoryCategories] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var331 sysname;
SELECT @var331 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryCategories]') AND [c].[name] = N'Description');
IF @var331 IS NOT NULL EXEC(N'ALTER TABLE [InventoryCategories] DROP CONSTRAINT [' + @var331 + '];');
ALTER TABLE [InventoryCategories] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var332 sysname;
SELECT @var332 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InventoryCategories]') AND [c].[name] = N'CreatedBy');
IF @var332 IS NOT NULL EXEC(N'ALTER TABLE [InventoryCategories] DROP CONSTRAINT [' + @var332 + '];');
ALTER TABLE [InventoryCategories] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var333 sysname;
SELECT @var333 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IdTypes]') AND [c].[name] = N'Description');
IF @var333 IS NOT NULL EXEC(N'ALTER TABLE [IdTypes] DROP CONSTRAINT [' + @var333 + '];');
ALTER TABLE [IdTypes] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var334 sysname;
SELECT @var334 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IdTypes]') AND [c].[name] = N'Country');
IF @var334 IS NOT NULL EXEC(N'ALTER TABLE [IdTypes] DROP CONSTRAINT [' + @var334 + '];');
ALTER TABLE [IdTypes] ALTER COLUMN [Country] nvarchar(50) NULL;

DECLARE @var335 sysname;
SELECT @var335 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Website');
IF @var335 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var335 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Website] nvarchar(100) NULL;

DECLARE @var336 sysname;
SELECT @var336 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'TimeZone');
IF @var336 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var336 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [TimeZone] nvarchar(50) NULL;

DECLARE @var337 sysname;
SELECT @var337 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'State');
IF @var337 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var337 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [State] nvarchar(100) NULL;

DECLARE @var338 sysname;
SELECT @var338 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'StarRating');
IF @var338 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var338 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [StarRating] nvarchar(20) NULL;

DECLARE @var339 sysname;
SELECT @var339 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'PostalCode');
IF @var339 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var339 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [PostalCode] nvarchar(20) NULL;

DECLARE @var340 sysname;
SELECT @var340 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'PhoneNumber');
IF @var340 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var340 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var341 sysname;
SELECT @var341 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Phone');
IF @var341 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var341 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Phone] nvarchar(max) NULL;

DECLARE @var342 sysname;
SELECT @var342 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'PANNumber');
IF @var342 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var342 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [PANNumber] nvarchar(50) NULL;

DECLARE @var343 sysname;
SELECT @var343 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Name');
IF @var343 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var343 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Name] nvarchar(max) NULL;

DECLARE @var344 sysname;
SELECT @var344 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'ManagerPhone');
IF @var344 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var344 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [ManagerPhone] nvarchar(20) NULL;

DECLARE @var345 sysname;
SELECT @var345 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'ManagerName');
IF @var345 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var345 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [ManagerName] nvarchar(100) NULL;

DECLARE @var346 sysname;
SELECT @var346 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'ManagerEmail');
IF @var346 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var346 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [ManagerEmail] nvarchar(100) NULL;

DECLARE @var347 sysname;
SELECT @var347 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'LogoPath');
IF @var347 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var347 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [LogoPath] nvarchar(200) NULL;

DECLARE @var348 sysname;
SELECT @var348 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'LicenseNumber');
IF @var348 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var348 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [LicenseNumber] nvarchar(50) NULL;

DECLARE @var349 sysname;
SELECT @var349 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'GSTNumber');
IF @var349 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var349 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [GSTNumber] nvarchar(50) NULL;

DECLARE @var350 sysname;
SELECT @var350 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Email');
IF @var350 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var350 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var351 sysname;
SELECT @var351 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Description');
IF @var351 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var351 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var352 sysname;
SELECT @var352 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Currency');
IF @var352 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var352 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Currency] nvarchar(50) NULL;

DECLARE @var353 sysname;
SELECT @var353 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Country');
IF @var353 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var353 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var354 sysname;
SELECT @var354 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Code');
IF @var354 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var354 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Code] nvarchar(max) NULL;

DECLARE @var355 sysname;
SELECT @var355 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'City');
IF @var355 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var355 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var356 sysname;
SELECT @var356 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Hotels]') AND [c].[name] = N'Address');
IF @var356 IS NOT NULL EXEC(N'ALTER TABLE [Hotels] DROP CONSTRAINT [' + @var356 + '];');
ALTER TABLE [Hotels] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var357 sysname;
SELECT @var357 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HallMasters]') AND [c].[name] = N'Location');
IF @var357 IS NOT NULL EXEC(N'ALTER TABLE [HallMasters] DROP CONSTRAINT [' + @var357 + '];');
ALTER TABLE [HallMasters] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var358 sysname;
SELECT @var358 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HallMasters]') AND [c].[name] = N'ImagePath');
IF @var358 IS NOT NULL EXEC(N'ALTER TABLE [HallMasters] DROP CONSTRAINT [' + @var358 + '];');
ALTER TABLE [HallMasters] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var359 sysname;
SELECT @var359 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HallMasters]') AND [c].[name] = N'HallType');
IF @var359 IS NOT NULL EXEC(N'ALTER TABLE [HallMasters] DROP CONSTRAINT [' + @var359 + '];');
ALTER TABLE [HallMasters] ALTER COLUMN [HallType] nvarchar(50) NULL;

DECLARE @var360 sysname;
SELECT @var360 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HallMasters]') AND [c].[name] = N'Description');
IF @var360 IS NOT NULL EXEC(N'ALTER TABLE [HallMasters] DROP CONSTRAINT [' + @var360 + '];');
ALTER TABLE [HallMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var361 sysname;
SELECT @var361 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[HallMasters]') AND [c].[name] = N'Amenities');
IF @var361 IS NOT NULL EXEC(N'ALTER TABLE [HallMasters] DROP CONSTRAINT [' + @var361 + '];');
ALTER TABLE [HallMasters] ALTER COLUMN [Amenities] nvarchar(500) NULL;

DECLARE @var362 sysname;
SELECT @var362 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'PhoneNumber');
IF @var362 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var362 + '];');
ALTER TABLE [Guests] ALTER COLUMN [PhoneNumber] nvarchar(50) NULL;

DECLARE @var363 sysname;
SELECT @var363 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Phone');
IF @var363 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var363 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Phone] nvarchar(max) NULL;

DECLARE @var364 sysname;
SELECT @var364 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Notes');
IF @var364 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var364 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var365 sysname;
SELECT @var365 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'LastName');
IF @var365 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var365 + '];');
ALTER TABLE [Guests] ALTER COLUMN [LastName] nvarchar(max) NULL;

DECLARE @var366 sysname;
SELECT @var366 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'IdType');
IF @var366 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var366 + '];');
ALTER TABLE [Guests] ALTER COLUMN [IdType] nvarchar(100) NULL;

DECLARE @var367 sysname;
SELECT @var367 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'IdProof');
IF @var367 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var367 + '];');
ALTER TABLE [Guests] ALTER COLUMN [IdProof] varbinary(max) NULL;

DECLARE @var368 sysname;
SELECT @var368 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'IdNumber');
IF @var368 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var368 + '];');
ALTER TABLE [Guests] ALTER COLUMN [IdNumber] nvarchar(50) NULL;

DECLARE @var369 sysname;
SELECT @var369 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Gender');
IF @var369 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var369 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Gender] nvarchar(10) NULL;

DECLARE @var370 sysname;
SELECT @var370 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'FirstName');
IF @var370 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var370 + '];');
ALTER TABLE [Guests] ALTER COLUMN [FirstName] nvarchar(max) NULL;

DECLARE @var371 sysname;
SELECT @var371 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Email');
IF @var371 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var371 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var372 sysname;
SELECT @var372 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Country');
IF @var372 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var372 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var373 sysname;
SELECT @var373 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Company');
IF @var373 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var373 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Company] nvarchar(200) NULL;

DECLARE @var374 sysname;
SELECT @var374 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'City');
IF @var374 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var374 + '];');
ALTER TABLE [Guests] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var375 sysname;
SELECT @var375 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Address');
IF @var375 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var375 + '];');
ALTER TABLE [Guests] ALTER COLUMN [Address] nvarchar(500) NULL;

DECLARE @var376 sysname;
SELECT @var376 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Remarks');
IF @var376 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var376 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var377 sysname;
SELECT @var377 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'RegisteredBy');
IF @var377 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var377 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [RegisteredBy] nvarchar(100) NULL;

DECLARE @var378 sysname;
SELECT @var378 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Purpose');
IF @var378 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var378 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Purpose] nvarchar(50) NULL;

DECLARE @var379 sysname;
SELECT @var379 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'PhoneNumber');
IF @var379 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var379 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var380 sysname;
SELECT @var380 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Nationality');
IF @var380 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var380 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Nationality] nvarchar(50) NULL;

DECLARE @var381 sysname;
SELECT @var381 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'IdType');
IF @var381 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var381 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [IdType] nvarchar(50) NULL;

DECLARE @var382 sysname;
SELECT @var382 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'IdNumber');
IF @var382 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var382 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [IdNumber] nvarchar(50) NULL;

DECLARE @var383 sysname;
SELECT @var383 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Gender');
IF @var383 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var383 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Gender] nvarchar(20) NULL;

DECLARE @var384 sysname;
SELECT @var384 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Email');
IF @var384 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var384 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var385 sysname;
SELECT @var385 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Country');
IF @var385 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var385 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var386 sysname;
SELECT @var386 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Company');
IF @var386 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var386 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Company] nvarchar(100) NULL;

DECLARE @var387 sysname;
SELECT @var387 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'City');
IF @var387 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var387 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var388 sysname;
SELECT @var388 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestRegistrations]') AND [c].[name] = N'Address');
IF @var388 IS NOT NULL EXEC(N'ALTER TABLE [GuestRegistrations] DROP CONSTRAINT [' + @var388 + '];');
ALTER TABLE [GuestRegistrations] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var389 sysname;
SELECT @var389 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'PhoneNumber');
IF @var389 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var389 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var390 sysname;
SELECT @var390 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Nationality');
IF @var390 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var390 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Nationality] nvarchar(50) NULL;

DECLARE @var391 sysname;
SELECT @var391 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'IdType');
IF @var391 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var391 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [IdType] nvarchar(50) NULL;

DECLARE @var392 sysname;
SELECT @var392 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'IdNumber');
IF @var392 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var392 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [IdNumber] nvarchar(50) NULL;

DECLARE @var393 sysname;
SELECT @var393 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'GuestType');
IF @var393 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var393 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [GuestType] nvarchar(50) NULL;

DECLARE @var394 sysname;
SELECT @var394 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'GuestCode');
IF @var394 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var394 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [GuestCode] nvarchar(20) NULL;

DECLARE @var395 sysname;
SELECT @var395 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Gender');
IF @var395 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var395 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Gender] nvarchar(20) NULL;

DECLARE @var396 sysname;
SELECT @var396 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Email');
IF @var396 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var396 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var397 sysname;
SELECT @var397 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Country');
IF @var397 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var397 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var398 sysname;
SELECT @var398 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Company');
IF @var398 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var398 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Company] nvarchar(100) NULL;

DECLARE @var399 sysname;
SELECT @var399 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'City');
IF @var399 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var399 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var400 sysname;
SELECT @var400 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestMasters]') AND [c].[name] = N'Address');
IF @var400 IS NOT NULL EXEC(N'ALTER TABLE [GuestMasters] DROP CONSTRAINT [' + @var400 + '];');
ALTER TABLE [GuestMasters] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var401 sysname;
SELECT @var401 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestLedgers]') AND [c].[name] = N'TransactionType');
IF @var401 IS NOT NULL EXEC(N'ALTER TABLE [GuestLedgers] DROP CONSTRAINT [' + @var401 + '];');
ALTER TABLE [GuestLedgers] ALTER COLUMN [TransactionType] nvarchar(max) NULL;

DECLARE @var402 sysname;
SELECT @var402 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestLedgers]') AND [c].[name] = N'Reference');
IF @var402 IS NOT NULL EXEC(N'ALTER TABLE [GuestLedgers] DROP CONSTRAINT [' + @var402 + '];');
ALTER TABLE [GuestLedgers] ALTER COLUMN [Reference] nvarchar(max) NULL;

DECLARE @var403 sysname;
SELECT @var403 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestLedgers]') AND [c].[name] = N'Notes');
IF @var403 IS NOT NULL EXEC(N'ALTER TABLE [GuestLedgers] DROP CONSTRAINT [' + @var403 + '];');
ALTER TABLE [GuestLedgers] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var404 sysname;
SELECT @var404 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestLedgers]') AND [c].[name] = N'Description');
IF @var404 IS NOT NULL EXEC(N'ALTER TABLE [GuestLedgers] DROP CONSTRAINT [' + @var404 + '];');
ALTER TABLE [GuestLedgers] ALTER COLUMN [Description] nvarchar(max) NULL;

DECLARE @var405 sysname;
SELECT @var405 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestHistories]') AND [c].[name] = N'RoomType');
IF @var405 IS NOT NULL EXEC(N'ALTER TABLE [GuestHistories] DROP CONSTRAINT [' + @var405 + '];');
ALTER TABLE [GuestHistories] ALTER COLUMN [RoomType] nvarchar(50) NULL;

DECLARE @var406 sysname;
SELECT @var406 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestHistories]') AND [c].[name] = N'RoomNumber');
IF @var406 IS NOT NULL EXEC(N'ALTER TABLE [GuestHistories] DROP CONSTRAINT [' + @var406 + '];');
ALTER TABLE [GuestHistories] ALTER COLUMN [RoomNumber] nvarchar(50) NULL;

DECLARE @var407 sysname;
SELECT @var407 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestHistories]') AND [c].[name] = N'Purpose');
IF @var407 IS NOT NULL EXEC(N'ALTER TABLE [GuestHistories] DROP CONSTRAINT [' + @var407 + '];');
ALTER TABLE [GuestHistories] ALTER COLUMN [Purpose] nvarchar(100) NULL;

DECLARE @var408 sysname;
SELECT @var408 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestHistories]') AND [c].[name] = N'PaymentStatus');
IF @var408 IS NOT NULL EXEC(N'ALTER TABLE [GuestHistories] DROP CONSTRAINT [' + @var408 + '];');
ALTER TABLE [GuestHistories] ALTER COLUMN [PaymentStatus] nvarchar(50) NULL;

DECLARE @var409 sysname;
SELECT @var409 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestHistories]') AND [c].[name] = N'Feedback');
IF @var409 IS NOT NULL EXEC(N'ALTER TABLE [GuestHistories] DROP CONSTRAINT [' + @var409 + '];');
ALTER TABLE [GuestHistories] ALTER COLUMN [Feedback] nvarchar(500) NULL;

DECLARE @var410 sysname;
SELECT @var410 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFolios]') AND [c].[name] = N'TransactionType');
IF @var410 IS NOT NULL EXEC(N'ALTER TABLE [GuestFolios] DROP CONSTRAINT [' + @var410 + '];');
ALTER TABLE [GuestFolios] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var411 sysname;
SELECT @var411 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFolios]') AND [c].[name] = N'Remarks');
IF @var411 IS NOT NULL EXEC(N'ALTER TABLE [GuestFolios] DROP CONSTRAINT [' + @var411 + '];');
ALTER TABLE [GuestFolios] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var412 sysname;
SELECT @var412 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFolios]') AND [c].[name] = N'Reference');
IF @var412 IS NOT NULL EXEC(N'ALTER TABLE [GuestFolios] DROP CONSTRAINT [' + @var412 + '];');
ALTER TABLE [GuestFolios] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var413 sysname;
SELECT @var413 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFolios]') AND [c].[name] = N'PostedBy');
IF @var413 IS NOT NULL EXEC(N'ALTER TABLE [GuestFolios] DROP CONSTRAINT [' + @var413 + '];');
ALTER TABLE [GuestFolios] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var414 sysname;
SELECT @var414 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFolios]') AND [c].[name] = N'Description');
IF @var414 IS NOT NULL EXEC(N'ALTER TABLE [GuestFolios] DROP CONSTRAINT [' + @var414 + '];');
ALTER TABLE [GuestFolios] ALTER COLUMN [Description] nvarchar(100) NULL;

DECLARE @var415 sysname;
SELECT @var415 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'Suggestions');
IF @var415 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var415 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [Suggestions] nvarchar(500) NULL;

DECLARE @var416 sysname;
SELECT @var416 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'Status');
IF @var416 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var416 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var417 sysname;
SELECT @var417 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'ReviewedBy');
IF @var417 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var417 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [ReviewedBy] nvarchar(100) NULL;

DECLARE @var418 sysname;
SELECT @var418 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'ManagementResponse');
IF @var418 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var418 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [ManagementResponse] nvarchar(500) NULL;

DECLARE @var419 sysname;
SELECT @var419 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'FeedbackType');
IF @var419 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var419 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [FeedbackType] nvarchar(50) NULL;

DECLARE @var420 sysname;
SELECT @var420 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'FeedbackSource');
IF @var420 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var420 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [FeedbackSource] nvarchar(50) NULL;

DECLARE @var421 sysname;
SELECT @var421 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'Complaints');
IF @var421 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var421 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [Complaints] nvarchar(500) NULL;

DECLARE @var422 sysname;
SELECT @var422 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestFeedbackServices]') AND [c].[name] = N'Comments');
IF @var422 IS NOT NULL EXEC(N'ALTER TABLE [GuestFeedbackServices] DROP CONSTRAINT [' + @var422 + '];');
ALTER TABLE [GuestFeedbackServices] ALTER COLUMN [Comments] nvarchar(1000) NULL;

DECLARE @var423 sysname;
SELECT @var423 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestDocuments]') AND [c].[name] = N'Notes');
IF @var423 IS NOT NULL EXEC(N'ALTER TABLE [GuestDocuments] DROP CONSTRAINT [' + @var423 + '];');
ALTER TABLE [GuestDocuments] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var424 sysname;
SELECT @var424 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestDocuments]') AND [c].[name] = N'DocumentType');
IF @var424 IS NOT NULL EXEC(N'ALTER TABLE [GuestDocuments] DROP CONSTRAINT [' + @var424 + '];');
ALTER TABLE [GuestDocuments] ALTER COLUMN [DocumentType] nvarchar(max) NULL;

DECLARE @var425 sysname;
SELECT @var425 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestDocuments]') AND [c].[name] = N'DocumentPath');
IF @var425 IS NOT NULL EXEC(N'ALTER TABLE [GuestDocuments] DROP CONSTRAINT [' + @var425 + '];');
ALTER TABLE [GuestDocuments] ALTER COLUMN [DocumentPath] nvarchar(max) NULL;

DECLARE @var426 sysname;
SELECT @var426 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestDocuments]') AND [c].[name] = N'DocumentNumber');
IF @var426 IS NOT NULL EXEC(N'ALTER TABLE [GuestDocuments] DROP CONSTRAINT [' + @var426 + '];');
ALTER TABLE [GuestDocuments] ALTER COLUMN [DocumentNumber] nvarchar(max) NULL;

DECLARE @var427 sysname;
SELECT @var427 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'Status');
IF @var427 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var427 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var428 sysname;
SELECT @var428 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'SentBy');
IF @var428 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var428 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [SentBy] nvarchar(100) NULL;

DECLARE @var429 sysname;
SELECT @var429 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'ReplyMessage');
IF @var429 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var429 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [ReplyMessage] nvarchar(1000) NULL;

DECLARE @var430 sysname;
SELECT @var430 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'Purpose');
IF @var430 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var430 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [Purpose] nvarchar(50) NULL;

DECLARE @var431 sysname;
SELECT @var431 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'Priority');
IF @var431 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var431 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [Priority] nvarchar(50) NULL;

DECLARE @var432 sysname;
SELECT @var432 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestCommunications]') AND [c].[name] = N'Notes');
IF @var432 IS NOT NULL EXEC(N'ALTER TABLE [GuestCommunications] DROP CONSTRAINT [' + @var432 + '];');
ALTER TABLE [GuestCommunications] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var433 sysname;
SELECT @var433 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestAccounts]') AND [c].[name] = N'TransactionType');
IF @var433 IS NOT NULL EXEC(N'ALTER TABLE [GuestAccounts] DROP CONSTRAINT [' + @var433 + '];');
ALTER TABLE [GuestAccounts] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var434 sysname;
SELECT @var434 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestAccounts]') AND [c].[name] = N'Remarks');
IF @var434 IS NOT NULL EXEC(N'ALTER TABLE [GuestAccounts] DROP CONSTRAINT [' + @var434 + '];');
ALTER TABLE [GuestAccounts] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var435 sysname;
SELECT @var435 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestAccounts]') AND [c].[name] = N'Reference');
IF @var435 IS NOT NULL EXEC(N'ALTER TABLE [GuestAccounts] DROP CONSTRAINT [' + @var435 + '];');
ALTER TABLE [GuestAccounts] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var436 sysname;
SELECT @var436 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestAccounts]') AND [c].[name] = N'PostedBy');
IF @var436 IS NOT NULL EXEC(N'ALTER TABLE [GuestAccounts] DROP CONSTRAINT [' + @var436 + '];');
ALTER TABLE [GuestAccounts] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var437 sysname;
SELECT @var437 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GuestAccounts]') AND [c].[name] = N'Description');
IF @var437 IS NOT NULL EXEC(N'ALTER TABLE [GuestAccounts] DROP CONSTRAINT [' + @var437 + '];');
ALTER TABLE [GuestAccounts] ALTER COLUMN [Description] nvarchar(100) NULL;

DECLARE @var438 sysname;
SELECT @var438 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GeneralLedgers]') AND [c].[name] = N'Remarks');
IF @var438 IS NOT NULL EXEC(N'ALTER TABLE [GeneralLedgers] DROP CONSTRAINT [' + @var438 + '];');
ALTER TABLE [GeneralLedgers] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var439 sysname;
SELECT @var439 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GeneralLedgers]') AND [c].[name] = N'Reference');
IF @var439 IS NOT NULL EXEC(N'ALTER TABLE [GeneralLedgers] DROP CONSTRAINT [' + @var439 + '];');
ALTER TABLE [GeneralLedgers] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var440 sysname;
SELECT @var440 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GeneralLedgers]') AND [c].[name] = N'PostedBy');
IF @var440 IS NOT NULL EXEC(N'ALTER TABLE [GeneralLedgers] DROP CONSTRAINT [' + @var440 + '];');
ALTER TABLE [GeneralLedgers] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var441 sysname;
SELECT @var441 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GeneralLedgers]') AND [c].[name] = N'Description');
IF @var441 IS NOT NULL EXEC(N'ALTER TABLE [GeneralLedgers] DROP CONSTRAINT [' + @var441 + '];');
ALTER TABLE [GeneralLedgers] ALTER COLUMN [Description] nvarchar(100) NULL;

DECLARE @var442 sysname;
SELECT @var442 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GardenMasters]') AND [c].[name] = N'Location');
IF @var442 IS NOT NULL EXEC(N'ALTER TABLE [GardenMasters] DROP CONSTRAINT [' + @var442 + '];');
ALTER TABLE [GardenMasters] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var443 sysname;
SELECT @var443 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GardenMasters]') AND [c].[name] = N'GardenType');
IF @var443 IS NOT NULL EXEC(N'ALTER TABLE [GardenMasters] DROP CONSTRAINT [' + @var443 + '];');
ALTER TABLE [GardenMasters] ALTER COLUMN [GardenType] nvarchar(50) NULL;

DECLARE @var444 sysname;
SELECT @var444 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GardenMasters]') AND [c].[name] = N'Features');
IF @var444 IS NOT NULL EXEC(N'ALTER TABLE [GardenMasters] DROP CONSTRAINT [' + @var444 + '];');
ALTER TABLE [GardenMasters] ALTER COLUMN [Features] nvarchar(500) NULL;

DECLARE @var445 sysname;
SELECT @var445 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GardenMasters]') AND [c].[name] = N'Description');
IF @var445 IS NOT NULL EXEC(N'ALTER TABLE [GardenMasters] DROP CONSTRAINT [' + @var445 + '];');
ALTER TABLE [GardenMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var446 sysname;
SELECT @var446 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FoodCategories]') AND [c].[name] = N'Type');
IF @var446 IS NOT NULL EXEC(N'ALTER TABLE [FoodCategories] DROP CONSTRAINT [' + @var446 + '];');
ALTER TABLE [FoodCategories] ALTER COLUMN [Type] nvarchar(50) NULL;

DECLARE @var447 sysname;
SELECT @var447 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FoodCategories]') AND [c].[name] = N'ImagePath');
IF @var447 IS NOT NULL EXEC(N'ALTER TABLE [FoodCategories] DROP CONSTRAINT [' + @var447 + '];');
ALTER TABLE [FoodCategories] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var448 sysname;
SELECT @var448 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FoodCategories]') AND [c].[name] = N'Description');
IF @var448 IS NOT NULL EXEC(N'ALTER TABLE [FoodCategories] DROP CONSTRAINT [' + @var448 + '];');
ALTER TABLE [FoodCategories] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var449 sysname;
SELECT @var449 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FoodCategories]') AND [c].[name] = N'Cuisine');
IF @var449 IS NOT NULL EXEC(N'ALTER TABLE [FoodCategories] DROP CONSTRAINT [' + @var449 + '];');
ALTER TABLE [FoodCategories] ALTER COLUMN [Cuisine] nvarchar(100) NULL;

DECLARE @var450 sysname;
SELECT @var450 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FoodCategories]') AND [c].[name] = N'ColorCode');
IF @var450 IS NOT NULL EXEC(N'ALTER TABLE [FoodCategories] DROP CONSTRAINT [' + @var450 + '];');
ALTER TABLE [FoodCategories] ALTER COLUMN [ColorCode] nvarchar(7) NULL;

DECLARE @var451 sysname;
SELECT @var451 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'SpecialFeatures');
IF @var451 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var451 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [SpecialFeatures] nvarchar(500) NULL;

DECLARE @var452 sysname;
SELECT @var452 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'SafetyFeatures');
IF @var452 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var452 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [SafetyFeatures] nvarchar(500) NULL;

DECLARE @var453 sysname;
SELECT @var453 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'HousekeepingSupervisor');
IF @var453 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var453 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [HousekeepingSupervisor] nvarchar(100) NULL;

DECLARE @var454 sysname;
SELECT @var454 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'FloorPlanPath');
IF @var454 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var454 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [FloorPlanPath] nvarchar(200) NULL;

DECLARE @var455 sysname;
SELECT @var455 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'FloorManager');
IF @var455 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var455 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [FloorManager] nvarchar(100) NULL;

DECLARE @var456 sysname;
SELECT @var456 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FloorManagements]') AND [c].[name] = N'Description');
IF @var456 IS NOT NULL EXEC(N'ALTER TABLE [FloorManagements] DROP CONSTRAINT [' + @var456 + '];');
ALTER TABLE [FloorManagements] ALTER COLUMN [Description] nvarchar(500) NULL;

ALTER TABLE [FloorManagements] ADD [FloorImagePath] nvarchar(200) NULL;

DECLARE @var457 sysname;
SELECT @var457 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraPersons]') AND [c].[name] = N'Description');
IF @var457 IS NOT NULL EXEC(N'ALTER TABLE [ExtraPersons] DROP CONSTRAINT [' + @var457 + '];');
ALTER TABLE [ExtraPersons] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var458 sysname;
SELECT @var458 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraPersons]') AND [c].[name] = N'ApplicableRoomTypes');
IF @var458 IS NOT NULL EXEC(N'ALTER TABLE [ExtraPersons] DROP CONSTRAINT [' + @var458 + '];');
ALTER TABLE [ExtraPersons] ALTER COLUMN [ApplicableRoomTypes] nvarchar(100) NULL;

DECLARE @var459 sysname;
SELECT @var459 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraPersons]') AND [c].[name] = N'AgeGroup');
IF @var459 IS NOT NULL EXEC(N'ALTER TABLE [ExtraPersons] DROP CONSTRAINT [' + @var459 + '];');
ALTER TABLE [ExtraPersons] ALTER COLUMN [AgeGroup] nvarchar(50) NULL;

DECLARE @var460 sysname;
SELECT @var460 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraBeds]') AND [c].[name] = N'Size');
IF @var460 IS NOT NULL EXEC(N'ALTER TABLE [ExtraBeds] DROP CONSTRAINT [' + @var460 + '];');
ALTER TABLE [ExtraBeds] ALTER COLUMN [Size] nvarchar(50) NULL;

DECLARE @var461 sysname;
SELECT @var461 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraBeds]') AND [c].[name] = N'Description');
IF @var461 IS NOT NULL EXEC(N'ALTER TABLE [ExtraBeds] DROP CONSTRAINT [' + @var461 + '];');
ALTER TABLE [ExtraBeds] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var462 sysname;
SELECT @var462 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraBeds]') AND [c].[name] = N'BedType');
IF @var462 IS NOT NULL EXEC(N'ALTER TABLE [ExtraBeds] DROP CONSTRAINT [' + @var462 + '];');
ALTER TABLE [ExtraBeds] ALTER COLUMN [BedType] nvarchar(50) NULL;

DECLARE @var463 sysname;
SELECT @var463 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExtraBeds]') AND [c].[name] = N'ApplicableRoomTypes');
IF @var463 IS NOT NULL EXEC(N'ALTER TABLE [ExtraBeds] DROP CONSTRAINT [' + @var463 + '];');
ALTER TABLE [ExtraBeds] ALTER COLUMN [ApplicableRoomTypes] nvarchar(100) NULL;

DECLARE @var464 sysname;
SELECT @var464 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'UpdatedBy');
IF @var464 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var464 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var465 sysname;
SELECT @var465 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'Description');
IF @var465 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var465 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var466 sysname;
SELECT @var466 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'CreatedBy');
IF @var466 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var466 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var467 sysname;
SELECT @var467 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'Code');
IF @var467 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var467 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [Code] nvarchar(50) NULL;

DECLARE @var468 sysname;
SELECT @var468 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'Category');
IF @var468 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var468 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var469 sysname;
SELECT @var469 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypes]') AND [c].[name] = N'AccountCode');
IF @var469 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypes] DROP CONSTRAINT [' + @var469 + '];');
ALTER TABLE [ExpenseTypes] ALTER COLUMN [AccountCode] nvarchar(100) NULL;

DECLARE @var470 sysname;
SELECT @var470 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypeMasters]') AND [c].[name] = N'Description');
IF @var470 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypeMasters] DROP CONSTRAINT [' + @var470 + '];');
ALTER TABLE [ExpenseTypeMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var471 sysname;
SELECT @var471 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypeMasters]') AND [c].[name] = N'Category');
IF @var471 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypeMasters] DROP CONSTRAINT [' + @var471 + '];');
ALTER TABLE [ExpenseTypeMasters] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var472 sysname;
SELECT @var472 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpenseTypeMasters]') AND [c].[name] = N'ApprovalLevel');
IF @var472 IS NOT NULL EXEC(N'ALTER TABLE [ExpenseTypeMasters] DROP CONSTRAINT [' + @var472 + '];');
ALTER TABLE [ExpenseTypeMasters] ALTER COLUMN [ApprovalLevel] nvarchar(100) NULL;

DECLARE @var473 sysname;
SELECT @var473 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'Status');
IF @var473 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var473 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var474 sysname;
SELECT @var474 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'ReceiptPath');
IF @var474 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var474 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [ReceiptPath] nvarchar(200) NULL;

DECLARE @var475 sysname;
SELECT @var475 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'ExpenseType');
IF @var475 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var475 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [ExpenseType] nvarchar(50) NULL;

DECLARE @var476 sysname;
SELECT @var476 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'Description');
IF @var476 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var476 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var477 sysname;
SELECT @var477 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'Category');
IF @var477 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var477 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var478 sysname;
SELECT @var478 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExpensesMasters]') AND [c].[name] = N'ApprovedBy');
IF @var478 IS NOT NULL EXEC(N'ALTER TABLE [ExpensesMasters] DROP CONSTRAINT [' + @var478 + '];');
ALTER TABLE [ExpensesMasters] ALTER COLUMN [ApprovedBy] nvarchar(100) NULL;

DECLARE @var479 sysname;
SELECT @var479 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'VendorPhone');
IF @var479 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var479 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [VendorPhone] nvarchar(20) NULL;

DECLARE @var480 sysname;
SELECT @var480 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'VendorName');
IF @var480 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var480 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [VendorName] nvarchar(200) NULL;

DECLARE @var481 sysname;
SELECT @var481 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'VendorEmail');
IF @var481 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var481 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [VendorEmail] nvarchar(100) NULL;

DECLARE @var482 sysname;
SELECT @var482 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'VendorAddress');
IF @var482 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var482 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [VendorAddress] nvarchar(500) NULL;

DECLARE @var483 sysname;
SELECT @var483 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'UpdatedBy');
IF @var483 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var483 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var484 sysname;
SELECT @var484 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'Status');
IF @var484 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var484 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var485 sysname;
SELECT @var485 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'ReferenceNumber');
IF @var485 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var485 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [ReferenceNumber] nvarchar(100) NULL;

DECLARE @var486 sysname;
SELECT @var486 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'RecurrencePattern');
IF @var486 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var486 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [RecurrencePattern] nvarchar(50) NULL;

DECLARE @var487 sysname;
SELECT @var487 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'PaymentMethod');
IF @var487 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var487 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [PaymentMethod] nvarchar(50) NULL;

DECLARE @var488 sysname;
SELECT @var488 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'PaidBy');
IF @var488 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var488 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [PaidBy] nvarchar(50) NULL;

DECLARE @var489 sysname;
SELECT @var489 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'Notes');
IF @var489 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var489 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [Notes] nvarchar(1000) NULL;

DECLARE @var490 sysname;
SELECT @var490 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'InvoiceNumber');
IF @var490 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var490 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [InvoiceNumber] nvarchar(50) NULL;

DECLARE @var491 sysname;
SELECT @var491 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'Description');
IF @var491 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var491 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [Description] nvarchar(1000) NULL;

DECLARE @var492 sysname;
SELECT @var492 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'CreatedBy');
IF @var492 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var492 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var493 sysname;
SELECT @var493 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'Category');
IF @var493 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var493 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var494 sysname;
SELECT @var494 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'AttachmentPath');
IF @var494 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var494 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [AttachmentPath] nvarchar(255) NULL;

DECLARE @var495 sysname;
SELECT @var495 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Expenses]') AND [c].[name] = N'ApprovedBy');
IF @var495 IS NOT NULL EXEC(N'ALTER TABLE [Expenses] DROP CONSTRAINT [' + @var495 + '];');
ALTER TABLE [Expenses] ALTER COLUMN [ApprovedBy] nvarchar(50) NULL;

DECLARE @var496 sysname;
SELECT @var496 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'Venue');
IF @var496 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var496 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [Venue] nvarchar(100) NULL;

DECLARE @var497 sysname;
SELECT @var497 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'Status');
IF @var497 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var497 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var498 sysname;
SELECT @var498 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'SpecialRequirements');
IF @var498 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var498 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [SpecialRequirements] nvarchar(500) NULL;

DECLARE @var499 sysname;
SELECT @var499 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'EventType');
IF @var499 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var499 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [EventType] nvarchar(50) NULL;

DECLARE @var500 sysname;
SELECT @var500 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'EventNotes');
IF @var500 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var500 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [EventNotes] nvarchar(500) NULL;

DECLARE @var501 sysname;
SELECT @var501 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EventManagements]') AND [c].[name] = N'EventManager');
IF @var501 IS NOT NULL EXEC(N'ALTER TABLE [EventManagements] DROP CONSTRAINT [' + @var501 + '];');
ALTER TABLE [EventManagements] ALTER COLUMN [EventManager] nvarchar(100) NULL;

DECLARE @var502 sysname;
SELECT @var502 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Status');
IF @var502 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var502 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var503 sysname;
SELECT @var503 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'State');
IF @var503 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var503 + '];');
ALTER TABLE [Employees] ALTER COLUMN [State] nvarchar(100) NULL;

DECLARE @var504 sysname;
SELECT @var504 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'PostalCode');
IF @var504 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var504 + '];');
ALTER TABLE [Employees] ALTER COLUMN [PostalCode] nvarchar(20) NULL;

DECLARE @var505 sysname;
SELECT @var505 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Position');
IF @var505 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var505 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Position] nvarchar(max) NULL;

DECLARE @var506 sysname;
SELECT @var506 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'PhoneNumber');
IF @var506 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var506 + '];');
ALTER TABLE [Employees] ALTER COLUMN [PhoneNumber] nvarchar(50) NULL;

DECLARE @var507 sysname;
SELECT @var507 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Notes');
IF @var507 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var507 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var508 sysname;
SELECT @var508 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'MobileNumber');
IF @var508 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var508 + '];');
ALTER TABLE [Employees] ALTER COLUMN [MobileNumber] nvarchar(50) NULL;

DECLARE @var509 sysname;
SELECT @var509 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'MiddleName');
IF @var509 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var509 + '];');
ALTER TABLE [Employees] ALTER COLUMN [MiddleName] nvarchar(100) NULL;

DECLARE @var510 sysname;
SELECT @var510 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'MaritalStatus');
IF @var510 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var510 + '];');
ALTER TABLE [Employees] ALTER COLUMN [MaritalStatus] nvarchar(20) NULL;

DECLARE @var511 sysname;
SELECT @var511 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Gender');
IF @var511 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var511 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Gender] nvarchar(20) NULL;

DECLARE @var512 sysname;
SELECT @var512 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmploymentType');
IF @var512 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var512 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmploymentType] nvarchar(50) NULL;

DECLARE @var513 sysname;
SELECT @var513 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmployeeCode');
IF @var513 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var513 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmployeeCode] nvarchar(max) NULL;

DECLARE @var514 sysname;
SELECT @var514 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmergencyPhone');
IF @var514 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var514 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmergencyPhone] nvarchar(max) NULL;

DECLARE @var515 sysname;
SELECT @var515 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmergencyContactRelation');
IF @var515 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var515 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmergencyContactRelation] nvarchar(200) NULL;

DECLARE @var516 sysname;
SELECT @var516 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmergencyContactPhone');
IF @var516 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var516 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmergencyContactPhone] nvarchar(50) NULL;

DECLARE @var517 sysname;
SELECT @var517 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmergencyContactName');
IF @var517 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var517 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmergencyContactName] nvarchar(500) NULL;

DECLARE @var518 sysname;
SELECT @var518 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'EmergencyContact');
IF @var518 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var518 + '];');
ALTER TABLE [Employees] ALTER COLUMN [EmergencyContact] nvarchar(max) NULL;

DECLARE @var519 sysname;
SELECT @var519 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Email');
IF @var519 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var519 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Email] nvarchar(200) NULL;

DECLARE @var520 sysname;
SELECT @var520 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Designation');
IF @var520 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var520 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Designation] nvarchar(100) NULL;

DECLARE @var521 sysname;
SELECT @var521 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Department');
IF @var521 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var521 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Department] nvarchar(100) NULL;

DECLARE @var522 sysname;
SELECT @var522 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Country');
IF @var522 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var522 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var523 sysname;
SELECT @var523 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'City');
IF @var523 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var523 + '];');
ALTER TABLE [Employees] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var524 sysname;
SELECT @var524 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Address');
IF @var524 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var524 + '];');
ALTER TABLE [Employees] ALTER COLUMN [Address] nvarchar(500) NULL;

DECLARE @var525 sysname;
SELECT @var525 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'Status');
IF @var525 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var525 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [Status] nvarchar(max) NULL;

DECLARE @var526 sysname;
SELECT @var526 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'PeriodTo');
IF @var526 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var526 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [PeriodTo] nvarchar(max) NULL;

DECLARE @var527 sysname;
SELECT @var527 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'PeriodFrom');
IF @var527 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var527 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [PeriodFrom] nvarchar(max) NULL;

DECLARE @var528 sysname;
SELECT @var528 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'PaymentType');
IF @var528 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var528 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [PaymentType] nvarchar(max) NULL;

DECLARE @var529 sysname;
SELECT @var529 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'PaymentMethod');
IF @var529 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var529 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [PaymentMethod] nvarchar(max) NULL;

DECLARE @var530 sysname;
SELECT @var530 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeePayments]') AND [c].[name] = N'Notes');
IF @var530 IS NOT NULL EXEC(N'ALTER TABLE [EmployeePayments] DROP CONSTRAINT [' + @var530 + '];');
ALTER TABLE [EmployeePayments] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var531 sysname;
SELECT @var531 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeLeave]') AND [c].[name] = N'Status');
IF @var531 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeLeave] DROP CONSTRAINT [' + @var531 + '];');
ALTER TABLE [EmployeeLeave] ALTER COLUMN [Status] nvarchar(max) NULL;

DECLARE @var532 sysname;
SELECT @var532 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeLeave]') AND [c].[name] = N'Reason');
IF @var532 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeLeave] DROP CONSTRAINT [' + @var532 + '];');
ALTER TABLE [EmployeeLeave] ALTER COLUMN [Reason] nvarchar(max) NULL;

DECLARE @var533 sysname;
SELECT @var533 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeLeave]') AND [c].[name] = N'Notes');
IF @var533 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeLeave] DROP CONSTRAINT [' + @var533 + '];');
ALTER TABLE [EmployeeLeave] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var534 sysname;
SELECT @var534 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeLeave]') AND [c].[name] = N'LeaveType');
IF @var534 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeLeave] DROP CONSTRAINT [' + @var534 + '];');
ALTER TABLE [EmployeeLeave] ALTER COLUMN [LeaveType] nvarchar(max) NULL;

DECLARE @var535 sysname;
SELECT @var535 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeLeave]') AND [c].[name] = N'ApprovedBy');
IF @var535 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeLeave] DROP CONSTRAINT [' + @var535 + '];');
ALTER TABLE [EmployeeLeave] ALTER COLUMN [ApprovedBy] nvarchar(max) NULL;

DECLARE @var536 sysname;
SELECT @var536 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeDocuments]') AND [c].[name] = N'Notes');
IF @var536 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeDocuments] DROP CONSTRAINT [' + @var536 + '];');
ALTER TABLE [EmployeeDocuments] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var537 sysname;
SELECT @var537 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeDocuments]') AND [c].[name] = N'DocumentType');
IF @var537 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeDocuments] DROP CONSTRAINT [' + @var537 + '];');
ALTER TABLE [EmployeeDocuments] ALTER COLUMN [DocumentType] nvarchar(max) NULL;

DECLARE @var538 sysname;
SELECT @var538 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeDocuments]') AND [c].[name] = N'DocumentPath');
IF @var538 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeDocuments] DROP CONSTRAINT [' + @var538 + '];');
ALTER TABLE [EmployeeDocuments] ALTER COLUMN [DocumentPath] nvarchar(max) NULL;

DECLARE @var539 sysname;
SELECT @var539 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeDocuments]') AND [c].[name] = N'DocumentNumber');
IF @var539 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeDocuments] DROP CONSTRAINT [' + @var539 + '];');
ALTER TABLE [EmployeeDocuments] ALTER COLUMN [DocumentNumber] nvarchar(max) NULL;

DECLARE @var540 sysname;
SELECT @var540 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeAttendances]') AND [c].[name] = N'Status');
IF @var540 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeAttendances] DROP CONSTRAINT [' + @var540 + '];');
ALTER TABLE [EmployeeAttendances] ALTER COLUMN [Status] nvarchar(max) NULL;

DECLARE @var541 sysname;
SELECT @var541 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmployeeAttendances]') AND [c].[name] = N'Notes');
IF @var541 IS NOT NULL EXEC(N'ALTER TABLE [EmployeeAttendances] DROP CONSTRAINT [' + @var541 + '];');
ALTER TABLE [EmployeeAttendances] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var542 sysname;
SELECT @var542 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailSettings]') AND [c].[name] = N'UpdatedBy');
IF @var542 IS NOT NULL EXEC(N'ALTER TABLE [EmailSettings] DROP CONSTRAINT [' + @var542 + '];');
ALTER TABLE [EmailSettings] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var543 sysname;
SELECT @var543 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailSettings]') AND [c].[name] = N'FromName');
IF @var543 IS NOT NULL EXEC(N'ALTER TABLE [EmailSettings] DROP CONSTRAINT [' + @var543 + '];');
ALTER TABLE [EmailSettings] ALTER COLUMN [FromName] nvarchar(100) NULL;

DECLARE @var544 sysname;
SELECT @var544 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailSettings]') AND [c].[name] = N'Description');
IF @var544 IS NOT NULL EXEC(N'ALTER TABLE [EmailSettings] DROP CONSTRAINT [' + @var544 + '];');
ALTER TABLE [EmailSettings] ALTER COLUMN [Description] nvarchar(1000) NULL;

DECLARE @var545 sysname;
SELECT @var545 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailSettings]') AND [c].[name] = N'CreatedBy');
IF @var545 IS NOT NULL EXEC(N'ALTER TABLE [EmailSettings] DROP CONSTRAINT [' + @var545 + '];');
ALTER TABLE [EmailSettings] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var546 sysname;
SELECT @var546 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailSettings]') AND [c].[name] = N'AuthenticationMethod');
IF @var546 IS NOT NULL EXEC(N'ALTER TABLE [EmailSettings] DROP CONSTRAINT [' + @var546 + '];');
ALTER TABLE [EmailSettings] ALTER COLUMN [AuthenticationMethod] nvarchar(50) NULL;

DECLARE @var547 sysname;
SELECT @var547 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksQuantities]') AND [c].[name] = N'Unit');
IF @var547 IS NOT NULL EXEC(N'ALTER TABLE [DrinksQuantities] DROP CONSTRAINT [' + @var547 + '];');
ALTER TABLE [DrinksQuantities] ALTER COLUMN [Unit] nvarchar(20) NULL;

DECLARE @var548 sysname;
SELECT @var548 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksQuantities]') AND [c].[name] = N'Description');
IF @var548 IS NOT NULL EXEC(N'ALTER TABLE [DrinksQuantities] DROP CONSTRAINT [' + @var548 + '];');
ALTER TABLE [DrinksQuantities] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var549 sysname;
SELECT @var549 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksPricings]') AND [c].[name] = N'PriceCategory');
IF @var549 IS NOT NULL EXEC(N'ALTER TABLE [DrinksPricings] DROP CONSTRAINT [' + @var549 + '];');
ALTER TABLE [DrinksPricings] ALTER COLUMN [PriceCategory] nvarchar(50) NULL;

DECLARE @var550 sysname;
SELECT @var550 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'Ingredients');
IF @var550 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var550 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [Ingredients] nvarchar(500) NULL;

DECLARE @var551 sysname;
SELECT @var551 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'ImagePath');
IF @var551 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var551 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var552 sysname;
SELECT @var552 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'Description');
IF @var552 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var552 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var553 sysname;
SELECT @var553 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'Category');
IF @var553 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var553 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var554 sysname;
SELECT @var554 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksMasters]') AND [c].[name] = N'Brand');
IF @var554 IS NOT NULL EXEC(N'ALTER TABLE [DrinksMasters] DROP CONSTRAINT [' + @var554 + '];');
ALTER TABLE [DrinksMasters] ALTER COLUMN [Brand] nvarchar(100) NULL;

DECLARE @var555 sysname;
SELECT @var555 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksCategories]') AND [c].[name] = N'Description');
IF @var555 IS NOT NULL EXEC(N'ALTER TABLE [DrinksCategories] DROP CONSTRAINT [' + @var555 + '];');
ALTER TABLE [DrinksCategories] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var556 sysname;
SELECT @var556 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksCategories]') AND [c].[name] = N'ColorCode');
IF @var556 IS NOT NULL EXEC(N'ALTER TABLE [DrinksCategories] DROP CONSTRAINT [' + @var556 + '];');
ALTER TABLE [DrinksCategories] ALTER COLUMN [ColorCode] nvarchar(7) NULL;

DECLARE @var557 sysname;
SELECT @var557 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DrinksCategories]') AND [c].[name] = N'CategoryType');
IF @var557 IS NOT NULL EXEC(N'ALTER TABLE [DrinksCategories] DROP CONSTRAINT [' + @var557 + '];');
ALTER TABLE [DrinksCategories] ALTER COLUMN [CategoryType] nvarchar(50) NULL;

DECLARE @var558 sysname;
SELECT @var558 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'SpiceLevel');
IF @var558 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var558 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [SpiceLevel] nvarchar(50) NULL;

DECLARE @var559 sysname;
SELECT @var559 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'Ingredients');
IF @var559 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var559 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [Ingredients] nvarchar(1000) NULL;

DECLARE @var560 sysname;
SELECT @var560 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'ImageUrl');
IF @var560 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var560 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [ImageUrl] nvarchar(255) NULL;

DECLARE @var561 sysname;
SELECT @var561 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'DietaryInfo');
IF @var561 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var561 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [DietaryInfo] nvarchar(50) NULL;

DECLARE @var562 sysname;
SELECT @var562 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'Description');
IF @var562 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var562 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var563 sysname;
SELECT @var563 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'Code');
IF @var563 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var563 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [Code] nvarchar(50) NULL;

DECLARE @var564 sysname;
SELECT @var564 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Dishes]') AND [c].[name] = N'Allergens');
IF @var564 IS NOT NULL EXEC(N'ALTER TABLE [Dishes] DROP CONSTRAINT [' + @var564 + '];');
ALTER TABLE [Dishes] ALTER COLUMN [Allergens] nvarchar(1000) NULL;

DECLARE @var565 sysname;
SELECT @var565 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DishCategories]') AND [c].[name] = N'Description');
IF @var565 IS NOT NULL EXEC(N'ALTER TABLE [DishCategories] DROP CONSTRAINT [' + @var565 + '];');
ALTER TABLE [DishCategories] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var566 sysname;
SELECT @var566 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'UpdatedBy');
IF @var566 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var566 + '];');
ALTER TABLE [Designations] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var567 sysname;
SELECT @var567 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Skills');
IF @var567 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var567 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Skills] nvarchar(1000) NULL;

DECLARE @var568 sysname;
SELECT @var568 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Responsibilities');
IF @var568 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var568 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Responsibilities] nvarchar(1000) NULL;

DECLARE @var569 sysname;
SELECT @var569 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Requirements');
IF @var569 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var569 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Requirements] nvarchar(1000) NULL;

DECLARE @var570 sysname;
SELECT @var570 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Level');
IF @var570 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var570 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Level] nvarchar(50) NULL;

DECLARE @var571 sysname;
SELECT @var571 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Description');
IF @var571 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var571 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var572 sysname;
SELECT @var572 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'CreatedBy');
IF @var572 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var572 + '];');
ALTER TABLE [Designations] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var573 sysname;
SELECT @var573 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Designations]') AND [c].[name] = N'Code');
IF @var573 IS NOT NULL EXEC(N'ALTER TABLE [Designations] DROP CONSTRAINT [' + @var573 + '];');
ALTER TABLE [Designations] ALTER COLUMN [Code] nvarchar(50) NULL;

DECLARE @var574 sysname;
SELECT @var574 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'UpdatedBy');
IF @var574 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var574 + '];');
ALTER TABLE [Departments] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var575 sysname;
SELECT @var575 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'Phone');
IF @var575 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var575 + '];');
ALTER TABLE [Departments] ALTER COLUMN [Phone] nvarchar(20) NULL;

DECLARE @var576 sysname;
SELECT @var576 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'Location');
IF @var576 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var576 + '];');
ALTER TABLE [Departments] ALTER COLUMN [Location] nvarchar(100) NULL;

DECLARE @var577 sysname;
SELECT @var577 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'HeadOfDepartment');
IF @var577 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var577 + '];');
ALTER TABLE [Departments] ALTER COLUMN [HeadOfDepartment] nvarchar(100) NULL;

DECLARE @var578 sysname;
SELECT @var578 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'Email');
IF @var578 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var578 + '];');
ALTER TABLE [Departments] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var579 sysname;
SELECT @var579 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'Description');
IF @var579 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var579 + '];');
ALTER TABLE [Departments] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var580 sysname;
SELECT @var580 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'CreatedBy');
IF @var580 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var580 + '];');
ALTER TABLE [Departments] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var581 sysname;
SELECT @var581 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'CostCenter');
IF @var581 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var581 + '];');
ALTER TABLE [Departments] ALTER COLUMN [CostCenter] nvarchar(50) NULL;

DECLARE @var582 sysname;
SELECT @var582 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'Code');
IF @var582 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var582 + '];');
ALTER TABLE [Departments] ALTER COLUMN [Code] nvarchar(50) NULL;

DECLARE @var583 sysname;
SELECT @var583 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'WorkingArea');
IF @var583 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var583 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [WorkingArea] nvarchar(100) NULL;

DECLARE @var584 sysname;
SELECT @var584 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'VehicleType');
IF @var584 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var584 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [VehicleType] nvarchar(50) NULL;

DECLARE @var585 sysname;
SELECT @var585 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'VehicleNumber');
IF @var585 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var585 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [VehicleNumber] nvarchar(50) NULL;

DECLARE @var586 sysname;
SELECT @var586 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'PhoneNumber');
IF @var586 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var586 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var587 sysname;
SELECT @var587 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'LicenseNumber');
IF @var587 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var587 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [LicenseNumber] nvarchar(50) NULL;

DECLARE @var588 sysname;
SELECT @var588 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'Email');
IF @var588 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var588 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var589 sysname;
SELECT @var589 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryPersonMasters]') AND [c].[name] = N'Address');
IF @var589 IS NOT NULL EXEC(N'ALTER TABLE [DeliveryPersonMasters] DROP CONSTRAINT [' + @var589 + '];');
ALTER TABLE [DeliveryPersonMasters] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var590 sysname;
SELECT @var590 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'TransactionType');
IF @var590 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var590 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [TransactionType] nvarchar(50) NULL;

DECLARE @var591 sysname;
SELECT @var591 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'Remarks');
IF @var591 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var591 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var592 sysname;
SELECT @var592 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'Reference');
IF @var592 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var592 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [Reference] nvarchar(50) NULL;

DECLARE @var593 sysname;
SELECT @var593 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'PostedBy');
IF @var593 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var593 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [PostedBy] nvarchar(100) NULL;

DECLARE @var594 sysname;
SELECT @var594 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'Description');
IF @var594 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var594 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [Description] nvarchar(100) NULL;

DECLARE @var595 sysname;
SELECT @var595 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DayBooks]') AND [c].[name] = N'AccountHead');
IF @var595 IS NOT NULL EXEC(N'ALTER TABLE [DayBooks] DROP CONSTRAINT [' + @var595 + '];');
ALTER TABLE [DayBooks] ALTER COLUMN [AccountHead] nvarchar(100) NULL;

DECLARE @var596 sysname;
SELECT @var596 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'PreferredCommunication');
IF @var596 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var596 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [PreferredCommunication] nvarchar(50) NULL;

DECLARE @var597 sysname;
SELECT @var597 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Preferences');
IF @var597 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var597 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Preferences] nvarchar(500) NULL;

DECLARE @var598 sysname;
SELECT @var598 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'PhoneNumber');
IF @var598 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var598 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var599 sysname;
SELECT @var599 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Occupation');
IF @var599 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var599 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Occupation] nvarchar(100) NULL;

DECLARE @var600 sysname;
SELECT @var600 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Notes');
IF @var600 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var600 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Notes] nvarchar(500) NULL;

DECLARE @var601 sysname;
SELECT @var601 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'MaritalStatus');
IF @var601 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var601 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [MaritalStatus] nvarchar(50) NULL;

DECLARE @var602 sysname;
SELECT @var602 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Interests');
IF @var602 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var602 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Interests] nvarchar(500) NULL;

DECLARE @var603 sysname;
SELECT @var603 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'IncomeRange');
IF @var603 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var603 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [IncomeRange] nvarchar(50) NULL;

DECLARE @var604 sysname;
SELECT @var604 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Gender');
IF @var604 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var604 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Gender] nvarchar(20) NULL;

DECLARE @var605 sysname;
SELECT @var605 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Email');
IF @var605 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var605 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var606 sysname;
SELECT @var606 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'CustomerSegment');
IF @var606 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var606 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [CustomerSegment] nvarchar(50) NULL;

DECLARE @var607 sysname;
SELECT @var607 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Country');
IF @var607 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var607 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var608 sysname;
SELECT @var608 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'City');
IF @var608 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var608 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var609 sysname;
SELECT @var609 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerDatabases]') AND [c].[name] = N'Address');
IF @var609 IS NOT NULL EXEC(N'ALTER TABLE [CustomerDatabases] DROP CONSTRAINT [' + @var609 + '];');
ALTER TABLE [CustomerDatabases] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var610 sysname;
SELECT @var610 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Currencies]') AND [c].[name] = N'Description');
IF @var610 IS NOT NULL EXEC(N'ALTER TABLE [Currencies] DROP CONSTRAINT [' + @var610 + '];');
ALTER TABLE [Currencies] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var611 sysname;
SELECT @var611 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'Status');
IF @var611 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var611 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var612 sysname;
SELECT @var612 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'SpecialInstructions');
IF @var612 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var612 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [SpecialInstructions] nvarchar(500) NULL;

DECLARE @var613 sysname;
SELECT @var613 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'Priority');
IF @var613 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var613 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [Priority] nvarchar(50) NULL;

DECLARE @var614 sysname;
SELECT @var614 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'GuestFeedback');
IF @var614 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var614 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [GuestFeedback] nvarchar(500) NULL;

DECLARE @var615 sysname;
SELECT @var615 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'CompletionNotes');
IF @var615 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var615 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [CompletionNotes] nvarchar(500) NULL;

DECLARE @var616 sysname;
SELECT @var616 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConciergeServices]') AND [c].[name] = N'AssignedTo');
IF @var616 IS NOT NULL EXEC(N'ALTER TABLE [ConciergeServices] DROP CONSTRAINT [' + @var616 + '];');
ALTER TABLE [ConciergeServices] ALTER COLUMN [AssignedTo] nvarchar(100) NULL;

DECLARE @var617 sysname;
SELECT @var617 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Website');
IF @var617 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var617 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Website] nvarchar(200) NULL;

DECLARE @var618 sysname;
SELECT @var618 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'UpdatedBy');
IF @var618 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var618 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [UpdatedBy] nvarchar(50) NULL;

DECLARE @var619 sysname;
SELECT @var619 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'TimeZone');
IF @var619 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var619 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [TimeZone] nvarchar(50) NULL;

DECLARE @var620 sysname;
SELECT @var620 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'TimeFormat');
IF @var620 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var620 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [TimeFormat] nvarchar(10) NULL;

DECLARE @var621 sysname;
SELECT @var621 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'TaxNumber');
IF @var621 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var621 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [TaxNumber] nvarchar(50) NULL;

DECLARE @var622 sysname;
SELECT @var622 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'State');
IF @var622 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var622 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [State] nvarchar(100) NULL;

DECLARE @var623 sysname;
SELECT @var623 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'RegistrationNumber');
IF @var623 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var623 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [RegistrationNumber] nvarchar(50) NULL;

DECLARE @var624 sysname;
SELECT @var624 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'PostalCode');
IF @var624 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var624 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [PostalCode] nvarchar(20) NULL;

DECLARE @var625 sysname;
SELECT @var625 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Phone');
IF @var625 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var625 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Phone] nvarchar(20) NULL;

DECLARE @var626 sysname;
SELECT @var626 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Mobile');
IF @var626 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var626 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Mobile] nvarchar(20) NULL;

DECLARE @var627 sysname;
SELECT @var627 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'LogoPath');
IF @var627 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var627 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [LogoPath] nvarchar(255) NULL;

DECLARE @var628 sysname;
SELECT @var628 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Fax');
IF @var628 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var628 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Fax] nvarchar(20) NULL;

DECLARE @var629 sysname;
SELECT @var629 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Email');
IF @var629 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var629 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var630 sysname;
SELECT @var630 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Description');
IF @var630 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var630 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Description] nvarchar(1000) NULL;

DECLARE @var631 sysname;
SELECT @var631 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'DateFormat');
IF @var631 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var631 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [DateFormat] nvarchar(10) NULL;

DECLARE @var632 sysname;
SELECT @var632 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Currency');
IF @var632 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var632 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Currency] nvarchar(50) NULL;

DECLARE @var633 sysname;
SELECT @var633 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'CreatedBy');
IF @var633 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var633 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [CreatedBy] nvarchar(50) NULL;

DECLARE @var634 sysname;
SELECT @var634 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Country');
IF @var634 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var634 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Country] nvarchar(100) NULL;

DECLARE @var635 sysname;
SELECT @var635 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'ContactPersonTitle');
IF @var635 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var635 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [ContactPersonTitle] nvarchar(100) NULL;

DECLARE @var636 sysname;
SELECT @var636 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'ContactPersonPhone');
IF @var636 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var636 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [ContactPersonPhone] nvarchar(20) NULL;

DECLARE @var637 sysname;
SELECT @var637 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'ContactPersonEmail');
IF @var637 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var637 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [ContactPersonEmail] nvarchar(100) NULL;

DECLARE @var638 sysname;
SELECT @var638 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'ContactPerson');
IF @var638 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var638 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [ContactPerson] nvarchar(100) NULL;

DECLARE @var639 sysname;
SELECT @var639 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'City');
IF @var639 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var639 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [City] nvarchar(100) NULL;

DECLARE @var640 sysname;
SELECT @var640 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyContacts]') AND [c].[name] = N'Address');
IF @var640 IS NOT NULL EXEC(N'ALTER TABLE [CompanyContacts] DROP CONSTRAINT [' + @var640 + '];');
ALTER TABLE [CompanyContacts] ALTER COLUMN [Address] nvarchar(500) NULL;

DECLARE @var641 sysname;
SELECT @var641 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutWithIDs]') AND [c].[name] = N'Remarks');
IF @var641 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutWithIDs] DROP CONSTRAINT [' + @var641 + '];');
ALTER TABLE [CheckOutWithIDs] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var642 sysname;
SELECT @var642 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutWithIDs]') AND [c].[name] = N'PaymentStatus');
IF @var642 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutWithIDs] DROP CONSTRAINT [' + @var642 + '];');
ALTER TABLE [CheckOutWithIDs] ALTER COLUMN [PaymentStatus] nvarchar(50) NULL;

DECLARE @var643 sysname;
SELECT @var643 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutWithIDs]') AND [c].[name] = N'PaymentMethod');
IF @var643 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutWithIDs] DROP CONSTRAINT [' + @var643 + '];');
ALTER TABLE [CheckOutWithIDs] ALTER COLUMN [PaymentMethod] nvarchar(50) NULL;

DECLARE @var644 sysname;
SELECT @var644 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutWithIDs]') AND [c].[name] = N'CheckedOutBy');
IF @var644 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutWithIDs] DROP CONSTRAINT [' + @var644 + '];');
ALTER TABLE [CheckOutWithIDs] ALTER COLUMN [CheckedOutBy] nvarchar(100) NULL;

DECLARE @var645 sysname;
SELECT @var645 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOuts]') AND [c].[name] = N'PaymentStatus');
IF @var645 IS NOT NULL EXEC(N'ALTER TABLE [CheckOuts] DROP CONSTRAINT [' + @var645 + '];');
ALTER TABLE [CheckOuts] ALTER COLUMN [PaymentStatus] nvarchar(max) NULL;

DECLARE @var646 sysname;
SELECT @var646 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOuts]') AND [c].[name] = N'Notes');
IF @var646 IS NOT NULL EXEC(N'ALTER TABLE [CheckOuts] DROP CONSTRAINT [' + @var646 + '];');
ALTER TABLE [CheckOuts] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var647 sysname;
SELECT @var647 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutMasters]') AND [c].[name] = N'Remarks');
IF @var647 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutMasters] DROP CONSTRAINT [' + @var647 + '];');
ALTER TABLE [CheckOutMasters] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var648 sysname;
SELECT @var648 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutMasters]') AND [c].[name] = N'PaymentStatus');
IF @var648 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutMasters] DROP CONSTRAINT [' + @var648 + '];');
ALTER TABLE [CheckOutMasters] ALTER COLUMN [PaymentStatus] nvarchar(50) NULL;

DECLARE @var649 sysname;
SELECT @var649 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutMasters]') AND [c].[name] = N'PaymentMethod');
IF @var649 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutMasters] DROP CONSTRAINT [' + @var649 + '];');
ALTER TABLE [CheckOutMasters] ALTER COLUMN [PaymentMethod] nvarchar(50) NULL;

DECLARE @var650 sysname;
SELECT @var650 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckOutMasters]') AND [c].[name] = N'CheckedOutBy');
IF @var650 IS NOT NULL EXEC(N'ALTER TABLE [CheckOutMasters] DROP CONSTRAINT [' + @var650 + '];');
ALTER TABLE [CheckOutMasters] ALTER COLUMN [CheckedOutBy] nvarchar(100) NULL;

DECLARE @var651 sysname;
SELECT @var651 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'Status');
IF @var651 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var651 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var652 sysname;
SELECT @var652 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'Remarks');
IF @var652 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var652 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var653 sysname;
SELECT @var653 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'PhoneNumber');
IF @var653 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var653 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [PhoneNumber] nvarchar(20) NULL;

DECLARE @var654 sysname;
SELECT @var654 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'Email');
IF @var654 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var654 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [Email] nvarchar(100) NULL;

DECLARE @var655 sysname;
SELECT @var655 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'CheckedInBy');
IF @var655 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var655 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [CheckedInBy] nvarchar(100) NULL;

DECLARE @var656 sysname;
SELECT @var656 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInWithIDs]') AND [c].[name] = N'Address');
IF @var656 IS NOT NULL EXEC(N'ALTER TABLE [CheckInWithIDs] DROP CONSTRAINT [' + @var656 + '];');
ALTER TABLE [CheckInWithIDs] ALTER COLUMN [Address] nvarchar(200) NULL;

DECLARE @var657 sysname;
SELECT @var657 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckIns]') AND [c].[name] = N'Notes');
IF @var657 IS NOT NULL EXEC(N'ALTER TABLE [CheckIns] DROP CONSTRAINT [' + @var657 + '];');
ALTER TABLE [CheckIns] ALTER COLUMN [Notes] nvarchar(max) NULL;

DECLARE @var658 sysname;
SELECT @var658 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInMasters]') AND [c].[name] = N'Status');
IF @var658 IS NOT NULL EXEC(N'ALTER TABLE [CheckInMasters] DROP CONSTRAINT [' + @var658 + '];');
ALTER TABLE [CheckInMasters] ALTER COLUMN [Status] nvarchar(50) NULL;

DECLARE @var659 sysname;
SELECT @var659 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInMasters]') AND [c].[name] = N'SpecialRequests');
IF @var659 IS NOT NULL EXEC(N'ALTER TABLE [CheckInMasters] DROP CONSTRAINT [' + @var659 + '];');
ALTER TABLE [CheckInMasters] ALTER COLUMN [SpecialRequests] nvarchar(500) NULL;

DECLARE @var660 sysname;
SELECT @var660 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInMasters]') AND [c].[name] = N'Remarks');
IF @var660 IS NOT NULL EXEC(N'ALTER TABLE [CheckInMasters] DROP CONSTRAINT [' + @var660 + '];');
ALTER TABLE [CheckInMasters] ALTER COLUMN [Remarks] nvarchar(500) NULL;

DECLARE @var661 sysname;
SELECT @var661 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CheckInMasters]') AND [c].[name] = N'CheckedInBy');
IF @var661 IS NOT NULL EXEC(N'ALTER TABLE [CheckInMasters] DROP CONSTRAINT [' + @var661 + '];');
ALTER TABLE [CheckInMasters] ALTER COLUMN [CheckedInBy] nvarchar(100) NULL;

DECLARE @var662 sysname;
SELECT @var662 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'ServingSize');
IF @var662 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var662 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [ServingSize] nvarchar(50) NULL;

DECLARE @var663 sysname;
SELECT @var663 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'Ingredients');
IF @var663 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var663 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [Ingredients] nvarchar(500) NULL;

DECLARE @var664 sysname;
SELECT @var664 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'ImagePath');
IF @var664 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var664 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [ImagePath] nvarchar(200) NULL;

DECLARE @var665 sysname;
SELECT @var665 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'Description');
IF @var665 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var665 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [Description] nvarchar(500) NULL;

DECLARE @var666 sysname;
SELECT @var666 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'Category');
IF @var666 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var666 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [Category] nvarchar(50) NULL;

DECLARE @var667 sysname;
SELECT @var667 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BarManagements]') AND [c].[name] = N'Brand');
IF @var667 IS NOT NULL EXEC(N'ALTER TABLE [BarManagements] DROP CONSTRAINT [' + @var667 + '];');
ALTER TABLE [BarManagements] ALTER COLUMN [Brand] nvarchar(100) NULL;

CREATE TABLE [GuestBills] (
    [Id] int NOT NULL IDENTITY,
    [CheckInId] int NULL,
    [CheckOutId] int NULL,
    [ReservationId] int NULL,
    [GuestId] int NULL,
    [GuestName] nvarchar(100) NULL,
    [RoomNumber] nvarchar(10) NULL,
    [CheckInDate] date NULL,
    [CheckOutDate] date NULL,
    [RoomCharges] decimal(10,2) NULL,
    [RestaurantCharges] decimal(10,2) NULL,
    [LaundryCharges] decimal(10,2) NULL,
    [OtherCharges] decimal(10,2) NULL,
    [Discount] decimal(10,2) NULL,
    [TaxRate] decimal(5,2) NULL,
    [Subtotal] decimal(10,2) NULL,
    [TaxAmount] decimal(10,2) NULL,
    [TotalAmount] decimal(10,2) NULL,
    [PaymentMethod] nvarchar(50) NULL,
    [Status] nvarchar(20) NULL,
    [RecordType] nvarchar(20) NULL,
    [BillDate] date NULL,
    [CreatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    [BillNumber] nvarchar(max) NULL,
    CONSTRAINT [PK_GuestBills] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GuestBills_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]),
    CONSTRAINT [FK_GuestBills_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]),
    CONSTRAINT [FK_GuestBills_Reservations_ReservationId] FOREIGN KEY ([ReservationId]) REFERENCES [Reservations] ([Id])
);

CREATE TABLE [NightAuditLog] (
    [AuditId] int NOT NULL IDENTITY,
    [BusinessDate] datetime2 NOT NULL,
    [AuditStartTime] datetime2 NULL,
    [AuditEndTime] datetime2 NULL,
    [TotalCharges] decimal(18,2) NOT NULL,
    [TotalPayments] decimal(18,2) NOT NULL,
    [VarianceAmount] decimal(18,2) NOT NULL,
    [RoomCount] int NOT NULL,
    [OccupiedRooms] int NOT NULL,
    [OccupancyPercentage] decimal(5,2) NOT NULL,
    [ADR] decimal(18,2) NOT NULL,
    [RevPAR] decimal(18,2) NOT NULL,
    [RoomRevenue] decimal(18,2) NOT NULL,
    [ExtraRevenue] decimal(18,2) NOT NULL,
    [Status] nvarchar(20) NULL,
    [CompletedBy] nvarchar(100) NULL,
    [Notes] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_NightAuditLog] PRIMARY KEY ([AuditId])
);

CREATE TABLE [RoomTypeImages] (
    [Id] int NOT NULL IDENTITY,
    [RoomTypeId] int NOT NULL,
    [ImagePath] nvarchar(255) NOT NULL,
    [OriginalFileName] nvarchar(255) NOT NULL,
    [Title] nvarchar(100) NULL,
    [Description] nvarchar(500) NULL,
    [AltText] nvarchar(255) NULL,
    [FileSizeBytes] bigint NOT NULL,
    [Width] int NOT NULL,
    [Height] int NOT NULL,
    [MimeType] nvarchar(50) NULL,
    [DisplayOrder] int NOT NULL,
    [IsPrimary] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [UploadedAt] datetime2 NOT NULL,
    [UploadedBy] nvarchar(100) NULL,
    [UpdatedAt] datetime2 NULL,
    [UpdatedBy] nvarchar(100) NULL,
    [ThumbnailPath] nvarchar(255) NULL,
    [CompressedPath] nvarchar(255) NULL,
    CONSTRAINT [PK_RoomTypeImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomTypeImages_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [NightAuditCharges] (
    [ChargeId] int NOT NULL IDENTITY,
    [AuditId] int NOT NULL,
    [BusinessDate] datetime2 NOT NULL,
    [ReservationId] int NULL,
    [GuestId] int NULL,
    [RoomNumber] nvarchar(10) NULL,
    [GuestName] nvarchar(100) NULL,
    [ChargeType] nvarchar(30) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [DepartmentCode] nvarchar(20) NULL,
    [DepartmentName] nvarchar(50) NULL,
    [PostedBy] nvarchar(100) NULL,
    [PostedTime] datetime2 NOT NULL,
    [Status] nvarchar(20) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_NightAuditCharges] PRIMARY KEY ([ChargeId]),
    CONSTRAINT [FK_NightAuditCharges_NightAuditLog_AuditId] FOREIGN KEY ([AuditId]) REFERENCES [NightAuditLog] ([AuditId]) ON DELETE CASCADE
);

CREATE TABLE [NightAuditPayments] (
    [PaymentId] int NOT NULL IDENTITY,
    [AuditId] int NOT NULL,
    [BusinessDate] datetime2 NOT NULL,
    [ReservationId] int NULL,
    [GuestId] int NULL,
    [GuestName] nvarchar(100) NULL,
    [RoomNumber] nvarchar(10) NULL,
    [PaymentMethod] nvarchar(30) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [CurrencyCode] nvarchar(3) NULL,
    [ReferenceNumber] nvarchar(50) NULL,
    [CardType] nvarchar(20) NULL,
    [ProcessedBy] nvarchar(100) NULL,
    [ProcessedTime] datetime2 NOT NULL,
    [Status] nvarchar(20) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_NightAuditPayments] PRIMARY KEY ([PaymentId]),
    CONSTRAINT [FK_NightAuditPayments_NightAuditLog_AuditId] FOREIGN KEY ([AuditId]) REFERENCES [NightAuditLog] ([AuditId]) ON DELETE CASCADE
);

CREATE TABLE [NightAuditRevenueSummary] (
    [SummaryId] int NOT NULL IDENTITY,
    [AuditId] int NOT NULL,
    [BusinessDate] datetime2 NOT NULL,
    [DepartmentCode] nvarchar(20) NOT NULL,
    [DepartmentName] nvarchar(50) NOT NULL,
    [GrossRevenue] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [ServiceCharge] decimal(18,2) NOT NULL,
    [NetRevenue] decimal(18,2) NOT NULL,
    [TransactionCount] int NOT NULL,
    [Percentage] decimal(5,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_NightAuditRevenueSummary] PRIMARY KEY ([SummaryId]),
    CONSTRAINT [FK_NightAuditRevenueSummary_NightAuditLog_AuditId] FOREIGN KEY ([AuditId]) REFERENCES [NightAuditLog] ([AuditId]) ON DELETE CASCADE
);

CREATE TABLE [NightAuditRoomStatus] (
    [StatusId] int NOT NULL IDENTITY,
    [AuditId] int NULL,
    [BusinessDate] datetime2 NOT NULL,
    [RoomNumber] nvarchar(10) NOT NULL,
    [RoomType] nvarchar(30) NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [GuestCount] int NOT NULL,
    [GuestName] nvarchar(100) NULL,
    [CheckInDate] datetime2 NULL,
    [CheckOutDate] datetime2 NULL,
    [RateAmount] decimal(18,2) NOT NULL,
    [LastUpdated] datetime2 NOT NULL,
    [UpdatedBy] nvarchar(100) NULL,
    CONSTRAINT [PK_NightAuditRoomStatus] PRIMARY KEY ([StatusId]),
    CONSTRAINT [FK_NightAuditRoomStatus_NightAuditLog_AuditId] FOREIGN KEY ([AuditId]) REFERENCES [NightAuditLog] ([AuditId])
);

CREATE TABLE [NightAuditVariances] (
    [VarianceId] int NOT NULL IDENTITY,
    [AuditId] int NOT NULL,
    [BusinessDate] datetime2 NOT NULL,
    [VarianceType] nvarchar(50) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Severity] nvarchar(20) NULL,
    [ResolvedBy] nvarchar(100) NULL,
    [ResolutionNotes] nvarchar(max) NULL,
    [Status] nvarchar(20) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ResolvedAt] datetime2 NULL,
    CONSTRAINT [PK_NightAuditVariances] PRIMARY KEY ([VarianceId]),
    CONSTRAINT [FK_NightAuditVariances_NightAuditLog_AuditId] FOREIGN KEY ([AuditId]) REFERENCES [NightAuditLog] ([AuditId]) ON DELETE CASCADE
);

CREATE INDEX [IX_GuestBills_CheckInId] ON [GuestBills] ([CheckInId]);

CREATE INDEX [IX_GuestBills_GuestId] ON [GuestBills] ([GuestId]);

CREATE INDEX [IX_GuestBills_ReservationId] ON [GuestBills] ([ReservationId]);

CREATE INDEX [IX_NightAuditCharges_AuditId] ON [NightAuditCharges] ([AuditId]);

CREATE INDEX [IX_NightAuditPayments_AuditId] ON [NightAuditPayments] ([AuditId]);

CREATE INDEX [IX_NightAuditRevenueSummary_AuditId] ON [NightAuditRevenueSummary] ([AuditId]);

CREATE INDEX [IX_NightAuditRoomStatus_AuditId] ON [NightAuditRoomStatus] ([AuditId]);

CREATE INDEX [IX_NightAuditVariances_AuditId] ON [NightAuditVariances] ([AuditId]);

CREATE INDEX [IX_RoomTypeImages_RoomTypeId] ON [RoomTypeImages] ([RoomTypeId]);

ALTER TABLE [LostAndFounds] ADD CONSTRAINT [FK_LostAndFounds_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251017080751_AddRoomTypeImageTable', N'9.0.9');

ALTER TABLE [RoomTypes] ADD [BedType] nvarchar(50) NULL;

ALTER TABLE [RoomTypes] ADD [ChildRate] decimal(18,2) NULL;

ALTER TABLE [RoomTypes] ADD [ExtraBedAllowed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [RoomTypes] ADD [ExtraBedRate] decimal(18,2) NULL;

ALTER TABLE [RoomTypes] ADD [RoomSize] nvarchar(100) NULL;

ALTER TABLE [RoomTypes] ADD [ViewType] nvarchar(50) NULL;

ALTER TABLE [RoomTypeImages] ADD [RoomTypeId1] int NULL;

CREATE INDEX [IX_RoomTypeImages_RoomTypeId1] ON [RoomTypeImages] ([RoomTypeId1]);

ALTER TABLE [RoomTypeImages] ADD CONSTRAINT [FK_RoomTypeImages_RoomTypes_RoomTypeId1] FOREIGN KEY ([RoomTypeId1]) REFERENCES [RoomTypes] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251017140308_AddRoomTypeFieldsOnly', N'9.0.9');


                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_RoomTypeImages_RoomTypes_RoomTypeId1')
                BEGIN
                    ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [FK_RoomTypeImages_RoomTypes_RoomTypeId1]
                END
            


                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RoomTypeImages_RoomTypeId1')
                BEGIN
                    DROP INDEX [IX_RoomTypeImages_RoomTypeId1] ON [RoomTypeImages]
                END
            


                IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypeImages') AND name = 'RoomTypeId1')
                BEGIN
                    ALTER TABLE [RoomTypeImages] DROP COLUMN [RoomTypeId1]
                END
            

DECLARE @var668 sysname;
SELECT @var668 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'Width');
IF @var668 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var668 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [Width] int NULL;

DECLARE @var669 sysname;
SELECT @var669 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'UploadedAt');
IF @var669 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var669 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [UploadedAt] datetime2 NULL;

DECLARE @var670 sysname;
SELECT @var670 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'OriginalFileName');
IF @var670 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var670 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [OriginalFileName] nvarchar(255) NULL;

DECLARE @var671 sysname;
SELECT @var671 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'IsPrimary');
IF @var671 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var671 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [IsPrimary] bit NULL;

DECLARE @var672 sysname;
SELECT @var672 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'IsActive');
IF @var672 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var672 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [IsActive] bit NULL;

DECLARE @var673 sysname;
SELECT @var673 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'ImagePath');
IF @var673 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var673 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [ImagePath] nvarchar(255) NULL;

DECLARE @var674 sysname;
SELECT @var674 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'Height');
IF @var674 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var674 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [Height] int NULL;

DECLARE @var675 sysname;
SELECT @var675 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'FileSizeBytes');
IF @var675 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var675 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [FileSizeBytes] bigint NULL;

DECLARE @var676 sysname;
SELECT @var676 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypeImages]') AND [c].[name] = N'DisplayOrder');
IF @var676 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypeImages] DROP CONSTRAINT [' + @var676 + '];');
ALTER TABLE [RoomTypeImages] ALTER COLUMN [DisplayOrder] int NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251018071759_CheckPendingChanges', N'9.0.9');

CREATE TABLE [RoomBlocked] (
    [Id] int NOT NULL IDENTITY,
    [HotelId] int NOT NULL,
    [RoomTypeId] int NOT NULL,
    [RoomId] int NOT NULL,
    [BlockStartDate] datetime2 NOT NULL,
    [BlockEndDate] datetime2 NOT NULL,
    [BlockReason] nvarchar(200) NOT NULL,
    [BlockType] nvarchar(50) NOT NULL,
    [BlockedBy] nvarchar(100) NOT NULL,
    [BlockNotes] nvarchar(500) NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [UpdatedBy] nvarchar(100) NULL,
    CONSTRAINT [PK_RoomBlocked] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomBlocked_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]),
    CONSTRAINT [FK_RoomBlocked_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]),
    CONSTRAINT [FK_RoomBlocked_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id])
);

CREATE TABLE [RoomTax] (
    [Id] int NOT NULL IDENTITY,
    [HotelId] int NOT NULL,
    [RoomTypeId] int NOT NULL,
    [TaxName] nvarchar(100) NOT NULL,
    [TaxType] nvarchar(20) NOT NULL,
    [TaxValue] decimal(18,2) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [UpdatedBy] nvarchar(100) NULL,
    CONSTRAINT [PK_RoomTax] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomTax_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]),
    CONSTRAINT [FK_RoomTax_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id])
);

CREATE INDEX [IX_RoomBlocked_HotelId] ON [RoomBlocked] ([HotelId]);

CREATE INDEX [IX_RoomBlocked_RoomId] ON [RoomBlocked] ([RoomId]);

CREATE INDEX [IX_RoomBlocked_RoomTypeId] ON [RoomBlocked] ([RoomTypeId]);

CREATE INDEX [IX_RoomTax_HotelId] ON [RoomTax] ([HotelId]);

CREATE INDEX [IX_RoomTax_RoomTypeId] ON [RoomTax] ([RoomTypeId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251019104314_CreateRoomBlockedAndRoomTaxTables', N'9.0.9');

ALTER TABLE [Guests] ADD [DateOfBirth] datetime2 NULL;

ALTER TABLE [Guests] ADD [EmergencyContact] nvarchar(200) NULL;

ALTER TABLE [Guests] ADD [EmergencyPhone] nvarchar(50) NULL;

ALTER TABLE [Guests] ADD [Nationality] nvarchar(100) NULL;

ALTER TABLE [Guests] ADD [Occupation] nvarchar(200) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251025093615_AddGuestAdditionalFields', N'9.0.9');

CREATE TABLE [DiscountVouchers] (
    [Id] int NOT NULL IDENTITY,
    [VoucherCode] nvarchar(50) NOT NULL,
    [VoucherName] nvarchar(200) NOT NULL,
    [Description] nvarchar(500) NULL,
    [RoomTypeId] int NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [DiscountAmount] decimal(18,2) NOT NULL,
    [DiscountType] nvarchar(20) NULL,
    [DiscountPercentage] decimal(5,2) NULL,
    [MinimumAmount] decimal(18,2) NULL,
    [MaximumDiscount] decimal(18,2) NULL,
    [MaxUsageCount] int NULL,
    [UsedCount] int NOT NULL,
    [Status] nvarchar(20) NULL,
    [ApprovedBy] nvarchar(100) NULL,
    [Terms] nvarchar(500) NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_DiscountVouchers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DiscountVouchers_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_DiscountVouchers_RoomTypeId] ON [DiscountVouchers] ([RoomTypeId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251025174125_AddDiscountVoucherTable', N'9.0.9');

ALTER TABLE [Guests] ADD [PostalCode] nvarchar(20) NULL;

DECLARE @var677 sysname;
SELECT @var677 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DiscountVouchers]') AND [c].[name] = N'VoucherCode');
IF @var677 IS NOT NULL EXEC(N'ALTER TABLE [DiscountVouchers] DROP CONSTRAINT [' + @var677 + '];');
ALTER TABLE [DiscountVouchers] ALTER COLUMN [VoucherCode] nvarchar(50) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251029030203_AddPostalCodeToGuest', N'9.0.9');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251030013410_MakeFieldsNullable', N'9.0.9');

DECLARE @var678 sysname;
SELECT @var678 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'FirstName');
IF @var678 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var678 + '];');
ALTER TABLE [Guests] DROP COLUMN [FirstName];

DECLARE @var679 sysname;
SELECT @var679 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'LastName');
IF @var679 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var679 + '];');
ALTER TABLE [Guests] DROP COLUMN [LastName];

DECLARE @var680 sysname;
SELECT @var680 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'Phone');
IF @var680 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var680 + '];');
ALTER TABLE [Guests] DROP COLUMN [Phone];

DECLARE @var681 sysname;
SELECT @var681 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Guests]') AND [c].[name] = N'FullName');
IF @var681 IS NOT NULL EXEC(N'ALTER TABLE [Guests] DROP CONSTRAINT [' + @var681 + '];');
ALTER TABLE [Guests] ALTER COLUMN [FullName] nvarchar(200) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251030020056_UpdateGuestModelToMatchDatabase', N'9.0.9');

CREATE TABLE [GalleryCategories] (
    [CategoryID] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Subtitle] nvarchar(200) NULL,
    [Description] nvarchar(1000) NULL,
    [DisplayOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ModifiedBy] nvarchar(100) NULL,
    [ModifiedDate] datetime2 NULL,
    CONSTRAINT [PK_GalleryCategories] PRIMARY KEY ([CategoryID])
);

CREATE TABLE [Restaurants] (
    [RestaurantID] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Location] nvarchar(100) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [ImagePath] nvarchar(500) NULL,
    [Rating] decimal(3,2) NOT NULL,
    [PhoneNumber] nvarchar(50) NULL,
    [Email] nvarchar(100) NULL,
    [OpeningHours] nvarchar(200) NULL,
    [DisplayOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ModifiedBy] nvarchar(100) NULL,
    [ModifiedDate] datetime2 NULL,
    CONSTRAINT [PK_Restaurants] PRIMARY KEY ([RestaurantID])
);

CREATE TABLE [RoomGallery] (
    [RoomGalleryID] int NOT NULL IDENTITY,
    [RoomTypeID] int NOT NULL,
    [ImageName] nvarchar(255) NOT NULL,
    [ImagePath] nvarchar(500) NOT NULL,
    [ImageTitle] nvarchar(200) NULL,
    [ImageDescription] nvarchar(1000) NULL,
    [Category] nvarchar(100) NULL,
    [DisplayOrder] int NOT NULL,
    [IsMainImage] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ModifiedBy] nvarchar(100) NULL,
    [ModifiedDate] datetime2 NULL,
    [Location] nvarchar(100) NULL,
    [Rating] decimal(3,2) NULL,
    [Price] decimal(10,2) NULL,
    [IsSpicy] bit NULL,
    [IsVegetarian] bit NULL,
    [Cuisine] nvarchar(100) NULL,
    [SubCategory] nvarchar(100) NULL,
    CONSTRAINT [PK_RoomGallery] PRIMARY KEY ([RoomGalleryID]),
    CONSTRAINT [FK_RoomGallery_RoomTypes_RoomTypeID] FOREIGN KEY ([RoomTypeID]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GalleryItems] (
    [GalleryItemID] int NOT NULL IDENTITY,
    [CategoryID] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Subtitle] nvarchar(200) NULL,
    [Description] nvarchar(1000) NULL,
    [ImagePath] nvarchar(500) NOT NULL,
    [IsMainImage] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ModifiedBy] nvarchar(100) NULL,
    [ModifiedDate] datetime2 NULL,
    CONSTRAINT [PK_GalleryItems] PRIMARY KEY ([GalleryItemID]),
    CONSTRAINT [FK_GalleryItems_GalleryCategories_CategoryID] FOREIGN KEY ([CategoryID]) REFERENCES [GalleryCategories] ([CategoryID]) ON DELETE CASCADE
);

CREATE TABLE [MenuItems] (
    [MenuItemID] int NOT NULL IDENTITY,
    [RestaurantID] int NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [ImagePath] nvarchar(500) NULL,
    [Price] decimal(10,2) NOT NULL,
    [Rating] decimal(3,2) NOT NULL,
    [Category] nvarchar(100) NULL,
    [Cuisine] nvarchar(100) NULL,
    [IsSpicy] bit NOT NULL,
    [IsVegetarian] bit NOT NULL,
    [IsAvailable] bit NOT NULL,
    [DisplayOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ModifiedBy] nvarchar(100) NULL,
    [ModifiedDate] datetime2 NULL,
    CONSTRAINT [PK_MenuItems] PRIMARY KEY ([MenuItemID]),
    CONSTRAINT [FK_MenuItems_Restaurants_RestaurantID] FOREIGN KEY ([RestaurantID]) REFERENCES [Restaurants] ([RestaurantID]) ON DELETE CASCADE
);

CREATE INDEX [IX_GalleryItems_CategoryID] ON [GalleryItems] ([CategoryID]);

CREATE INDEX [IX_MenuItems_RestaurantID] ON [MenuItems] ([RestaurantID]);

CREATE INDEX [IX_RoomGallery_RoomTypeID] ON [RoomGallery] ([RoomTypeID]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251030201414_AddGalleryRestaurantTables', N'9.0.9');

DECLARE @var682 sysname;
SELECT @var682 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoomTypes]') AND [c].[name] = N'BaseRate');
IF @var682 IS NOT NULL EXEC(N'ALTER TABLE [RoomTypes] DROP CONSTRAINT [' + @var682 + '];');
ALTER TABLE [RoomTypes] ALTER COLUMN [BaseRate] decimal(18,2) NULL;

ALTER TABLE [RoomTypes] ADD [HotelId] int NULL;

ALTER TABLE [RoomTypes] ADD [MaximumAdults] int NULL;

ALTER TABLE [RoomTypes] ADD [MaximumChildren] int NULL;

ALTER TABLE [Hotels] ADD [CityId] int NULL;

CREATE TABLE [Cities] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Province] nvarchar(100) NULL,
    [Country] nvarchar(100) NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Cities] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_Hotels_CityId] ON [Hotels] ([CityId]);

CREATE INDEX [IX_RoomTypes_HotelId] ON [RoomTypes] ([HotelId]);

ALTER TABLE [Hotels] ADD CONSTRAINT [FK_Hotels_Cities_CityId] FOREIGN KEY ([CityId]) REFERENCES [Cities] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [RoomTypes] ADD CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE NO ACTION;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251228114612_AddCitiesAndHotelRoomTypeLinks', N'9.0.9');

ALTER TABLE [RoomRates] ADD [Days] nvarchar(100) NULL;

ALTER TABLE [RoomRates] ADD [DiscountRate] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [RoomRates] ADD [RateMonWed] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [RoomRates] ADD [RateSatSun] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [RoomRates] ADD [RateThuFri] decimal(18,2) NOT NULL DEFAULT 0.0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260102163311_AddRoomRatesTieredPricingAndDays', N'9.0.9');

ALTER TABLE [Reservations] ADD [HotelId] int NULL;

ALTER TABLE [Reservations] ADD [RoomTypeId] int NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105162808_AddHotelAndRoomTypeToReservations', N'9.0.9');

ALTER TABLE [Plans] ADD [HotelId] int NOT NULL DEFAULT 0;

UPDATE p
SET p.HotelId = h.Id
FROM Plans p
CROSS APPLY (
    SELECT TOP (1) Id
    FROM Hotels
    ORDER BY Id
) h
WHERE p.HotelId = 0

CREATE TABLE [PlanRoomTypes] (
    [Id] int NOT NULL IDENTITY,
    [PlanId] int NOT NULL,
    [RoomTypeId] int NOT NULL,
    CONSTRAINT [PK_PlanRoomTypes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PlanRoomTypes_Plans_PlanId] FOREIGN KEY ([PlanId]) REFERENCES [Plans] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PlanRoomTypes_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Plans_HotelId] ON [Plans] ([HotelId]);

CREATE INDEX [IX_PlanRoomTypes_PlanId] ON [PlanRoomTypes] ([PlanId]);

CREATE INDEX [IX_PlanRoomTypes_RoomTypeId] ON [PlanRoomTypes] ([RoomTypeId]);

ALTER TABLE [Plans] ADD CONSTRAINT [FK_Plans_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105195645_AddPlanHotelAndRoomTypeMapping2', N'9.0.9');

ALTER TABLE [TableMasters] ADD [HotelId] int NULL;

ALTER TABLE [RestaurantOrders] ADD [HotelId] int NULL;

ALTER TABLE [MenuManagements] ADD [HotelId] int NULL;

CREATE TABLE [SystemSettings] (
    [Id] int NOT NULL IDENTITY,
    [SettingKey] nvarchar(100) NOT NULL,
    [SettingValue] nvarchar(1000) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Category] nvarchar(50) NULL,
    [DataType] nvarchar(50) NULL,
    [IsEncrypted] bit NOT NULL,
    [IsUserEditable] bit NOT NULL,
    [CreatedBy] nvarchar(50) NULL,
    [UpdatedBy] nvarchar(50) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_SystemSettings] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260106173245_AddRestaurantHotelIdScope', N'9.0.9');

ALTER TABLE [RestaurantOrders] ADD [CheckInId] int NULL;

ALTER TABLE [RestaurantOrders] ADD [GuestId] int NULL;

ALTER TABLE [RestaurantOrders] ADD [GuestName] nvarchar(200) NULL;

ALTER TABLE [RestaurantOrders] ADD [RestaurantReservationId] int NULL;

CREATE TABLE [RestaurantTableReservations] (
    [Id] int NOT NULL IDENTITY,
    [HotelId] int NULL,
    [TableId] int NOT NULL,
    [GuestId] int NULL,
    [CheckInId] int NULL,
    [GuestName] nvarchar(200) NOT NULL,
    [GuestPhone] nvarchar(50) NOT NULL,
    [GuestEmail] nvarchar(100) NULL,
    [RoomNumber] nvarchar(50) NULL,
    [ReservationDateTime] datetime2 NOT NULL,
    [NumberOfGuests] int NOT NULL,
    [DurationHours] int NOT NULL,
    [Status] nvarchar(50) NULL,
    [AdvanceAmount] decimal(18,2) NOT NULL,
    [SpecialRequests] nvarchar(500) NULL,
    [IsCancelled] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_RestaurantTableReservations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RestaurantTableReservations_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]),
    CONSTRAINT [FK_RestaurantTableReservations_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]),
    CONSTRAINT [FK_RestaurantTableReservations_TableMasters_TableId] FOREIGN KEY ([TableId]) REFERENCES [TableMasters] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_RestaurantOrders_CheckInId] ON [RestaurantOrders] ([CheckInId]);

CREATE INDEX [IX_RestaurantOrders_GuestId] ON [RestaurantOrders] ([GuestId]);

CREATE INDEX [IX_RestaurantTableReservations_CheckInId] ON [RestaurantTableReservations] ([CheckInId]);

CREATE INDEX [IX_RestaurantTableReservations_GuestId] ON [RestaurantTableReservations] ([GuestId]);

CREATE INDEX [IX_RestaurantTableReservations_TableId] ON [RestaurantTableReservations] ([TableId]);

ALTER TABLE [RestaurantOrders] ADD CONSTRAINT [FK_RestaurantOrders_CheckInMasters_CheckInId] FOREIGN KEY ([CheckInId]) REFERENCES [CheckInMasters] ([Id]);

ALTER TABLE [RestaurantOrders] ADD CONSTRAINT [FK_RestaurantOrders_Guests_GuestId] FOREIGN KEY ([GuestId]) REFERENCES [Guests] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260106194241_AddRestaurantGuestAndTableReservations', N'9.0.9');

ALTER TABLE [OrderItems] DROP CONSTRAINT [FK_OrderItems_MenuManagements_MenuItemId];

DECLARE @var683 sysname;
SELECT @var683 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OrderItems]') AND [c].[name] = N'MenuItemId');
IF @var683 IS NOT NULL EXEC(N'ALTER TABLE [OrderItems] DROP CONSTRAINT [' + @var683 + '];');
ALTER TABLE [OrderItems] ALTER COLUMN [MenuItemId] int NULL;

ALTER TABLE [OrderItems] ADD [BarItemId] int NULL;

CREATE INDEX [IX_OrderItems_BarItemId] ON [OrderItems] ([BarItemId]);

ALTER TABLE [OrderItems] ADD CONSTRAINT [FK_OrderItems_BarManagements_BarItemId] FOREIGN KEY ([BarItemId]) REFERENCES [BarManagements] ([Id]);

ALTER TABLE [OrderItems] ADD CONSTRAINT [FK_OrderItems_MenuManagements_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuManagements] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260107091436_AddBarItemToOrderItems', N'9.0.9');

COMMIT;
GO

