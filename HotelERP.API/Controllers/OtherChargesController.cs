using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
    public class OtherChargesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<OtherChargesController> _logger;

        public OtherChargesController(HotelDbContext context, ILogger<OtherChargesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/othercharges
        [HttpGet]
        public async Task<IActionResult> GetOtherCharges()
        {
            try
            {
                var charges = await _context.OtherCharges.Where(c => c.IsActive).OrderBy(c => c.DisplayOrder).ThenBy(c => c.Name).ToListAsync();
                return HandleSuccess(charges);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving other charges");
                return HandleError("An error occurred while retrieving other charges");
            }
        }

        // POST: api/othercharges
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateOtherCharge([FromBody] OtherCharges charge)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid charge data");
            }

            try
            {
                charge.IsActive = true;
                _context.OtherCharges.Add(charge);
                await _context.SaveChangesAsync();

                return HandleCreated(charge, "Other charge created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating other charge");
                return HandleError("An error occurred while creating the other charge");
            }
        }

        // DELETE: api/othercharges/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteOtherCharge(int id)
        {
            try
            {
                var charge = await _context.OtherCharges.FindAsync(id);
                if (charge == null)
                {
                    return HandleNotFound("Other charge not found");
                }

                _context.OtherCharges.Remove(charge);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Other charge deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting other charge with ID: {id}");
                return HandleError($"An error occurred while deleting other charge with ID: {id}");
            }
        }
    }
}
