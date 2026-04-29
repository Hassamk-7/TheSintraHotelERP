using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager,Chef")] // Temporarily disabled for testing
    public class MenuItemMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<MenuItemMastersController> _logger;

        public MenuItemMastersController(HotelDbContext context, ILogger<MenuItemMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/menuitemmasters
        [HttpGet]
        public async Task<IActionResult> GetMenuItems([FromQuery] string category = null, [FromQuery] bool? isVegetarian = null)
        {
            try
            {
                var query = _context.MenuItemMasters.Where(m => m.IsActive);

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(m => m.Category == category);
                }

                if (isVegetarian.HasValue)
                {
                    query = query.Where(m => m.IsVegetarian == isVegetarian.Value);
                }

                var menuItems = await query.OrderBy(m => m.Category).ThenBy(m => m.Name).ToListAsync();
                return HandleSuccess(menuItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving menu items");
                return HandleError("An error occurred while retrieving menu items");
            }
        }

        // GET: api/menuitemmasters/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            try
            {
                var menuItem = await _context.MenuItemMasters.FindAsync(id);

                if (menuItem == null)
                {
                    return HandleNotFound("Menu item not found");
                }

                return HandleSuccess(menuItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving menu item with ID: {id}");
                return HandleError($"An error occurred while retrieving menu item with ID: {id}");
            }
        }

        // POST: api/menuitemmasters
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuItemMaster menuItem)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid menu item data");
            }

            try
            {
                menuItem.IsActive = true;
                _context.MenuItemMasters.Add(menuItem);
                await _context.SaveChangesAsync();

                return HandleCreated(menuItem, "Menu item created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating menu item");
                return HandleError("An error occurred while creating the menu item");
            }
        }

        // PUT: api/menuitemmasters/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItemMaster menuItem)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid menu item data");
            }

            try
            {
                var existingItem = await _context.MenuItemMasters.FindAsync(id);

                if (existingItem == null)
                {
                    return HandleNotFound("Menu item not found");
                }

                existingItem.Name = menuItem.Name;
                existingItem.Code = menuItem.Code;
                existingItem.Description = menuItem.Description;
                existingItem.Price = menuItem.Price;
                existingItem.Category = menuItem.Category;
                existingItem.Cuisine = menuItem.Cuisine;
                existingItem.IsVegetarian = menuItem.IsVegetarian;
                existingItem.IsHalal = menuItem.IsHalal;
                existingItem.IsSpicy = menuItem.IsSpicy;
                existingItem.Ingredients = menuItem.Ingredients;
                existingItem.PreparationTime = menuItem.PreparationTime;

                await _context.SaveChangesAsync();

                return HandleSuccess(existingItem, "Menu item updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating menu item with ID: {id}");
                return HandleError($"An error occurred while updating menu item with ID: {id}");
            }
        }

        // DELETE: api/menuitemmasters/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            try
            {
                var menuItem = await _context.MenuItemMasters.FindAsync(id);
                if (menuItem == null)
                {
                    return HandleNotFound("Menu item not found");
                }

                _context.MenuItemMasters.Remove(menuItem);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Menu item deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting menu item with ID: {id}");
                return HandleError($"An error occurred while deleting menu item with ID: {id}");
            }
        }
    }
}
