using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class DrinksCategoriesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DrinksCategoriesController> _logger;

        public DrinksCategoriesController(HotelDbContext context, ILogger<DrinksCategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDrinksCategories()
        {
            try
            {
                var categories = await _context.DrinksCategories.Where(d => d.IsActive).ToListAsync();
                return HandleSuccess(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks categories");
                return HandleError("An error occurred while retrieving drinks categories");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDrinksCategory(int id)
        {
            try
            {
                var category = await _context.DrinksCategories.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (category == null) return HandleNotFound("Drinks category not found");
                return HandleSuccess(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks category");
                return HandleError("An error occurred while retrieving drinks category");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDrinksCategory([FromBody] DrinksCategory category)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid drinks category data");
            }

            try
            {
                category.Name = category.Name?.Trim();
                category.Code = category.Code?.Trim();
                category.Description = category.Description ?? string.Empty;
                category.ImagePath = category.ImagePath ?? string.Empty;
                category.CategoryType = category.CategoryType ?? string.Empty;
                category.ColorCode = category.ColorCode ?? string.Empty;
                category.IsActive = true;
                _context.DrinksCategories.Add(category);
                await _context.SaveChangesAsync();

                return HandleCreated(category, "Drinks category created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating drinks category");
                return HandleError("An error occurred while creating the drinks category");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrinksCategory(int id, [FromBody] DrinksCategory updated)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid drinks category data");
            }

            try
            {
                var existing = await _context.DrinksCategories.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks category not found");

                existing.Name = updated.Name?.Trim();
                existing.Code = updated.Code?.Trim();
                existing.Description = updated.Description ?? string.Empty;
                existing.ImagePath = updated.ImagePath ?? existing.ImagePath ?? string.Empty;
                existing.CategoryType = updated.CategoryType ?? string.Empty;
                existing.IsAlcoholic = updated.IsAlcoholic;
                existing.IsHot = updated.IsHot;
                existing.ColorCode = updated.ColorCode ?? string.Empty;
                existing.DisplayOrder = updated.DisplayOrder;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return HandleSuccess(existing, "Drinks category updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating drinks category");
                return HandleError("An error occurred while updating the drinks category");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrinksCategory(int id)
        {
            try
            {
                var existing = await _context.DrinksCategories.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks category not found");

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Drinks category deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting drinks category");
                return HandleError("An error occurred while deleting the drinks category");
            }
        }
    }
}
