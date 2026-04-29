using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
    public class GardenMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GardenMastersController> _logger;

        public GardenMastersController(HotelDbContext context, ILogger<GardenMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/gardenmasters
        [HttpGet]
        public async Task<IActionResult> GetGardens()
        {
            try
            {
                var gardens = await _context.GardenMasters.Where(g => g.IsActive).OrderBy(g => g.Name).ToListAsync();
                return HandleSuccess(gardens);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving gardens");
                return HandleError("An error occurred while retrieving gardens");
            }
        }

        // POST: api/gardenmasters
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateGarden([FromBody] GardenMaster garden)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid garden data");
            }

            try
            {
                garden.IsActive = true;
                _context.GardenMasters.Add(garden);
                await _context.SaveChangesAsync();

                return HandleCreated(garden, "Garden created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating garden");
                return HandleError("An error occurred while creating the garden");
            }
        }

        // DELETE: api/gardenmasters/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteGarden(int id)
        {
            try
            {
                var garden = await _context.GardenMasters.FindAsync(id);
                if (garden == null)
                {
                    return HandleNotFound("Garden not found");
                }

                _context.GardenMasters.Remove(garden);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Garden deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting garden with ID: {id}");
                return HandleError($"An error occurred while deleting garden with ID: {id}");
            }
        }
    }
}
