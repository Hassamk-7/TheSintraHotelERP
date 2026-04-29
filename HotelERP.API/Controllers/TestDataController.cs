using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class TestDataController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<TestDataController> _logger;

        public TestDataController(HotelDbContext context, ILogger<TestDataController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("seed-hotels")]
        public async Task<IActionResult> SeedHotelsOnly()
        {
            try
            {
                // Check if hotels already exist
                var existingHotelsCount = await _context.Hotels.CountAsync();
                if (existingHotelsCount > 0)
                {
                    return Ok(new { success = true, message = "Hotels already exist", count = existingHotelsCount });
                }

                // Add just one hotel with minimal required fields
                var hotel = new Hotel
                {
                    HotelName = "Test Hotel Karachi",
                    HotelCode = "TEST-001",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Hotels.Add(hotel);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = "Hotel seeded successfully",
                    data = hotel
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding hotel");
                return StatusCode(500, new { success = false, message = "Error seeding hotel: " + ex.Message, innerException = ex.InnerException?.Message });
            }
        }

        [HttpPost("seed-all")]
        public async Task<IActionResult> SeedAllMasterData()
        {
            try
            {
                var results = new Dictionary<string, int>();

                // Seed Currencies (5 records)
                if (!await _context.Currencies.AnyAsync())
                {
                    var currencies = new List<Currency>
                    {
                        new Currency { Name = "Pakistani Rupee", Code = "PKR", Symbol = "Rs", ExchangeRate = 1.00m, IsBaseCurrency = true, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Currency { Name = "US Dollar", Code = "USD", Symbol = "$", ExchangeRate = 280.50m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Currency { Name = "Euro", Code = "EUR", Symbol = "€", ExchangeRate = 305.75m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Currency { Name = "British Pound", Code = "GBP", Symbol = "£", ExchangeRate = 355.25m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Currency { Name = "Saudi Riyal", Code = "SAR", Symbol = "﷼", ExchangeRate = 74.80m, IsBaseCurrency = false, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                    };
                    _context.Currencies.AddRange(currencies);
                    await _context.SaveChangesAsync();
                    results["Currencies"] = currencies.Count;
                }

                // Seed Suppliers (8 records)
                if (!await _context.Suppliers.AnyAsync())
                {
                    var suppliers = new List<Supplier>
                    {
                        new Supplier { Name = "Metro Food Suppliers", Code = "MFS-001", ContactPerson = "Ahmed Ali", Email = "ahmed@metrofood.pk", Phone = "+92-21-1234567", Mobile = "+92-300-1111111", Address = "Industrial Area, Karachi", City = "Karachi", Country = "Pakistan", TaxNumber = "TAX-001-MFS", Notes = "Premium food supplier", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "Gul Ahmed Textile", Code = "GAT-002", ContactPerson = "Sarah Khan", Email = "sarah@gulahmad.com", Phone = "+92-21-2345678", Mobile = "+92-301-2222222", Address = "Korangi Industrial Area", City = "Karachi", Country = "Pakistan", TaxNumber = "TAX-002-GAT", Notes = "Bed sheets and towels", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "Dawlance Electronics", Code = "DAW-003", ContactPerson = "Hassan Sheikh", Email = "hassan@dawlance.com", Phone = "+92-42-3456789", Mobile = "+92-302-3333333", Address = "Industrial Estate, Lahore", City = "Lahore", Country = "Pakistan", TaxNumber = "TAX-003-DAW", Notes = "Hotel appliances supplier", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "National Foods", Code = "NF-004", ContactPerson = "Fatima Malik", Email = "fatima@nationalfoods.pk", Phone = "+92-21-4567890", Mobile = "+92-303-4444444", Address = "SITE Area, Karachi", City = "Karachi", Country = "Pakistan", TaxNumber = "TAX-004-NF", Notes = "Spices and food items", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "Pak Suzuki Motors", Code = "PSM-005", ContactPerson = "Ali Raza", Email = "ali@paksuzuki.com", Phone = "+92-21-5678901", Mobile = "+92-304-5555555", Address = "Port Qasim, Karachi", City = "Karachi", Country = "Pakistan", TaxNumber = "TAX-005-PSM", Notes = "Hotel transport vehicles", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "Shezan International", Code = "SHZ-006", ContactPerson = "Zara Ahmed", Email = "zara@shezan.com", Phone = "+92-42-6789012", Mobile = "+92-305-6666666", Address = "Gulberg, Lahore", City = "Lahore", Country = "Pakistan", TaxNumber = "TAX-006-SHZ", Notes = "Beverages and juices", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "Interwood Mobel", Code = "IWM-007", ContactPerson = "Omar Khan", Email = "omar@interwood.pk", Phone = "+92-51-7890123", Mobile = "+92-306-7777777", Address = "Blue Area, Islamabad", City = "Islamabad", Country = "Pakistan", TaxNumber = "TAX-007-IWM", Notes = "Hotel furniture supplier", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new Supplier { Name = "K&N's Food Services", Code = "KNS-008", ContactPerson = "Nadia Qureshi", Email = "nadia@kns.com.pk", Phone = "+92-21-8901234", Mobile = "+92-307-8888888", Address = "Clifton, Karachi", City = "Karachi", Country = "Pakistan", TaxNumber = "TAX-008-KNS", Notes = "Ready-to-eat food items", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                    };
                    _context.Suppliers.AddRange(suppliers);
                    await _context.SaveChangesAsync();
                    results["Suppliers"] = suppliers.Count;
                }

                // Seed Guest Masters (10 records)
                if (!await _context.GuestMasters.AnyAsync())
                {
                    var guests = new List<GuestMaster>
                    {
                        new GuestMaster { FirstName = "Ahmed", LastName = "Hassan", GuestCode = "GUEST-001", PhoneNumber = "+92-300-1234567", Email = "ahmed.hassan@email.com", Address = "DHA Phase 5, Karachi", City = "Karachi", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-1234567-1", DateOfBirth = new DateTime(1985, 5, 15), Gender = "Male", Nationality = "Pakistani", Company = "Tech Solutions Ltd", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Fatima", LastName = "Khan", GuestCode = "GUEST-002", PhoneNumber = "+92-301-2345678", Email = "fatima.khan@email.com", Address = "F-7 Islamabad", City = "Islamabad", Country = "Pakistan", IdType = "CNIC", IdNumber = "61101-2345678-2", DateOfBirth = new DateTime(1990, 8, 22), Gender = "Female", Nationality = "Pakistani", Company = "Marketing Agency", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "John", LastName = "Smith", GuestCode = "GUEST-003", PhoneNumber = "+1-555-123-4567", Email = "john.smith@email.com", Address = "123 Main St, New York", City = "New York", Country = "USA", IdType = "Passport", IdNumber = "US123456789", DateOfBirth = new DateTime(1980, 12, 10), Gender = "Male", Nationality = "American", Company = "Global Corp", GuestType = "International", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Sarah", LastName = "Ahmed", GuestCode = "GUEST-004", PhoneNumber = "+92-302-3456789", Email = "sarah.ahmed@email.com", Address = "Gulshan-e-Iqbal, Karachi", City = "Karachi", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-3456789-3", DateOfBirth = new DateTime(1988, 3, 18), Gender = "Female", Nationality = "Pakistani", Company = "Fashion House", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Ali", LastName = "Raza", GuestCode = "GUEST-005", PhoneNumber = "+92-303-4567890", Email = "ali.raza@email.com", Address = "Model Town, Lahore", City = "Lahore", Country = "Pakistan", IdType = "CNIC", IdNumber = "35202-4567890-4", DateOfBirth = new DateTime(1992, 7, 25), Gender = "Male", Nationality = "Pakistani", Company = "Construction Co", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Emma", LastName = "Johnson", GuestCode = "GUEST-006", PhoneNumber = "+44-20-1234-5678", Email = "emma.johnson@email.com", Address = "London Bridge, London", City = "London", Country = "UK", IdType = "Passport", IdNumber = "UK987654321", DateOfBirth = new DateTime(1987, 11, 5), Gender = "Female", Nationality = "British", Company = "Tourism Ltd", GuestType = "International", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Hassan", LastName = "Sheikh", GuestCode = "GUEST-007", PhoneNumber = "+92-304-5678901", Email = "hassan.sheikh@email.com", Address = "Bahria Town, Rawalpindi", City = "Rawalpindi", Country = "Pakistan", IdType = "CNIC", IdNumber = "37405-5678901-5", DateOfBirth = new DateTime(1983, 9, 12), Gender = "Male", Nationality = "Pakistani", Company = "Real Estate", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Zara", LastName = "Malik", GuestCode = "GUEST-008", PhoneNumber = "+92-305-6789012", Email = "zara.malik@email.com", Address = "Defence, Karachi", City = "Karachi", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-6789012-6", DateOfBirth = new DateTime(1995, 1, 30), Gender = "Female", Nationality = "Pakistani", Company = "Media House", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Michael", LastName = "Brown", GuestCode = "GUEST-009", PhoneNumber = "+1-555-987-6543", Email = "michael.brown@email.com", Address = "Silicon Valley, CA", City = "San Francisco", Country = "USA", IdType = "Passport", IdNumber = "US456789123", DateOfBirth = new DateTime(1979, 6, 8), Gender = "Male", Nationality = "American", Company = "Tech Giant", GuestType = "International", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new GuestMaster { FirstName = "Ayesha", LastName = "Siddiqui", GuestCode = "GUEST-010", PhoneNumber = "+92-306-7890123", Email = "ayesha.siddiqui@email.com", Address = "Clifton, Karachi", City = "Karachi", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-7890123-7", DateOfBirth = new DateTime(1991, 4, 14), Gender = "Female", Nationality = "Pakistani", Company = "Healthcare", GuestType = "Business", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                    };
                    _context.GuestMasters.AddRange(guests);
                    await _context.SaveChangesAsync();
                    results["Guests"] = guests.Count;
                }

                // Seed Room Types (7 records)
                if (!await _context.RoomTypes.AnyAsync())
                {
                    var roomTypes = new List<RoomType>
                    {
                        new RoomType { Name = "Standard Single", Code = "STD-S", Description = "Comfortable single room with basic amenities", BasePrice = 8000.00m, MaxOccupancy = 1, Amenities = "AC,TV,WiFi,Bathroom,Minibar", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Standard Double", Code = "STD-D", Description = "Standard double room for two guests", BasePrice = 12000.00m, MaxOccupancy = 2, Amenities = "AC,TV,WiFi,Bathroom,Minibar,Balcony", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Deluxe Single", Code = "DLX-S", Description = "Premium single room with luxury amenities", BasePrice = 15000.00m, MaxOccupancy = 1, Amenities = "AC,TV,WiFi,Bathroom,Minibar,Balcony,RoomService", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Deluxe Double", Code = "DLX-D", Description = "Spacious double room with premium amenities", BasePrice = 20000.00m, MaxOccupancy = 2, Amenities = "AC,TV,WiFi,Bathroom,Minibar,Balcony,RoomService,SeaView", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Executive Suite", Code = "EXE-S", Description = "Luxury suite with separate living area", BasePrice = 35000.00m, MaxOccupancy = 4, Amenities = "AC,TV,WiFi,Bathroom,Minibar,Balcony,LivingRoom,KitchenArea,RoomService", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Presidential Suite", Code = "PRE-S", Description = "Ultimate luxury suite with premium services", BasePrice = 75000.00m, MaxOccupancy = 6, Amenities = "AC,TV,WiFi,Bathroom,Minibar,Balcony,LivingRoom,KitchenArea,RoomService,Butler,Jacuzzi", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new RoomType { Name = "Family Room", Code = "FAM-R", Description = "Large room suitable for families", BasePrice = 25000.00m, MaxOccupancy = 5, Amenities = "AC,TV,WiFi,Bathroom,Minibar,ConnectingRooms,ExtraBeds", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                    };
                    _context.RoomTypes.AddRange(roomTypes);
                    await _context.SaveChangesAsync();
                    results["RoomTypes"] = roomTypes.Count;
                }

                return Ok(new { 
                    success = true, 
                    message = "All Master Entry data seeded successfully",
                    data = results
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding all master data");
                return StatusCode(500, new { success = false, message = "Error seeding master data: " + ex.Message, innerException = ex.InnerException?.Message });
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetDataCount()
        {
            try
            {
                var counts = new
                {
                    hotels = await _context.Hotels.CountAsync(),
                    currencies = await _context.Currencies.CountAsync(),
                    suppliers = await _context.Suppliers.CountAsync(),
                    guests = await _context.GuestMasters.CountAsync(),
                    roomTypes = await _context.RoomTypes.CountAsync()
                };

                return Ok(new { success = true, data = counts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting data count");
                return StatusCode(500, new { success = false, message = "Error getting data count: " + ex.Message });
            }
        }
    }
}
