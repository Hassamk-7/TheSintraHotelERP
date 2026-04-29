using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryReportsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<InventoryReportsController> _logger;

        public InventoryReportsController(HotelDbContext context, ILogger<InventoryReportsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/InventoryReports/stock-summary
        [HttpGet("stock-summary")]
        public async Task<IActionResult> GetStockSummary([FromQuery] string startDate = "", [FromQuery] string endDate = "")
        {
            try
            {
                var items = await _context.ItemMasters
                    .Where(i => i.IsActive)
                    .ToListAsync();

                var summary = items
                    .GroupBy(i => i.Category ?? "Uncategorized")
                    .Select(g => new
                    {
                        category = g.Key,
                        totalItems = g.Count(),
                        totalValue = g.Sum(i => i.CurrentStock * i.PurchasePrice),
                        lowStock = g.Count(i => i.CurrentStock > 0 && i.CurrentStock <= i.MinStockLevel),
                        outOfStock = g.Count(i => i.CurrentStock <= 0)
                    })
                    .OrderBy(x => x.category)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    data = summary,
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching stock summary: {ex.Message}");
            }
        }

        // GET: api/InventoryReports/stock-movement
        [HttpGet("stock-movement")]
        public async Task<IActionResult> GetStockMovement([FromQuery] string startDate = "", [FromQuery] string endDate = "")
        {
            try
            {
                var movements = await _context.StockManagements
                    .Include(s => s.Item)
                    .OrderByDescending(s => s.TransactionDate)
                    .Select(s => new
                    {
                        date = s.TransactionDate.ToString("yyyy-MM-dd"),
                        item = s.Item.Name,
                        itemCode = s.Item.Code,
                        type = s.TransactionType,
                        quantity = s.Quantity,
                        unitPrice = s.UnitPrice,
                        value = s.TotalValue,
                        reference = s.Reference,
                        department = s.Department
                    })
                    .Take(100)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = movements,
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching stock movement: {ex.Message}");
            }
        }

        // GET: api/InventoryReports/low-stock
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockReport()
        {
            try
            {
                var lowStockItems = await _context.ItemMasters
                    .Where(i => i.IsActive && i.CurrentStock > 0 && i.CurrentStock <= i.MinStockLevel)
                    .Select(i => new
                    {
                        item = i.Name,
                        itemCode = i.Code,
                        category = i.Category,
                        current = i.CurrentStock,
                        minimum = i.MinStockLevel,
                        shortage = i.MinStockLevel - i.CurrentStock,
                        value = i.CurrentStock * i.PurchasePrice,
                        supplier = i.Supplier,
                        unit = i.Unit
                    })
                    .OrderBy(x => x.shortage)
                    .ThenBy(x => x.item)
                    .ToListAsync();

                var outOfStockItems = await _context.ItemMasters
                    .Where(i => i.IsActive && i.CurrentStock <= 0)
                    .Select(i => new
                    {
                        item = i.Name,
                        itemCode = i.Code,
                        category = i.Category,
                        current = i.CurrentStock,
                        minimum = i.MinStockLevel,
                        shortage = i.MinStockLevel - i.CurrentStock,
                        value = i.CurrentStock * i.PurchasePrice,
                        supplier = i.Supplier,
                        unit = i.Unit
                    })
                    .OrderBy(x => x.item)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        lowStockItems = lowStockItems,
                        outOfStockItems = outOfStockItems,
                        totalLowStock = lowStockItems.Count,
                        totalOutOfStock = outOfStockItems.Count
                    },
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching low stock report: {ex.Message}");
            }
        }

        // GET: api/InventoryReports/value-analysis
        [HttpGet("value-analysis")]
        public async Task<IActionResult> GetValueAnalysis([FromQuery] string startDate = "", [FromQuery] string endDate = "")
        {
            try
            {
                var items = await _context.ItemMasters
                    .Where(i => i.IsActive)
                    .ToListAsync();

                var analysis = items
                    .GroupBy(i => i.Category ?? "Uncategorized")
                    .Select(g => new
                    {
                        category = g.Key,
                        openingValue = g.Sum(i => i.CurrentStock * i.PurchasePrice),
                        purchases = CalculatePurchases(g.Select(i => i.Id).ToList()),
                        usage = CalculateUsage(g.Select(i => i.Id).ToList()),
                        closingValue = g.Sum(i => i.CurrentStock * i.PurchasePrice),
                        variance = 0m
                    })
                    .OrderBy(x => x.category)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    data = analysis,
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching value analysis: {ex.Message}");
            }
        }

        // GET: api/InventoryReports/category-summary
        [HttpGet("category-summary")]
        public async Task<IActionResult> GetCategorySummary()
        {
            try
            {
                var summary = await _context.ItemMasters
                    .Where(i => i.IsActive)
                    .GroupBy(i => i.Category ?? "Uncategorized")
                    .Select(g => new
                    {
                        category = g.Key,
                        totalItems = g.Count(),
                        totalValue = g.Sum(i => i.CurrentStock * i.PurchasePrice),
                        lowStock = g.Count(i => i.CurrentStock > 0 && i.CurrentStock <= i.MinStockLevel),
                        outOfStock = g.Count(i => i.CurrentStock <= 0),
                        averageValue = g.Average(i => i.CurrentStock * i.PurchasePrice)
                    })
                    .OrderBy(x => x.category)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = summary,
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching category summary: {ex.Message}");
            }
        }

        // GET: api/InventoryReports/inventory-status
        [HttpGet("inventory-status")]
        public async Task<IActionResult> GetInventoryStatus()
        {
            try
            {
                var items = await _context.ItemMasters
                    .Where(i => i.IsActive)
                    .ToListAsync();

                var totalItems = items.Count;
                var totalValue = items.Sum(i => i.CurrentStock * i.PurchasePrice);
                var lowStockCount = items.Count(i => i.CurrentStock > 0 && i.CurrentStock <= i.MinStockLevel);
                var outOfStockCount = items.Count(i => i.CurrentStock <= 0);
                var healthyStockCount = items.Count(i => i.CurrentStock > i.MinStockLevel);

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalItems = totalItems,
                        totalValue = totalValue,
                        lowStockCount = lowStockCount,
                        outOfStockCount = outOfStockCount,
                        healthyStockCount = healthyStockCount,
                        averageItemValue = totalValue / (totalItems > 0 ? totalItems : 1)
                    },
                    generatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching inventory status: {ex.Message}");
            }
        }

        private decimal CalculatePurchases(List<int> itemIds)
        {
            return _context.StockManagements
                .Where(s => itemIds.Contains(s.ItemId) && s.TransactionType == "Purchase")
                .Sum(s => s.TotalValue);
        }

        private decimal CalculateUsage(List<int> itemIds)
        {
            return _context.StockManagements
                .Where(s => itemIds.Contains(s.ItemId) && (s.TransactionType == "Issue" || s.TransactionType == "Usage"))
                .Sum(s => s.TotalValue);
        }
    }
}
