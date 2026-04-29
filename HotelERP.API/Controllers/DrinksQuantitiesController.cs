using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class DrinksQuantitiesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DrinksQuantitiesController> _logger;

        public DrinksQuantitiesController(HotelDbContext context, ILogger<DrinksQuantitiesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDrinksQuantities()
        {
            try
            {
                var quantities = await _context.DrinksQuantities.Where(d => d.IsActive).ToListAsync();
                return HandleSuccess(quantities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks quantities");
                return HandleError("An error occurred while retrieving drinks quantities");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDrinksQuantity(int id)
        {
            try
            {
                var quantity = await _context.DrinksQuantities.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (quantity == null) return HandleNotFound("Drinks quantity not found");
                return HandleSuccess(quantity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks quantity");
                return HandleError("An error occurred while retrieving drinks quantity");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDrinksQuantity([FromBody] DrinksQuantity quantity)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid drinks quantity data");
            }

            try
            {
                quantity.Name = quantity.Name?.Trim();
                quantity.Code = quantity.Code?.Trim();
                quantity.Description = quantity.Description ?? string.Empty;
                quantity.Unit = quantity.Unit ?? string.Empty;
                quantity.IsActive = true;
                _context.DrinksQuantities.Add(quantity);
                await _context.SaveChangesAsync();

                return HandleCreated(quantity, "Drinks quantity created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating drinks quantity");
                return HandleError("An error occurred while creating the drinks quantity");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrinksQuantity(int id, [FromBody] DrinksQuantity updated)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid drinks quantity data");
            }

            try
            {
                var existing = await _context.DrinksQuantities.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks quantity not found");

                existing.Name = updated.Name?.Trim();
                existing.Code = updated.Code?.Trim();
                existing.Description = updated.Description ?? string.Empty;
                existing.Volume = updated.Volume;
                existing.Unit = updated.Unit ?? string.Empty;
                existing.IsStandard = updated.IsStandard;
                existing.DisplayOrder = updated.DisplayOrder;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return HandleSuccess(existing, "Drinks quantity updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating drinks quantity");
                return HandleError("An error occurred while updating the drinks quantity");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrinksQuantity(int id)
        {
            try
            {
                var existing = await _context.DrinksQuantities.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks quantity not found");

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Drinks quantity deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting drinks quantity");
                return HandleError("An error occurred while deleting the drinks quantity");
            }
        }
    }
}
