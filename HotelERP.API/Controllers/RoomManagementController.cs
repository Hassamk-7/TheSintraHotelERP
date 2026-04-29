using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomManagementController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public RoomManagementController(HotelDbContext context)
        {
            _context = context;
        }

        // POST: api/RoomManagement/seed-more-rooms
        [HttpPost("seed-more-rooms")]
        public async Task<ActionResult> SeedMoreRooms()
        {
            try
            {
                var roomTypes = await _context.RoomTypes.ToListAsync();
                
                if (!roomTypes.Any())
                {
                    return BadRequest("No room types found. Please create room types first.");
                }

                var existingRooms = await _context.Rooms.ToListAsync();
                var maxRoomNumber = existingRooms.Any() 
                    ? existingRooms.Max(r => int.TryParse(r.RoomNumber, out int num) ? num : 0) 
                    : 100;

                var rooms = new List<Room>();
                var roomNumber = maxRoomNumber + 1;

                foreach (var roomType in roomTypes)
                {
                    // Create 10 more rooms for each room type
                    for (int i = 0; i < 10; i++)
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

                return Ok(new { 
                    message = $"Successfully added {rooms.Count} rooms", 
                    roomsAdded = rooms.Count,
                    roomTypes = roomTypes.Select(rt => new { 
                        rt.Name, 
                        RoomsAdded = 10 
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        // GET: api/RoomManagement/available-rooms
        [HttpGet("available-rooms")]
        public async Task<ActionResult> GetAvailableRooms()
        {
            try
            {
                var roomTypes = await _context.RoomTypes
                    .Include(rt => rt.Rooms)
                    .ToListAsync();

                var result = roomTypes.Select(rt => new
                {
                    RoomTypeId = rt.Id,
                    RoomTypeName = rt.Name,
                    TotalRooms = rt.Rooms.Count,
                    AvailableRooms = rt.Rooms.Count(r => r.Status == "Available" && r.IsActive == true),
                    OccupiedRooms = rt.Rooms.Count(r => r.Status == "Occupied"),
                    MaintenanceRooms = rt.Rooms.Count(r => r.Status == "Maintenance")
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
