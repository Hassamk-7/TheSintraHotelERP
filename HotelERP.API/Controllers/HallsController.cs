using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager,Receptionist")] // Temporarily disabled for testing
    public class HallsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<HallsController> _logger;

        public HallsController(HotelDbContext context, ILogger<HallsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/halls
        [HttpGet]
        public async Task<IActionResult> GetHalls()
        {
            try
            {
                var halls = await _context.HallMasters.ToListAsync();
                return HandleSuccess(halls);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving halls");
                return HandleError("An error occurred while retrieving halls");
            }
        }

        // GET: api/halls/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHall(int id)
        {
            try
            {
                var hall = await _context.HallMasters.FindAsync(id);

                if (hall == null)
                {
                    return HandleNotFound("Hall not found");
                }

                return HandleSuccess(hall);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving hall with ID: {id}");
                return HandleError($"An error occurred while retrieving hall with ID: {id}");
            }
        }

        // POST: api/halls
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateHall([FromBody] HallCreateDto hallDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid hall data received. Errors: {Errors}",
                    string.Join(" | ", ModelState.SelectMany(kvp => kvp.Value?.Errors.Select(e => $"{kvp.Key}: {e.ErrorMessage}") ?? Enumerable.Empty<string>())));
                return BadRequest(new { message = "Invalid hall data", errors = ModelState });
            }

            try
            {
                var hall = new HallMaster
                {
                    Name = hallDto.Name,
                    Code = hallDto.Code,
                    Description = hallDto.Description,
                    Capacity = hallDto.Capacity,
                    HourlyRate = hallDto.HourlyRate,
                    DailyRate = hallDto.DailyRate,
                    Location = hallDto.Location,
                    HallType = hallDto.HallType,
                    HasAC = hallDto.HasAC,
                    HasProjector = hallDto.HasProjector,
                    HasSoundSystem = hallDto.HasSoundSystem,
                    Amenities = hallDto.Amenities != null ? string.Join(",", hallDto.Amenities) : null,
                    IsAvailable = true
                };

                _context.HallMasters.Add(hall);
                await _context.SaveChangesAsync();

                return HandleCreated(hall, "Hall created successfully");
            }
            catch (Exception ex)
            {
                var root = ex;
                while (root.InnerException != null) root = root.InnerException;
                _logger.LogError(ex, "Error creating hall. Root cause: {RootMessage}", root.Message);
                return StatusCode(500, new { message = "An error occurred while creating the hall", detail = root.Message });
            }
        }

        // PUT: api/halls/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateHall(int id, [FromBody] HallUpdateDto hallDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid hall data");
            }

            try
            {
                var hall = await _context.HallMasters.FindAsync(id);

                if (hall == null)
                {
                    return HandleNotFound("Hall not found");
                }

                hall.Name = hallDto.Name ?? hall.Name;
                hall.Code = hallDto.Code ?? hall.Code;
                hall.Description = hallDto.Description ?? hall.Description;
                hall.Capacity = hallDto.Capacity ?? hall.Capacity;
                hall.HourlyRate = hallDto.HourlyRate ?? hall.HourlyRate;
                hall.DailyRate = hallDto.DailyRate ?? hall.DailyRate;
                hall.Location = hallDto.Location ?? hall.Location;
                hall.HallType = hallDto.HallType ?? hall.HallType;
                hall.HasAC = hallDto.HasAC ?? hall.HasAC;
                hall.HasProjector = hallDto.HasProjector ?? hall.HasProjector;
                hall.HasSoundSystem = hallDto.HasSoundSystem ?? hall.HasSoundSystem;
                hall.Amenities = hallDto.Amenities != null ? string.Join(",", hallDto.Amenities) : hall.Amenities;

                await _context.SaveChangesAsync();

                return HandleSuccess(hall, "Hall updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating hall with ID: {id}");
                return HandleError($"An error occurred while updating hall with ID: {id}");
            }
        }

        // DELETE: api/halls/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteHall(int id)
        {
            try
            {
                var hall = await _context.HallMasters.FindAsync(id);
                if (hall == null)
                {
                    return HandleNotFound("Hall not found");
                }

                _context.HallMasters.Remove(hall);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Hall deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting hall with ID: {id}");
                return HandleError($"An error occurred while deleting hall with ID: {id}");
            }
        }
    }
}
