using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Services
{
    public class DataSeedingService
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DataSeedingService> _logger;

        public DataSeedingService(HotelDbContext context, ILogger<DataSeedingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedAllDataAsync()
        {
            try
            {
                _logger.LogInformation("Starting comprehensive data seeding...");

                await SeedHotelsAsync();
                await SeedRestaurantTablesAsync();
                await SeedPosSettingsAsync();
                await SeedBarItemsAsync();
                await SeedRestaurantDemoReservationsAsync();
                await SeedRestaurantDemoOrdersAsync();
                await SeedRoomTypesAsync();
                await SeedRoomsAsync();
                await SeedCurrenciesAsync();
                await SeedSuppliersAsync();
                await SeedGuestsAsync();
                await SeedCheckInsAsync();
                await SeedEmployeesAsync();
                await SeedMenuItemsAsync();
                await SeedInventoryItemsAsync();
                await SeedRoomAmenitiesAsync();
                await SeedCustomersAsync();

                _logger.LogInformation("Data seeding completed successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data seeding");
                throw;
            }
        }

        private async Task SeedPosSettingsAsync()
        {
            try
            {
                if (!await _context.SystemSettings.AnyAsync(s => s.SettingKey == "POS_TAX_PERCENT" && s.IsActive))
                {
                    _context.SystemSettings.Add(new SystemSetting
                    {
                        SettingKey = "POS_TAX_PERCENT",
                        SettingValue = "10",
                        Description = "POS tax percentage",
                        Category = "Restaurant",
                        DataType = "number",
                        IsEncrypted = false,
                        IsUserEditable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                if (!await _context.SystemSettings.AnyAsync(s => s.SettingKey == "POS_SERVICE_CHARGE_PERCENT" && s.IsActive))
                {
                    _context.SystemSettings.Add(new SystemSetting
                    {
                        SettingKey = "POS_SERVICE_CHARGE_PERCENT",
                        SettingValue = "5",
                        Description = "POS service charge percentage",
                        Category = "Restaurant",
                        DataType = "number",
                        IsEncrypted = false,
                        IsUserEditable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding POS settings (continuing startup)");
            }
        }

        private async Task SeedBarItemsAsync()
        {
            try
            {
                if (!await _context.BarManagements.AnyAsync())
                {
                    var now = DateTime.UtcNow;
                    var drinks = new List<BarManagement>
                    {
                        new BarManagement { DrinkName = "Mineral Water", DrinkCode = "DRK001", Description = "Chilled mineral water", Category = "Soft", Price = 80, CostPrice = 40, IsAlcoholic = false, AlcoholContent = 0, Brand = "Nestle", Ingredients = "Water", ImagePath = "", ServingSize = "500ml", DisplayOrder = 1, IsAvailable = true, IsHappyHourItem = false, HappyHourPrice = 0, IsActive = true, CreatedAt = now, UpdatedAt = now },
                        new BarManagement { DrinkName = "Coca Cola", DrinkCode = "DRK002", Description = "Cold soft drink", Category = "Soft", Price = 150, CostPrice = 90, IsAlcoholic = false, AlcoholContent = 0, Brand = "Coke", Ingredients = "Carbonated water, sugar", ImagePath = "", ServingSize = "330ml", DisplayOrder = 2, IsAvailable = true, IsHappyHourItem = false, HappyHourPrice = 0, IsActive = true, CreatedAt = now, UpdatedAt = now },
                        new BarManagement { DrinkName = "Fresh Lime", DrinkCode = "DRK003", Description = "Fresh lime with soda", Category = "Mocktail", Price = 220, CostPrice = 120, IsAlcoholic = false, AlcoholContent = 0, Brand = "House", Ingredients = "Lime, soda, sugar", ImagePath = "", ServingSize = "Glass", DisplayOrder = 3, IsAvailable = true, IsHappyHourItem = true, HappyHourPrice = 200, IsActive = true, CreatedAt = now, UpdatedAt = now },
                        new BarManagement { DrinkName = "Mint Margarita", DrinkCode = "DRK004", Description = "Mint margarita (non-alcoholic)", Category = "Mocktail", Price = 260, CostPrice = 140, IsAlcoholic = false, AlcoholContent = 0, Brand = "House", Ingredients = "Mint, lemon, soda", ImagePath = "", ServingSize = "Glass", DisplayOrder = 4, IsAvailable = true, IsHappyHourItem = true, HappyHourPrice = 230, IsActive = true, CreatedAt = now, UpdatedAt = now },
                        new BarManagement { DrinkName = "Espresso", DrinkCode = "DRK005", Description = "Single shot espresso", Category = "Coffee", Price = 250, CostPrice = 140, IsAlcoholic = false, AlcoholContent = 0, Brand = "House", Ingredients = "Coffee beans", ImagePath = "", ServingSize = "Cup", DisplayOrder = 5, IsAvailable = true, IsHappyHourItem = false, HappyHourPrice = 0, IsActive = true, CreatedAt = now, UpdatedAt = now }
                    };

                    _context.BarManagements.AddRange(drinks);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding bar items (continuing startup)");
            }
        }

        private async Task SeedRestaurantDemoReservationsAsync()
        {
            try
            {
                var activeHotelId = await _context.Hotels
                    .Where(h => h.IsActive)
                    .OrderBy(h => h.Id)
                    .Select(h => h.Id)
                    .FirstOrDefaultAsync();

                if (activeHotelId <= 0)
                    return;

                var tables = await _context.TableMasters
                    .Where(t => t.IsActive && t.HotelId == activeHotelId)
                    .OrderBy(t => t.Id)
                    .Take(3)
                    .ToListAsync();

                if (!tables.Any())
                    return;

                // Only seed if none exist yet
                if (!await _context.RestaurantTableReservations.AnyAsync(r => r.HotelId == activeHotelId && r.IsActive))
                {
                    var now = DateTime.UtcNow;
                    _context.RestaurantTableReservations.AddRange(
                        new RestaurantTableReservation
                        {
                            HotelId = activeHotelId,
                            TableId = tables[0].Id,
                            GuestName = "Walk-in Guest",
                            GuestPhone = "+92-300-1112233",
                            GuestEmail = "walkin@example.com",
                            RoomNumber = "",
                            ReservationDateTime = now.Date.AddHours(19),
                            NumberOfGuests = 2,
                            DurationHours = 2,
                            Status = "Confirmed",
                            AdvanceAmount = 0,
                            SpecialRequests = "",
                            IsCancelled = false,
                            IsActive = true,
                            CreatedAt = now,
                            UpdatedAt = now
                        },
                        new RestaurantTableReservation
                        {
                            HotelId = activeHotelId,
                            TableId = tables.Count > 1 ? tables[1].Id : tables[0].Id,
                            GuestName = "Family Booking",
                            GuestPhone = "+92-321-5557788",
                            GuestEmail = "family@example.com",
                            RoomNumber = "",
                            ReservationDateTime = now.Date.AddHours(20),
                            NumberOfGuests = 5,
                            DurationHours = 2,
                            Status = "Confirmed",
                            AdvanceAmount = 500,
                            SpecialRequests = "Window seat",
                            IsCancelled = false,
                            IsActive = true,
                            CreatedAt = now,
                            UpdatedAt = now
                        }
                    );

                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding restaurant table reservations (continuing startup)");
            }
        }

        private async Task SeedRestaurantDemoOrdersAsync()
        {
            try
            {
                var activeHotelId = await _context.Hotels
                    .Where(h => h.IsActive)
                    .OrderBy(h => h.Id)
                    .Select(h => h.Id)
                    .FirstOrDefaultAsync();

                if (activeHotelId <= 0)
                    return;

                var anyOrders = await _context.RestaurantOrders.AnyAsync(o => o.IsActive && o.HotelId == activeHotelId);
                if (anyOrders)
                    return;

                var table = await _context.TableMasters.FirstOrDefaultAsync(t => t.IsActive && t.HotelId == activeHotelId);
                var menu = await _context.MenuManagements.Where(m => m.IsActive && m.HotelId == activeHotelId).OrderBy(m => m.Id).Take(2).ToListAsync();
                if (table == null || menu.Count == 0)
                    return;

                var now = DateTime.UtcNow;
                var order = new RestaurantOrder
                {
                    HotelId = activeHotelId,
                    TableId = table.Id,
                    OrderType = "Dine-in",
                    Status = "Pending",
                    PaymentStatus = "Pending",
                    OrderNumber = $"ORD{DateTime.Now:yyyyMMdd}DEMO",
                    OrderDate = now,
                    SpecialInstructions = "Demo order",
                    GuestName = "Demo Guest",
                    SubTotal = 0,
                    TaxAmount = 0,
                    ServiceCharge = 0,
                    DiscountAmount = 0,
                    TotalAmount = 0,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                _context.RestaurantOrders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var m in menu)
                {
                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.Id,
                        MenuItemId = m.Id,
                        Quantity = 1,
                        UnitPrice = m.Price,
                        TotalPrice = m.Price,
                        Status = "Ordered",
                        SpecialInstructions = "",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    });
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding demo restaurant orders (continuing startup)");
            }
        }

        private async Task SeedCheckInsAsync()
        {
            try
            {
                // Ensure guests + rooms exist
                if (!await _context.Guests.AnyAsync() || !await _context.Rooms.AnyAsync())
                    return;

                // If already seeded, skip
                if (await _context.CheckInMasters.AnyAsync(c => c.IsActive && c.Status == "Active"))
                    return;

                var guests = await _context.Guests.Where(g => g.IsActive).OrderBy(g => g.Id).Take(3).ToListAsync();
                var rooms = await _context.Rooms.Where(r => r.IsActive).OrderBy(r => r.Id).Take(3).ToListAsync();
                if (!guests.Any() || !rooms.Any())
                    return;

                var now = DateTime.UtcNow;
                var checkIns = new List<CheckInMaster>();

                for (var i = 0; i < Math.Min(guests.Count, rooms.Count); i++)
                {
                    checkIns.Add(new CheckInMaster
                    {
                        CheckInNumber = $"CHK{DateTime.UtcNow:yyyyMMdd}{(i + 1).ToString("D3")}",
                        ReservationId = null,
                        GuestId = guests[i].Id,
                        RoomId = rooms[i].Id,
                        CheckInDate = now.AddHours(-2),
                        ExpectedCheckOutDate = now.AddDays(2),
                        NumberOfGuests = 2,
                        RoomRate = 12000,
                        TotalAmount = 24000,
                        AdvancePaid = 5000,
                        Status = "Active",
                        SpecialRequests = "",
                        CheckedInBy = "System",
                        Remarks = "Demo active check-in for Room Service",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    });
                }

                _context.CheckInMasters.AddRange(checkIns);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding CheckInMasters (continuing startup)");
            }
        }

        private async Task SeedHotelsAsync()
        {
            if (!await _context.Hotels.AnyAsync())
            {
                var hotels = new List<Hotel>
                {
                    new Hotel 
                    { 
                        HotelName = "Pearl Continental Hotel Karachi",
                        HotelCode = "PC-KHI-001",
                        Address = "Club Road, Karachi",
                        City = "Karachi",
                        State = "Sindh",
                        Country = "Pakistan",
                        PostalCode = "75530",
                        PhoneNumber = "+92-21-111-505-505",
                        Email = "info@pckarachi.com",
                        Website = "https://www.pchotels.com",
                        GSTNumber = "GST-001-PC-KHI",
                        PANNumber = "PAN-001-PC-KHI",
                        LicenseNumber = "LIC-001-PC-KHI",
                        ManagerName = "Ahmed Hassan",
                        ManagerPhone = "+92-300-1234567",
                        ManagerEmail = "manager@pckarachi.com",
                        TotalRooms = 350,
                        TotalFloors = 15,
                        EstablishedDate = new DateTime(1985, 6, 15),
                        StarRating = "5 Star",
                        Description = "Luxury 5-star hotel in the heart of Karachi with world-class amenities",
                        IsMainBranch = true,
                        Currency = "PKR",
                        TimeZone = "Asia/Karachi",
                        IsActive = true, 
                        CreatedAt = DateTime.UtcNow, 
                        UpdatedAt = DateTime.UtcNow 
                    },
                    new Hotel 
                    { 
                        HotelName = "Serena Hotel Islamabad",
                        HotelCode = "SER-ISB-001",
                        Address = "Khayaban-e-Suharwardy, Islamabad",
                        City = "Islamabad",
                        State = "Federal Capital Territory",
                        Country = "Pakistan",
                        PostalCode = "44000",
                        PhoneNumber = "+92-51-287-4000",
                        Email = "islamabad@serenahotels.com",
                        Website = "https://www.serenahotels.com",
                        GSTNumber = "GST-002-SER-ISB",
                        PANNumber = "PAN-002-SER-ISB",
                        LicenseNumber = "LIC-002-SER-ISB",
                        ManagerName = "Fatima Khan",
                        ManagerPhone = "+92-300-9876543",
                        ManagerEmail = "manager@serenaislamabad.com",
                        TotalRooms = 387,
                        TotalFloors = 12,
                        EstablishedDate = new DateTime(1990, 3, 20),
                        StarRating = "5 Star",
                        Description = "Premium hotel with modern amenities in the capital city",
                        IsMainBranch = false,
                        Currency = "PKR",
                        TimeZone = "Asia/Karachi",
                        IsActive = true, 
                        CreatedAt = DateTime.UtcNow, 
                        UpdatedAt = DateTime.UtcNow 
                    },
                    new Hotel 
                    { 
                        HotelName = "Avari Hotel Lahore",
                        HotelCode = "AVR-LHR-001",
                        Address = "87 Shahrah-e-Quaid-e-Azam, Lahore",
                        City = "Lahore",
                        State = "Punjab",
                        Country = "Pakistan",
                        PostalCode = "54000",
                        PhoneNumber = "+92-42-3636-2200",
                        Email = "lahore@avarihotels.com",
                        Website = "https://www.avarihotels.com",
                        GSTNumber = "GST-003-AVR-LHR",
                        PANNumber = "PAN-003-AVR-LHR",
                        LicenseNumber = "LIC-003-AVR-LHR",
                        ManagerName = "Ali Raza",
                        ManagerPhone = "+92-300-5555555",
                        ManagerEmail = "manager@avarilahore.com",
                        TotalRooms = 180,
                        TotalFloors = 8,
                        EstablishedDate = new DateTime(1975, 12, 10),
                        StarRating = "4 Star",
                        Description = "Historic luxury hotel in the cultural capital of Pakistan",
                        IsMainBranch = false,
                        Currency = "PKR",
                        TimeZone = "Asia/Karachi",
                        IsActive = true, 
                        CreatedAt = DateTime.UtcNow, 
                        UpdatedAt = DateTime.UtcNow 
                    },
                    new Hotel 
                    { 
                        HotelName = "Marriott Hotel Karachi",
                        HotelCode = "MAR-KHI-001",
                        Address = "9 Abdullah Haroon Road, Karachi",
                        City = "Karachi",
                        State = "Sindh",
                        Country = "Pakistan",
                        PostalCode = "75530",
                        PhoneNumber = "+92-21-3568-0000",
                        Email = "karachi@marriott.com",
                        Website = "https://www.marriott.com",
                        GSTNumber = "GST-004-MAR-KHI",
                        PANNumber = "PAN-004-MAR-KHI",
                        LicenseNumber = "LIC-004-MAR-KHI",
                        ManagerName = "Sarah Ahmed",
                        ManagerPhone = "+92-300-7777777",
                        ManagerEmail = "manager@marriottkarachi.com",
                        TotalRooms = 285,
                        TotalFloors = 18,
                        EstablishedDate = new DateTime(2003, 8, 25),
                        StarRating = "5 Star",
                        Description = "International luxury hotel chain with premium services",
                        IsMainBranch = false,
                        Currency = "PKR",
                        TimeZone = "Asia/Karachi",
                        IsActive = true, 
                        CreatedAt = DateTime.UtcNow, 
                        UpdatedAt = DateTime.UtcNow 
                    },
                    new Hotel 
                    { 
                        HotelName = "Ramada Plaza Karachi",
                        HotelCode = "RAM-KHI-001",
                        Address = "Airport Road, Karachi",
                        City = "Karachi",
                        State = "Sindh",
                        Country = "Pakistan",
                        PostalCode = "75400",
                        PhoneNumber = "+92-21-111-123-456",
                        Email = "info@ramadakarachi.com",
                        Website = "https://www.ramadakarachi.com",
                        GSTNumber = "GST-005-RAM-KHI",
                        PANNumber = "PAN-005-RAM-KHI",
                        LicenseNumber = "LIC-005-RAM-KHI",
                        ManagerName = "Muhammad Tariq",
                        ManagerPhone = "+92-300-8888888",
                        ManagerEmail = "manager@ramadakarachi.com",
                        TotalRooms = 150,
                        TotalFloors = 10,
                        EstablishedDate = new DateTime(2010, 4, 15),
                        StarRating = "4 Star",
                        Description = "Business hotel near Karachi Airport with modern facilities",
                        IsMainBranch = false,
                        Currency = "PKR",
                        TimeZone = "Asia/Karachi",
                        IsActive = false, 
                        CreatedAt = DateTime.UtcNow, 
                        UpdatedAt = DateTime.UtcNow 
                    }
                };

                _context.Hotels.AddRange(hotels);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Seeded {hotels.Count} hotels successfully");
            }
        }

        private async Task SeedRestaurantTablesAsync()
        {
            try
            {
                var activeHotels = await _context.Hotels
                    .Where(h => h.IsActive)
                    .OrderBy(h => h.Id)
                    .Select(h => h.Id)
                    .ToListAsync();

                if (!activeHotels.Any())
                    return;

                var now = DateTime.UtcNow;
                foreach (var hotelId in activeHotels)
                {
                    var count = await _context.TableMasters.CountAsync(t => t.IsActive && t.HotelId == hotelId);
                    if (count >= 12)
                        continue;

                    var start = count + 1;
                    var toAdd = new List<TableMaster>();
                    for (var i = start; i <= 12; i++)
                    {
                        var num = i.ToString("D2");
                        toAdd.Add(new TableMaster
                        {
                            HotelId = hotelId,
                            TableNumber = $"T{num}",
                            TableCode = $"T{num}",
                            Capacity = i % 3 == 0 ? 6 : (i % 2 == 0 ? 4 : 2),
                            Location = i <= 6 ? "Restaurant" : "VIP",
                            TableType = i <= 6 ? "Standard" : "VIP",
                            Shape = i % 2 == 0 ? "Square" : "Round",
                            Description = "",
                            Features = "",
                            IsReservable = true,
                            HasView = i % 4 == 0,
                            MinOrderAmount = 0,
                            Status = "Available",
                            FloorNumber = 1,
                            IsActive = true,
                            CreatedAt = now,
                            UpdatedAt = now
                        });
                    }

                    if (toAdd.Any())
                        _context.TableMasters.AddRange(toAdd);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding restaurant tables (continuing startup)");
            }
        }

        private async Task SeedRoomTypesAsync()
        {
            if (!await _context.RoomTypes.AnyAsync())
            {
                var roomTypes = new List<RoomType>
                {
                    new RoomType { Name = "Standard Single", Code = "STD-S", BaseRate = 8000, MaxOccupancy = 1, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new RoomType { Name = "Deluxe Double", Code = "DLX-D", BaseRate = 12000, MaxOccupancy = 2, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new RoomType { Name = "Executive Suite", Code = "EXE-S", BaseRate = 25000, MaxOccupancy = 4, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.RoomTypes.AddRange(roomTypes);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Seeded {roomTypes.Count} room types successfully");
            }
        }

        private async Task SeedRoomsAsync()
        {
            if (!await _context.Rooms.AnyAsync())
            {
                // First ensure we have room types
                var roomTypes = await _context.RoomTypes.ToListAsync();
                if (!roomTypes.Any())
                {
                    _logger.LogWarning("No room types found. Cannot seed rooms without room types.");
                    return;
                }

                var rooms = new List<Room>();
                var roomNumber = 101;

                foreach (var roomType in roomTypes)
                {
                    // Create 5 rooms for each room type
                    for (int i = 0; i < 5; i++)
                    {
                        rooms.Add(new Room
                        {
                            RoomNumber = roomNumber.ToString(),
                            RoomTypeId = roomType.Id,
                            FloorNumber = (roomNumber / 100),
                            Status = "Available",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        });
                        roomNumber++;
                    }
                }

                _context.Rooms.AddRange(rooms);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Seeded {rooms.Count} rooms successfully");
            }
        }

        private async Task SeedCurrenciesAsync()
        {
            if (!await _context.Currencies.AnyAsync())
            {
                var currencies = new List<Currency>
                {
                    new Currency { Name = "Pakistani Rupee", Code = "PKR", Symbol = "Rs", ExchangeRate = 1.0m, IsBaseCurrency = true, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new Currency { Name = "US Dollar", Code = "USD", Symbol = "$", ExchangeRate = 0.0036m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new Currency { Name = "Euro", Code = "EUR", Symbol = "€", ExchangeRate = 0.0033m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.Currencies.AddRange(currencies);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedSuppliersAsync()
        {
            if (!await _context.Suppliers.AnyAsync())
            {
                var suppliers = new List<Supplier>
                {
                    new Supplier { Name = "Metro Cash & Carry", Code = "MCC", ContactPerson = "Ahmed Khan", Phone = "+92-21-111-638-76", Email = "info@metro.pk", Address = "Karachi", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new Supplier { Name = "Unilever Pakistan", Code = "UNI", ContactPerson = "Sarah Ali", Phone = "+92-21-111-486-453", Email = "contact@unilever.pk", Address = "Karachi", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.Suppliers.AddRange(suppliers);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedGuestsAsync()
        {
            if (!await _context.Guests.AnyAsync())
            {
                var guests = new List<Guest>
                {
                    new Guest { FirstName = "Muhammad", LastName = "Ahmad", Email = "ahmad@email.com", Phone = "+92-300-1234567", Address = "Lahore", City = "Lahore", Country = "Pakistan", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new Guest { FirstName = "Fatima", LastName = "Khan", Email = "fatima@email.com", Phone = "+92-321-7654321", Address = "Islamabad", City = "Islamabad", Country = "Pakistan", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.Guests.AddRange(guests);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedEmployeesAsync()
        {
            if (!await _context.Employees.AnyAsync())
            {
                var employees = new List<Employee>
                {
                    new Employee { EmployeeCode = "EMP001", FirstName = "Ali", LastName = "Hassan", Department = "Front Office", Position = "Manager", BasicSalary = 50000, Status = "Active", PhoneNumber = "+92-300-1111111", MobileNumber = "+92-300-1111111", Email = "ali.hassan@hotelerp.com", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new Employee { EmployeeCode = "EMP002", FirstName = "Aisha", LastName = "Malik", Department = "Housekeeping", Position = "Supervisor", BasicSalary = 35000, Status = "Active", PhoneNumber = "+92-321-2222222", MobileNumber = "+92-321-2222222", Email = "aisha.malik@hotelerp.com", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.Employees.AddRange(employees);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedMenuItemsAsync()
        {
            try
            {
                if (!await _context.MenuManagements.AnyAsync())
                {
                    var hotelId = await _context.Hotels
                        .Where(h => h.IsActive)
                        .OrderBy(h => h.Id)
                        .Select(h => (int?)h.Id)
                        .FirstOrDefaultAsync();

                    if (!hotelId.HasValue)
                    {
                        return;
                    }

                    var now = DateTime.UtcNow;
                    var menuItems = new List<MenuManagement>
                    {
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "BRY001", MenuName = "Chicken Biryani", MenuType = "Lunch", Category = "Main Course", Price = 450, Cuisine = "Pakistani", Description = "Delicious chicken biryani with aromatic spices", IsVegetarian = false, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "No", Ingredients = "Basmati rice, chicken, yogurt, spices", CreatedAt = now, UpdatedAt = now },
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "KRH001", MenuName = "Chicken Karahi", MenuType = "Dinner", Category = "Main Course", Price = 650, Cuisine = "Pakistani", Description = "Traditional chicken karahi cooked in tomato gravy", IsVegetarian = false, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "Yes", Ingredients = "Chicken, tomatoes, green chilies, ginger, spices", CreatedAt = now, UpdatedAt = now },
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "PLV001", MenuName = "Chicken Pulao", MenuType = "Lunch", Category = "Main Course", Price = 400, Cuisine = "Pakistani", Description = "Traditional pulao with tender chicken", IsVegetarian = false, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "No", Ingredients = "Rice, chicken, spices", CreatedAt = now, UpdatedAt = now },
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "KBB001", MenuName = "Beef Kebab", MenuType = "Dinner", Category = "BBQ", Price = 320, Cuisine = "Pakistani", Description = "Smoky beef seekh kebab", IsVegetarian = false, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "Yes", Ingredients = "Beef, spices", CreatedAt = now, UpdatedAt = now },
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "NGT001", MenuName = "Naan/Garlic Naan", MenuType = "Dinner", Category = "Bread", Price = 80, Cuisine = "Pakistani", Description = "Fresh tandoori naan", IsVegetarian = true, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "No", Ingredients = "Flour, yeast, garlic", CreatedAt = now, UpdatedAt = now },
                        new MenuManagement { HotelId = hotelId.Value, MenuCode = "TCH001", MenuName = "Tea (Doodh Patti)", MenuType = "Breakfast", Category = "Beverages", Price = 120, Cuisine = "Pakistani", Description = "Strong milk tea", IsVegetarian = true, IsHalal = true, IsAvailable = true, IsActive = true, ChefSpecial = "No", Ingredients = "Tea, milk", CreatedAt = now, UpdatedAt = now }
                    };

                    _context.MenuManagements.AddRange(menuItems);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding menu items (continuing startup)");
            }
        }

        private async Task SeedInventoryItemsAsync()
        {
            if (!await _context.ItemMasters.AnyAsync())
            {
                var items = new List<ItemMaster>
                {
                    new ItemMaster { Name = "Basmati Rice", Code = "RICE001", Category = "Food", Unit = "KG", PurchasePrice = 180, SalePrice = 200, CurrentStock = 100, MinStockLevel = 20, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new ItemMaster { Name = "Chicken", Code = "CHK001", Category = "Food", Unit = "KG", PurchasePrice = 320, SalePrice = 350, CurrentStock = 50, MinStockLevel = 10, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.ItemMasters.AddRange(items);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedRoomAmenitiesAsync()
        {
            if (!await _context.RoomAmenities.AnyAsync())
            {
                var amenities = new List<RoomAmenities>
                {
                    new RoomAmenities { AmenityCode = "AC001", AmenityName = "Air Conditioning", Category = "Comfort", IsChargeable = false, IsAvailable = true, DisplayOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new RoomAmenities { AmenityCode = "WIFI001", AmenityName = "Free WiFi", Category = "Technology", IsChargeable = false, IsAvailable = true, DisplayOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.RoomAmenities.AddRange(amenities);
                await _context.SaveChangesAsync();
            }
        }

        private async Task SeedCustomersAsync()
        {
            if (!await _context.CustomerDatabases.AnyAsync())
            {
                var customers = new List<CustomerDatabase>
                {
                    new CustomerDatabase { CustomerCode = "CUST001", FirstName = "Hassan", LastName = "Ali", Email = "hassan@email.com", PhoneNumber = "+92-300-1111111", City = "Karachi", Country = "Pakistan", Occupation = "Unknown", CustomerSegment = "VIP", FirstVisit = DateTime.UtcNow.AddMonths(-6), TotalVisits = 5, TotalSpent = 125000, AverageSpending = 25000, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new CustomerDatabase { CustomerCode = "CUST002", FirstName = "Zainab", LastName = "Sheikh", Email = "zainab@email.com", PhoneNumber = "+92-321-2222222", City = "Lahore", Country = "Pakistan", Occupation = "Unknown", CustomerSegment = "Regular", FirstVisit = DateTime.UtcNow.AddMonths(-3), TotalVisits = 3, TotalSpent = 75000, AverageSpending = 25000, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                };

                _context.CustomerDatabases.AddRange(customers);
                await _context.SaveChangesAsync();
            }
        }
    }
}
