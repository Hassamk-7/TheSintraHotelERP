using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.DTOs;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    public class RoomsController : BaseController
    {
        private readonly  HotelDbContext _context;
        private readonly ILogger<RoomsController> _logger;
        public RoomsController(HotelDbContext context, ILogger<RoomsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/rooms/test
        [HttpGet("test")]
        public IActionResult TestEndpoint()
        {
            return Ok(new { message = "Rooms API is working!", timestamp = DateTime.UtcNow });
        }

        // GET: api/rooms/simple
        [HttpGet("simple")]
        public async Task<IActionResult> GetRoomsSimple()
        {
            try
            {
                var rooms = await _context.Rooms.ToListAsync();
                var roomTypes = await _context.RoomTypes.ToListAsync();
                
                _logger.LogInformation($"Found {rooms.Count} rooms and {roomTypes.Count} room types");
                
                return Ok(new { 
                    success = true, 
                    roomCount = rooms.Count,
                    roomTypeCount = roomTypes.Count,
                    rooms = rooms.Take(5).Select(r => new { r.Id, r.RoomNumber, r.RoomTypeId, r.Status }),
                    roomTypes = roomTypes.Take(5).Select(rt => new { rt.Id, rt.Name })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in simple rooms test");
                return HandleError($"Database error: {ex.Message}");
            }
        }

        // GET: api/rooms
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromQuery] int? hotelId = null, [FromQuery] bool? isAvailable = null)
        {
            try
            {
                var query = _context.Rooms
                    .Include(r => r.RoomType)
                    .AsQueryable();

                if (hotelId.HasValue && hotelId.Value > 0)
                {
                    query = query.Where(r => r.RoomType != null && r.RoomType.HotelId == hotelId.Value);
                }

                if (isAvailable.HasValue)
                {
                    query = query.Where(r => r.Status == "Available");
                }

                var rooms = await query.ToListAsync();
                var count = rooms.Count;
                _logger.LogInformation($"Retrieved {count} rooms from database");
                
                return HandleSuccess(rooms, $"Retrieved {count} rooms successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rooms");
                return HandleError($"Database error: {ex.Message}");
            }
        }

        // GET: api/rooms/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoom(int id)
        {
            try
            {
                var room = await _context.Rooms
                    .Include(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (room == null)
                {
                    return HandleNotFound("Room not found");
                }

                return HandleSuccess(room);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving room with ID: {id}");
                return HandleError($"An error occurred while retrieving room with ID: {id}");
            }
        }

        // POST: api/rooms
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateRoom([FromBody] RoomCreateDto roomDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid room data");
            }

            try
            {
                var roomType = await _context.RoomTypes.FindAsync(roomDto.RoomTypeId);
                if (roomType == null)
                {
                    return HandleError("Invalid room type");
                }

                var room = new Room
                {
                    RoomNumber = roomDto.RoomNumber,
                    RoomTypeId = roomDto.RoomTypeId,
                    FloorNumber = roomDto.FloorNumber,
                    Status = roomDto.Status ?? "Available",
                    MaxAdults = roomDto.MaxAdults,
                    MaxChildren = roomDto.MaxChildren,
                    BasePrice = roomDto.BasePrice,
                    Description = roomDto.Description,
                    Features = string.Join(",", roomDto.Features ?? new List<string>())
                };

                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();

                return HandleCreated(room, "Room created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room");
                return HandleError("An error occurred while creating the room");
            }
        }

        // PUT: api/rooms/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomUpdateDto roomDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid room data");
            }

            try
            {
                var room = await _context.Rooms.FindAsync(id);
                if (room == null)
                {
                    return HandleNotFound("Room not found");
                }

                if (roomDto.RoomTypeId.HasValue)
                {
                    var roomType = await _context.RoomTypes.FindAsync(roomDto.RoomTypeId.Value);
                    if (roomType == null)
                    {
                        return HandleError("Invalid room type");
                    }
                    room.RoomTypeId = roomDto.RoomTypeId.Value;
                }

                if (!string.IsNullOrEmpty(roomDto.RoomNumber))
                {
                    room.RoomNumber = roomDto.RoomNumber;
                }

                if (roomDto.FloorNumber.HasValue)
                {
                    room.FloorNumber = roomDto.FloorNumber.Value;
                }

                if (!string.IsNullOrEmpty(roomDto.Status))
                {
                    room.Status = roomDto.Status;
                }

                if (roomDto.MaxAdults.HasValue)
                {
                    room.MaxAdults = roomDto.MaxAdults.Value;
                }

                if (roomDto.MaxChildren.HasValue)
                {
                    room.MaxChildren = roomDto.MaxChildren.Value;
                }

                if (roomDto.BasePrice.HasValue)
                {
                    room.BasePrice = roomDto.BasePrice.Value;
                }

                if (roomDto.Features != null)
                {
                    room.Features = string.Join(",", roomDto.Features);
                }

                if (!string.IsNullOrEmpty(roomDto.Description))
                {
                    room.Description = roomDto.Description;
                }

                room.UpdatedAt = DateTime.UtcNow;
                _context.Entry(room).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return HandleSuccess(room, "Room updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating room with ID: {id}");
                return HandleError($"An error occurred while updating room with ID: {id}");
            }
        }

        // DELETE: api/rooms/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var room = await _context.Rooms.FindAsync(id);
                if (room == null)
                {
                    return HandleNotFound("Room not found");
                }

                // Check if the room has any active reservations
                var hasActiveReservations = await _context.Reservations
                    .AnyAsync(r => r.RoomId == id && 
                                 (r.Status == "Confirmed" || r.Status == "CheckedIn"));

                if (hasActiveReservations)
                {
                    return HandleError("Cannot delete room with active reservations");
                }

                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Room deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting room with ID: {id}");
                return HandleError($"An error occurred while deleting room with ID: {id}");
            }
        }

        // GET: api/rooms/status
        [HttpGet("status")]
        public async Task<IActionResult> GetRoomStatus()
        {
            try
            {
                _logger.LogInformation("Fetching room status...");

                // First, get rooms with room types
                var rooms = await _context.Rooms
                    .Include(r => r.RoomType)
                    .ToListAsync();

                _logger.LogInformation($"Found {rooms.Count} rooms");

                // Then get check-ins separately to avoid complex LINQ queries
                var checkIns = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Where(c => c.Status == "CheckedIn")
                    .ToListAsync();

                _logger.LogInformation($"Found {checkIns.Count} active check-ins");

                // Combine the data
                var roomStatuses = rooms.Select(r => {
                    var checkIn = checkIns.FirstOrDefault(c => c.RoomId == r.Id);
                    return new
                    {
                        Id = r.Id,
                        RoomNumber = r.RoomNumber,
                        RoomType = r.RoomType?.Name ?? "Unknown",
                        Floor = r.FloorNumber,
                        Status = r.Status ?? "Available",
                        GuestName = checkIn != null ? $"{checkIn.Guest?.FirstName ?? ""} {checkIn.Guest?.LastName ?? ""}".Trim() : null,
                        CheckIn = checkIn?.CheckInDate.ToString("yyyy-MM-dd"),
                        CheckOut = checkIn?.ExpectedCheckOutDate.ToString("yyyy-MM-dd"),
                        HousekeepingStatus = "Clean", // Default value since column doesn't exist in current schema
                        LastCleaned = DateTime.Now.ToString("yyyy-MM-dd HH:mm") // Default value since column doesn't exist in current schema
                    };
                }).ToList();

                _logger.LogInformation($"Returning {roomStatuses.Count} room statuses");

                return HandleSuccess(roomStatuses, $"Retrieved {roomStatuses.Count} room statuses successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room status");
                return HandleError($"An error occurred while retrieving room status: {ex.Message}");
            }
        }

        // PUT: api/rooms/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] RoomStatusUpdateDto statusDto)
        {
            try
            {
                var room = await _context.Rooms.FindAsync(id);
                if (room == null)
                {
                    return HandleNotFound("Room not found");
                }

                room.Status = statusDto.Status;
                // Note: HousekeepingStatus and LastCleaned properties don't exist in current Room model
                // These would need to be added to the database schema and model if required
                
                room.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return HandleSuccess(room, "Room status updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating room status for ID: {id}");
                return HandleError("An error occurred while updating room status");
            }
        }

        // GET: api/rooms/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRooms(
            [FromQuery] DateTime checkInDate, 
            [FromQuery] DateTime checkOutDate,
            [FromQuery] int? roomTypeId = null)
        {
            if (checkInDate >= checkOutDate)
            {
                return HandleError("Check-out date must be after check-in date");
            }

            try
            {
                // Find rooms that are not booked for the given date range
                var bookedRoomIds = await _context.Reservations
                    .Where(r => !(checkInDate >= r.CheckOutDate || checkOutDate <= r.CheckInDate) &&
                               (r.Status == "Confirmed" || r.Status == "CheckedIn"))
                    .Select(r => r.RoomId)
                    .Distinct()
                    .ToListAsync();

                var query = _context.Rooms
                    .Include(r => r.RoomType)
                    .Where(r => !bookedRoomIds.Contains(r.Id) && 
                               r.Status == "Available");

                if (roomTypeId.HasValue)
                {
                    query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
                }

                var availableRooms = await query.ToListAsync();
                return HandleSuccess(availableRooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available rooms");
                return HandleError("An error occurred while retrieving available rooms");
            }
        }
    }

    public class RoomUpdateDto
    {
        public string RoomNumber { get; set; }
        public int? RoomTypeId { get; set; }
        public int? FloorNumber { get; set; }
        public string Status { get; set; }
        public int? MaxAdults { get; set; }
        public int? MaxChildren { get; set; }
        public decimal? BasePrice { get; set; }
        public string Description { get; set; }
        public List<string> Features { get; set; }
    }

    public class RoomStatusUpdateDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
        
        // Note: HousekeepingStatus removed as it doesn't exist in current Room model
    }
}
