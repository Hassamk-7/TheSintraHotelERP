using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryManagementController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<InventoryManagementController> _logger;

        public InventoryManagementController(HotelDbContext context, ILogger<InventoryManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // STOCK MANAGEMENT ENDPOINTS
        [HttpGet("stock-management")]
        public async Task<IActionResult> GetStockManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string transactionType = "", [FromQuery] string department = "")
        {
            try
            {
                var query = _context.StockManagements.Include(s => s.Item).Where(s => s.IsActive);
                
                if (!string.IsNullOrEmpty(transactionType))
                    query = query.Where(s => s.TransactionType == transactionType);
                
                if (!string.IsNullOrEmpty(department))
                    query = query.Where(s => s.Department == department);

                var totalCount = await query.CountAsync();
                var stocks = await query
                    .OrderByDescending(s => s.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = stocks, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stock management");
                return StatusCode(500, new { success = false, message = "Error retrieving stock management" });
            }
        }

        [HttpGet("stock-management/{id}")]
        public async Task<IActionResult> GetStockTransaction(int id)
        {
            try
            {
                var stock = await _context.StockManagements
                    .Include(s => s.Item)
                    .FirstOrDefaultAsync(s => s.Id == id && s.IsActive);

                if (stock == null)
                    return NotFound(new { success = false, message = "Stock transaction not found" });

                return Ok(new { success = true, data = stock });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stock transaction");
                return StatusCode(500, new { success = false, message = "Error retrieving stock transaction" });
            }
        }

        [HttpPost("stock-management")]
        public async Task<IActionResult> CreateStockTransaction([FromBody] StockManagement stock)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Calculate total value
                stock.TotalValue = stock.Quantity * stock.UnitPrice;
                stock.TransactionDate = DateTime.UtcNow;
                stock.IsActive = true;
                stock.CreatedAt = DateTime.UtcNow;
                stock.UpdatedAt = DateTime.UtcNow;

                // Update item stock balance
                var item = await _context.ItemMasters.FindAsync(stock.ItemId);
                if (item != null)
                {
                    switch (stock.TransactionType?.ToLower())
                    {
                        case "purchase":
                        case "return":
                            item.CurrentStock += (int)stock.Quantity;
                            break;
                        case "issue":
                        case "transfer":
                            item.CurrentStock -= (int)stock.Quantity;
                            break;
                        case "adjustment":
                            item.CurrentStock = (int)stock.StockBalance;
                            break;
                    }
                    stock.StockBalance = item.CurrentStock;
                    item.UpdatedAt = DateTime.UtcNow;
                }

                _context.StockManagements.Add(stock);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStockTransaction), new { id = stock.Id },
                    new { success = true, data = stock, message = "Stock transaction created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock transaction");
                return StatusCode(500, new { success = false, message = "Error creating stock transaction" });
            }
        }

        // PURCHASE ORDER ENDPOINTS
        [HttpGet("purchase-orders")]
        public async Task<IActionResult> GetPurchaseOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "")
        {
            try
            {
                var query = _context.PurchaseOrders.Include(p => p.Supplier).Where(p => p.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(p => p.Status == status);

                var totalCount = await query.CountAsync();
                var orders = await query
                    .OrderByDescending(p => p.OrderDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = orders, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase orders");
                return StatusCode(500, new { success = false, message = "Error retrieving purchase orders" });
            }
        }

        [HttpGet("purchase-orders/{id}")]
        public async Task<IActionResult> GetPurchaseOrder(int id)
        {
            try
            {
                var order = await _context.PurchaseOrders
                    .Include(p => p.Supplier)
                    .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

                if (order == null)
                    return NotFound(new { success = false, message = "Purchase order not found" });

                // Get order items
                var orderItems = await _context.PurchaseOrderItems
                    .Include(i => i.Item)
                    .Where(i => i.PurchaseOrderId == id && i.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = new { order, items = orderItems } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase order");
                return StatusCode(500, new { success = false, message = "Error retrieving purchase order" });
            }
        }

        [HttpPost("purchase-orders")]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] PurchaseOrder order)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                order.PONumber = $"PO{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                order.OrderDate = DateTime.UtcNow;
                order.Status = "Draft";
                order.IsActive = true;
                order.CreatedAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                _context.PurchaseOrders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.Id },
                    new { success = true, data = order, message = "Purchase order created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating purchase order");
                return StatusCode(500, new { success = false, message = "Error creating purchase order" });
            }
        }

        [HttpPut("purchase-orders/{id}")]
        public async Task<IActionResult> UpdatePurchaseOrder(int id, [FromBody] PurchaseOrder order)
        {
            try
            {
                var existingOrder = await _context.PurchaseOrders.FindAsync(id);
                if (existingOrder == null || !existingOrder.IsActive)
                    return NotFound(new { success = false, message = "Purchase order not found" });

                existingOrder.ExpectedDeliveryDate = order.ExpectedDeliveryDate;
                existingOrder.Status = order.Status;
                existingOrder.SubTotal = order.SubTotal;
                existingOrder.TaxAmount = order.TaxAmount;
                existingOrder.TotalAmount = order.TotalAmount;
                existingOrder.ApprovedBy = order.ApprovedBy;
                existingOrder.ApprovalDate = order.ApprovalDate;
                existingOrder.Terms = order.Terms;
                existingOrder.Remarks = order.Remarks;
                existingOrder.UpdatedAt = DateTime.UtcNow;

                if (order.Status == "Received")
                    existingOrder.ActualDeliveryDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Purchase order updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating purchase order");
                return StatusCode(500, new { success = false, message = "Error updating purchase order" });
            }
        }

        // PURCHASE ORDER ITEMS ENDPOINTS
        [HttpGet("purchase-order-items/{purchaseOrderId}")]
        public async Task<IActionResult> GetPurchaseOrderItems(int purchaseOrderId)
        {
            try
            {
                var items = await _context.PurchaseOrderItems
                    .Include(i => i.Item)
                    .Where(i => i.PurchaseOrderId == purchaseOrderId && i.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = items });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase order items");
                return StatusCode(500, new { success = false, message = "Error retrieving purchase order items" });
            }
        }

        [HttpPost("purchase-order-items")]
        public async Task<IActionResult> CreatePurchaseOrderItem([FromBody] PurchaseOrderItem item)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                item.TotalPrice = item.Quantity * item.UnitPrice;
                item.PendingQuantity = item.Quantity;
                item.IsActive = true;
                item.CreatedAt = DateTime.UtcNow;
                item.UpdatedAt = DateTime.UtcNow;

                _context.PurchaseOrderItems.Add(item);

                // Update purchase order totals
                var purchaseOrder = await _context.PurchaseOrders.FindAsync(item.PurchaseOrderId);
                if (purchaseOrder != null)
                {
                    var allItems = await _context.PurchaseOrderItems
                        .Where(i => i.PurchaseOrderId == item.PurchaseOrderId && i.IsActive)
                        .ToListAsync();
                    
                    purchaseOrder.SubTotal = allItems.Sum(i => i.TotalPrice) + item.TotalPrice;
                    purchaseOrder.TaxAmount = purchaseOrder.SubTotal * 0.1m; // 10% tax
                    purchaseOrder.TotalAmount = purchaseOrder.SubTotal + purchaseOrder.TaxAmount;
                    purchaseOrder.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = item, message = "Purchase order item added successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating purchase order item");
                return StatusCode(500, new { success = false, message = "Error creating purchase order item" });
            }
        }

        // STOCK ALERTS ENDPOINTS
        [HttpGet("stock-alerts")]
        public async Task<IActionResult> GetStockAlerts([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string alertType = "", [FromQuery] string status = "")
        {
            try
            {
                var query = _context.StockAlerts.Include(a => a.Item).Where(a => a.IsActive);
                
                if (!string.IsNullOrEmpty(alertType))
                    query = query.Where(a => a.AlertType == alertType);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(a => a.Status == status);

                var totalCount = await query.CountAsync();
                var alerts = await query
                    .OrderByDescending(a => a.AlertDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = alerts, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stock alerts");
                return StatusCode(500, new { success = false, message = "Error retrieving stock alerts" });
            }
        }

        [HttpPost("stock-alerts")]
        public async Task<IActionResult> CreateStockAlert([FromBody] StockAlert alert)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                alert.AlertDate = DateTime.UtcNow;
                alert.Status = "Active";
                alert.IsActive = true;
                alert.CreatedAt = DateTime.UtcNow;
                alert.UpdatedAt = DateTime.UtcNow;

                _context.StockAlerts.Add(alert);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = alert, message = "Stock alert created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock alert");
                return StatusCode(500, new { success = false, message = "Error creating stock alert" });
            }
        }

        [HttpPut("stock-alerts/{id}/resolve")]
        public async Task<IActionResult> ResolveStockAlert(int id, [FromBody] string remarks)
        {
            try
            {
                var alert = await _context.StockAlerts.FindAsync(id);
                if (alert == null || !alert.IsActive)
                    return NotFound(new { success = false, message = "Stock alert not found" });

                alert.Status = "Resolved";
                alert.ResolvedDate = DateTime.UtcNow;
                alert.Remarks = remarks;
                alert.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Stock alert resolved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving stock alert");
                return StatusCode(500, new { success = false, message = "Error resolving stock alert" });
            }
        }

        // INVENTORY REPORTS ENDPOINTS
        [HttpGet("inventory-reports")]
        public async Task<IActionResult> GetInventoryReports([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string reportType = "")
        {
            try
            {
                var query = _context.InventoryReports.Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(reportType))
                    query = query.Where(r => r.ReportType == reportType);

                var totalCount = await query.CountAsync();
                var reports = await query
                    .OrderByDescending(r => r.ReportDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = reports, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inventory reports");
                return StatusCode(500, new { success = false, message = "Error retrieving inventory reports" });
            }
        }

        [HttpPost("inventory-reports")]
        public async Task<IActionResult> CreateInventoryReport([FromBody] InventoryReport report)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                report.ReportDate = DateTime.UtcNow;
                report.IsActive = true;
                report.CreatedAt = DateTime.UtcNow;
                report.UpdatedAt = DateTime.UtcNow;

                _context.InventoryReports.Add(report);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = report, message = "Inventory report created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating inventory report");
                return StatusCode(500, new { success = false, message = "Error creating inventory report" });
            }
        }

        // DASHBOARD SUMMARY FOR INVENTORY
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetInventoryDashboardSummary()
        {
            try
            {
                var summary = new
                {
                    TotalItems = await _context.ItemMasters.CountAsync(i => i.IsActive),
                    LowStockItems = await _context.ItemMasters.CountAsync(i => i.CurrentStock <= i.MinStockLevel && i.IsActive),
                    OutOfStockItems = await _context.ItemMasters.CountAsync(i => i.CurrentStock == 0 && i.IsActive),
                    PendingPurchaseOrders = await _context.PurchaseOrders.CountAsync(p => p.Status == "Sent" && p.IsActive),
                    ActiveAlerts = await _context.StockAlerts.CountAsync(a => a.Status == "Active" && a.IsActive),
                    TotalStockValue = await _context.ItemMasters.Where(i => i.IsActive).SumAsync(i => i.CurrentStock * i.PurchasePrice),
                    MonthlyPurchases = await _context.PurchaseOrders.Where(p => p.OrderDate.Month == DateTime.Now.Month && p.IsActive).SumAsync(p => p.TotalAmount),
                    RecentTransactions = await _context.StockManagements.Where(s => s.TransactionDate >= DateTime.Today.AddDays(-7) && s.IsActive).CountAsync()
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inventory dashboard summary");
                return StatusCode(500, new { success = false, message = "Error retrieving inventory dashboard summary" });
            }
        }
    }
}
