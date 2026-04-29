using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class ItemMastersController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ItemMastersController> _logger;

        public ItemMastersController(HotelDbContext context, ILogger<ItemMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetItems([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.ItemMasters.Where(i => i.IsActive);
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(i => i.Name.Contains(search) || i.Code.Contains(search));

                var totalCount = await query.CountAsync();
                var items = await query.OrderBy(i => i.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = items, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving items");
                return StatusCode(500, new { success = false, message = "Error retrieving items" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemMaster item)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                var existingItem = await _context.ItemMasters.AnyAsync(i => i.Code == item.Code && i.IsActive);
                if (existingItem)
                    return BadRequest(new { success = false, message = "Item code already exists" });

                item.IsActive = true;
                item.CreatedAt = DateTime.UtcNow;
                item.UpdatedAt = DateTime.UtcNow;

                _context.ItemMasters.Add(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetItems), new { id = item.Id },
                    new { success = true, data = item, message = "Item created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating item");
                return StatusCode(500, new { success = false, message = "Error creating item" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemMaster item)
        {
            try
            {
                var existingItem = await _context.ItemMasters.FindAsync(id);
                if (existingItem == null || !existingItem.IsActive)
                    return NotFound(new { success = false, message = "Item not found" });

                existingItem.Name = item.Name;
                existingItem.Description = item.Description;
                existingItem.Category = item.Category;
                existingItem.Unit = item.Unit;
                existingItem.PurchasePrice = item.PurchasePrice;
                existingItem.SalePrice = item.SalePrice;
                existingItem.MinStockLevel = item.MinStockLevel;
                existingItem.MaxStockLevel = item.MaxStockLevel;
                existingItem.CurrentStock = item.CurrentStock;
                existingItem.Supplier = item.Supplier;
                existingItem.Brand = item.Brand;
                existingItem.IsPerishable = item.IsPerishable;
                existingItem.ExpiryDate = item.ExpiryDate;
                existingItem.StorageLocation = item.StorageLocation;
                existingItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating item");
                return StatusCode(500, new { success = false, message = "Error updating item" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var item = await _context.ItemMasters.FindAsync(id);
                if (item == null || !item.IsActive)
                    return NotFound(new { success = false, message = "Item not found" });

                item.IsActive = false;
                item.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Item deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting item");
                return StatusCode(500, new { success = false, message = "Error deleting item" });
            }
        }
    }
}
