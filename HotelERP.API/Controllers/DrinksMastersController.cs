using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class DrinksMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DrinksMastersController> _logger;

        public DrinksMastersController(HotelDbContext context, ILogger<DrinksMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDrinksMasters()
        {
            try
            {
                var drinks = await _context.DrinksMasters.Where(d => d.IsActive).ToListAsync();
                return HandleSuccess(drinks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks masters");
                return HandleError("An error occurred while retrieving drinks masters");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDrinksMaster(int id)
        {
            try
            {
                var drink = await _context.DrinksMasters.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (drink == null) return HandleNotFound("Drinks master not found");
                return HandleSuccess(drink);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks master");
                return HandleError("An error occurred while retrieving drinks master");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDrinksMaster([FromBody] DrinksMaster drink)
        {
            if (!ModelState.IsValid)
            {
                var errs = ModelState
                    .Where(kvp => kvp.Value?.Errors?.Count > 0)
                    .Select(kvp => new { Field = kvp.Key, Errors = kvp.Value!.Errors.Select(e => e.ErrorMessage).ToList() })
                    .ToList();
                _logger.LogWarning("Invalid drinks master data. Errors: {@Errors}", errs);
                return HandleError("Invalid drinks master data");
            }

            try
            {
                _logger.LogInformation("Create DrinksMaster payload: Name={Name}, Code={Code}, Category={Category}, Price={Price}", drink.Name, drink.Code, drink.Category, drink.Price);
                drink.Name = drink.Name?.Trim();
                drink.Code = drink.Code?.Trim();
                drink.Description = drink.Description ?? string.Empty;
                drink.Category = drink.Category ?? string.Empty;
                drink.Brand = drink.Brand ?? string.Empty;
                drink.Ingredients = drink.Ingredients ?? string.Empty;
                drink.ImagePath = drink.ImagePath ?? string.Empty;
                drink.IsActive = true;
                _context.DrinksMasters.Add(drink);
                await _context.SaveChangesAsync();

                return HandleCreated(drink, "Drinks master created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating drinks master");
                return HandleError("An error occurred while creating the drinks master");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrinksMaster(int id, [FromBody] DrinksMaster updated)
        {
            if (!ModelState.IsValid)
            {
                var errs = ModelState
                    .Where(kvp => kvp.Value?.Errors?.Count > 0)
                    .Select(kvp => new { Field = kvp.Key, Errors = kvp.Value!.Errors.Select(e => e.ErrorMessage).ToList() })
                    .ToList();
                _logger.LogWarning("Invalid drinks master data (update). Id={Id}. Errors: {@Errors}", id, errs);
                return HandleError("Invalid drinks master data");
            }

            try
            {
                _logger.LogInformation("Update DrinksMaster payload: Id={Id}, Category={Category}, Price={Price}", id, updated.Category, updated.Price);
                var existing = await _context.DrinksMasters.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks master not found");

                existing.Name = updated.Name?.Trim();
                existing.Code = updated.Code?.Trim();
                existing.Description = updated.Description ?? string.Empty;
                existing.Price = updated.Price;
                existing.Category = updated.Category ?? string.Empty;
                existing.IsAlcoholic = updated.IsAlcoholic;
                existing.AlcoholContent = updated.AlcoholContent;
                existing.Brand = updated.Brand ?? string.Empty;
                existing.Ingredients = updated.Ingredients ?? string.Empty;
                existing.ImagePath = updated.ImagePath ?? existing.ImagePath ?? string.Empty;
                existing.IsAvailable = updated.IsAvailable;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return HandleSuccess(existing, "Drinks master updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating drinks master");
                return HandleError("An error occurred while updating the drinks master");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrinksMaster(int id)
        {
            try
            {
                var existing = await _context.DrinksMasters.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null) return HandleNotFound("Drinks master not found");

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Drinks master deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting drinks master");
                return HandleError("An error occurred while deleting the drinks master");
            }
        }
    }
}
