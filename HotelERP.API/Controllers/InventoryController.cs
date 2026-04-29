using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.DTOs;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    public class InventoryController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<InventoryController> _logger;
        private readonly IWebHostEnvironment _env;

        public InventoryController(HotelDbContext context, ILogger<InventoryController> logger, IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        #region Categories

        [AllowAnonymous]
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.InventoryCategories
                    .Include(c => c.ParentCategory)
                    .OrderBy(c => c.Name)
                    .ToListAsync();
                return HandleSuccess(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return HandleError("Error retrieving categories");
            }
        }

        [AllowAnonymous]
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] InventoryCategoryDto dto)
        {
            try
            {
                var category = new InventoryCategory
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    ParentCategoryId = dto.ParentCategoryId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = string.IsNullOrWhiteSpace(UserId) ? "system" : UserId
                };

                _context.InventoryCategories.Add(category);
                await _context.SaveChangesAsync();
                return HandleCreated(category, "Category created");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return HandleError(ex.InnerException?.Message ?? ex.Message);
            }
        }

        #endregion

        #region Items

        [Authorize(Roles = "Admin,Manager,InventoryManager")]
        [HttpGet("items")]
        public async Task<IActionResult> GetItems([FromQuery] int? categoryId = null)
        {
            try
            {
                var query = _context.InventoryItems
                    .Include(i => i.Category)
                    .AsQueryable();

                if (categoryId.HasValue)
                    query = query.Where(i => i.CategoryId == categoryId);

                var items = await query.OrderBy(i => i.Name).ToListAsync();
                return HandleSuccess(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving items");
                return HandleError("Error retrieving items");
            }
        }

        [Authorize(Roles = "Admin,Manager,InventoryManager")]
        [HttpPost("items")]
        public async Task<IActionResult> CreateItem([FromBody] InventoryItemDto dto)
        {
            try
            {
                var item = new InventoryItem
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    CategoryId = dto.CategoryId,
                    StockQuantity = 0,
                    ReorderLevel = dto.ReorderLevel,
                    CostPrice = dto.UnitPrice,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = string.IsNullOrWhiteSpace(UserId) ? "system" : UserId
                };

                _context.InventoryItems.Add(item);
                await _context.SaveChangesAsync();
                return HandleCreated(item, "Item created");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating item");
                return HandleError("Error creating item");
            }
        }

        [Authorize(Roles = "Admin,Manager,InventoryManager")]
        [HttpPost("items/{id}/adjust-stock")]
        public async Task<IActionResult> AdjustStock(int id, [FromBody] AdjustStockDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var item = await _context.InventoryItems.FindAsync(id);
                if (item == null) return HandleNotFound("Item not found");

                var movement = new StockMovement
                {
                    ItemId = id,
                    Quantity = dto.Quantity,
                    MovementType = dto.MovementType,
                    ReferenceId = dto.ReferenceId,
                    ReferenceType = dto.ReferenceType,
                    Notes = dto.Notes,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = string.IsNullOrWhiteSpace(UserId) ? "system" : UserId
                };

                _context.StockMovements.Add(movement);
                
                // Update stock quantity
                if (dto.MovementType == "IN") item.StockQuantity += dto.Quantity;
                else if (dto.MovementType == "OUT") item.StockQuantity -= dto.Quantity;
                
                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return HandleSuccess(new { item.Id, item.StockQuantity }, "Stock updated");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error adjusting stock");
                return HandleError("Error adjusting stock");
            }
        }

        #endregion
    }

    #region DTOs

    public class InventoryCategoryDto
    {
        [Required] public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentCategoryId { get; set; }
    }

    public class InventoryItemDto
    {
        [Required] public string Name { get; set; }
        public string Description { get; set; }
        [Required] public int CategoryId { get; set; }
        public decimal UnitPrice { get; set; }
        public int ReorderLevel { get; set; } = 10;
    }

    public class AdjustStockDto
    {
        [Required] public int Quantity { get; set; }
        [Required] public string MovementType { get; set; } // "IN" or "OUT"
        public string ReferenceId { get; set; }
        public string ReferenceType { get; set; }
        public string Notes { get; set; }
    }

    #endregion
}
