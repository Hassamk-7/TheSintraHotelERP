using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockAlertsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<StockAlertsController> _logger;

        public StockAlertsController(HotelDbContext context, ILogger<StockAlertsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/StockAlerts
        [HttpGet]
        public async Task<IActionResult> GetStockAlerts([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string alertType = "", [FromQuery] string status = "")
        {
            try
            {
                await SyncStockAlertsFromInventory();

                var query = _context.StockAlerts
                    .Include(a => a.Item)
                    .AsQueryable();

                // Filter by alert type
                if (!string.IsNullOrEmpty(alertType))
                {
                    query = query.Where(a => a.AlertType == alertType);
                }

                // Filter by status
                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(a => a.Status == status);
                }

                var totalCount = await query.CountAsync();
                var alerts = await query
                    .OrderByDescending(a => a.AlertDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var alertDtos = alerts.Select(MapToDto).ToList();

                return Ok(new
                {
                    success = true,
                    data = alertDtos,
                    totalCount = totalCount,
                    page = page,
                    pageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching stock alerts: {ex.Message}");
            }
        }

        // GET: api/StockAlerts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStockAlert(int id)
        {
            try
            {
                await SyncStockAlertsFromInventory();

                var alert = await _context.StockAlerts
                    .Include(a => a.Item)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (alert == null)
                {
                    return HandleNotFound("Stock alert not found");
                }

                return Ok(new
                {
                    success = true,
                    data = MapToDto(alert)
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching stock alert: {ex.Message}");
            }
        }

        // GET: api/StockAlerts/by-status/{status}
        [HttpGet("by-status/{status}")]
        public async Task<IActionResult> GetAlertsByStatus(string status)
        {
            try
            {
                await SyncStockAlertsFromInventory();

                var alerts = await _context.StockAlerts
                    .Include(a => a.Item)
                    .Where(a => a.Status == status)
                    .OrderByDescending(a => a.AlertDate)
                    .ToListAsync();

                var alertDtos = alerts.Select(MapToDto).ToList();

                return Ok(new
                {
                    success = true,
                    data = alertDtos,
                    count = alertDtos.Count
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching alerts by status: {ex.Message}");
            }
        }

        // GET: api/StockAlerts/by-type/{alertType}
        [HttpGet("by-type/{alertType}")]
        public async Task<IActionResult> GetAlertsByType(string alertType)
        {
            try
            {
                await SyncStockAlertsFromInventory();

                var alerts = await _context.StockAlerts
                    .Include(a => a.Item)
                    .Where(a => a.AlertType == alertType)
                    .OrderByDescending(a => a.AlertDate)
                    .ToListAsync();

                var alertDtos = alerts.Select(MapToDto).ToList();

                return Ok(new
                {
                    success = true,
                    data = alertDtos,
                    count = alertDtos.Count
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching alerts by type: {ex.Message}");
            }
        }

        // GET: api/StockAlerts/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetAlertsSummary()
        {
            try
            {
                await SyncStockAlertsFromInventory();

                var activeAlerts = await _context.StockAlerts.CountAsync(a => a.Status == "Active");
                var criticalAlerts = await _context.StockAlerts.CountAsync(a => a.AlertType == "Out of Stock" && a.Status == "Active");
                var outOfStock = await _context.StockAlerts.CountAsync(a => a.AlertType == "Out of Stock" && a.Status == "Active");
                var lowStock = await _context.StockAlerts.CountAsync(a => a.AlertType == "Low Stock" && a.Status == "Active");

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        activeAlerts = activeAlerts,
                        criticalAlerts = criticalAlerts,
                        outOfStock = outOfStock,
                        lowStock = lowStock
                    }
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching alerts summary: {ex.Message}");
            }
        }

        // POST: api/StockAlerts
        [HttpPost]
        public async Task<IActionResult> CreateStockAlert([FromBody] StockAlert alert)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                alert.CreatedAt = DateTime.UtcNow;
                alert.IsActive = true;

                _context.StockAlerts.Add(alert);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStockAlert), new { id = alert.Id }, new
                {
                    success = true,
                    data = alert,
                    message = "Stock alert created successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error creating stock alert: {ex.Message}");
            }
        }

        // PUT: api/StockAlerts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStockAlert(int id, [FromBody] StockAlert alert)
        {
            try
            {
                if (id != alert.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var existingAlert = await _context.StockAlerts.FindAsync(id);
                if (existingAlert == null)
                {
                    return HandleNotFound("Stock alert not found");
                }

                // Update fields
                existingAlert.ItemId = alert.ItemId;
                existingAlert.AlertType = alert.AlertType ?? existingAlert.AlertType;
                existingAlert.AlertDate = alert.AlertDate;
                existingAlert.CurrentStock = alert.CurrentStock;
                existingAlert.MinimumLevel = alert.MinimumLevel;
                existingAlert.ExpiryDate = alert.ExpiryDate;
                existingAlert.Status = alert.Status ?? existingAlert.Status;
                existingAlert.AlertedTo = alert.AlertedTo ?? existingAlert.AlertedTo;
                existingAlert.ResolvedDate = alert.ResolvedDate;
                existingAlert.ResolvedBy = alert.ResolvedBy ?? existingAlert.ResolvedBy;
                existingAlert.Remarks = alert.Remarks ?? existingAlert.Remarks;
                existingAlert.UpdatedAt = DateTime.UtcNow;

                _context.StockAlerts.Update(existingAlert);
                await _context.SaveChangesAsync();

                return HandleSuccess(new
                {
                    success = true,
                    data = existingAlert,
                    message = "Stock alert updated successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error updating stock alert: {ex.Message}");
            }
        }

        // PUT: api/StockAlerts/5/resolve
        [HttpPut("{id}/resolve")]
        public async Task<IActionResult> ResolveStockAlert(int id, [FromBody] ResolveStockAlertDto dto)
        {
            try
            {
                var alert = await _context.StockAlerts.FindAsync(id);
                if (alert == null)
                {
                    return HandleNotFound("Stock alert not found");
                }

                alert.Status = "Resolved";
                alert.ResolvedDate = DateTime.UtcNow;
                alert.ResolvedBy = string.IsNullOrWhiteSpace(dto?.ResolvedBy) ? "System" : dto.ResolvedBy;
                alert.Remarks = dto?.Remarks ?? alert.Remarks;
                alert.UpdatedAt = DateTime.UtcNow;

                _context.StockAlerts.Update(alert);
                await _context.SaveChangesAsync();

                return HandleSuccess(new
                {
                    success = true,
                    data = alert,
                    message = "Stock alert resolved successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error resolving stock alert: {ex.Message}");
            }
        }

        // PUT: api/StockAlerts/5/dismiss
        [HttpPut("{id}/dismiss")]
        public async Task<IActionResult> DismissStockAlert(int id, [FromBody] ResolveStockAlertDto dto)
        {
            try
            {
                var alert = await _context.StockAlerts.FindAsync(id);
                if (alert == null)
                {
                    return HandleNotFound("Stock alert not found");
                }

                alert.Status = "Dismissed";
                alert.ResolvedDate = DateTime.UtcNow;
                alert.ResolvedBy = string.IsNullOrWhiteSpace(dto?.ResolvedBy) ? "System" : dto.ResolvedBy;
                alert.Remarks = dto?.Remarks ?? alert.Remarks;
                alert.UpdatedAt = DateTime.UtcNow;

                _context.StockAlerts.Update(alert);
                await _context.SaveChangesAsync();

                return HandleSuccess(new
                {
                    success = true,
                    data = alert,
                    message = "Stock alert dismissed successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error dismissing stock alert: {ex.Message}");
            }
        }

        // DELETE: api/StockAlerts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockAlert(int id)
        {
            try
            {
                var alert = await _context.StockAlerts.FindAsync(id);
                if (alert == null)
                {
                    return HandleNotFound("Stock alert not found");
                }

                _context.StockAlerts.Remove(alert);
                await _context.SaveChangesAsync();

                return HandleSuccess(new
                {
                    success = true,
                    message = "Stock alert deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error deleting stock alert: {ex.Message}");
            }
        }

        private async Task SyncStockAlertsFromInventory()
        {
            var items = await _context.ItemMasters.Where(i => i.IsActive).ToListAsync();
            var alerts = await _context.StockAlerts.ToListAsync();
            var alertLookup = alerts.ToDictionary(a => a.ItemId, a => a);
            var now = DateTime.UtcNow;

            foreach (var item in items)
            {
                var determinedType = DetermineAlertType(item);
                if (determinedType != null)
                {
                    if (alertLookup.TryGetValue(item.Id, out var existingAlert))
                    {
                        existingAlert.AlertType = determinedType;
                        existingAlert.AlertDate = now;
                        existingAlert.CurrentStock = item.CurrentStock;
                        existingAlert.MinimumLevel = item.MinStockLevel;
                        existingAlert.Status = "Active";
                        existingAlert.Remarks = existingAlert.Remarks ?? $"Current stock {item.CurrentStock} is below minimum level {item.MinStockLevel}";
                        existingAlert.UpdatedAt = now;
                        existingAlert.ResolvedDate = null;
                        existingAlert.ResolvedBy = null;
                    }
                    else
                    {
                        var newAlert = new StockAlert
                        {
                            ItemId = item.Id,
                            AlertType = determinedType,
                            AlertDate = now,
                            CurrentStock = item.CurrentStock,
                            MinimumLevel = item.MinStockLevel,
                            Status = "Active",
                            Remarks = $"Current stock {item.CurrentStock} is below minimum level {item.MinStockLevel}",
                            CreatedAt = now,
                            UpdatedAt = now,
                            IsActive = true
                        };
                        _context.StockAlerts.Add(newAlert);
                        alertLookup[item.Id] = newAlert;
                    }
                }
                else if (alertLookup.TryGetValue(item.Id, out var resolvedAlert) && resolvedAlert.Status == "Active")
                {
                    resolvedAlert.Status = "Resolved";
                    resolvedAlert.ResolvedDate = now;
                    resolvedAlert.ResolvedBy = "System";
                    resolvedAlert.UpdatedAt = now;
                }
            }

            await _context.SaveChangesAsync();
        }

        private string DetermineAlertType(ItemMaster item)
        {
            if (item == null) return null;
            if (item.CurrentStock <= 0)
            {
                return "Out of Stock";
            }

            if (item.CurrentStock <= item.MinStockLevel)
            {
                return "Low Stock";
            }

            return null;
        }

        private string DeterminePriority(ItemMaster item, string alertType)
        {
            if (alertType == "Out of Stock")
            {
                return "Critical";
            }

            var deficit = (item?.MinStockLevel ?? 0) - (item?.CurrentStock ?? 0);
            if (deficit >= 20)
            {
                return "High";
            }

            if (deficit >= 10)
            {
                return "Medium";
            }

            return "Low";
        }

        private StockAlertResponseDto MapToDto(StockAlert alert)
        {
            var item = alert.Item;
            var alertType = alert.AlertType;
            var priority = DeterminePriority(item, alertType);
            var lastUpdated = alert.UpdatedAt ?? alert.AlertDate;

            return new StockAlertResponseDto
            {
                Id = alert.Id,
                ItemId = alert.ItemId,
                ItemName = item?.Name ?? "Unknown Item",
                ItemCode = item?.Code,
                AlertType = alertType,
                Priority = priority,
                CurrentStock = alert.CurrentStock,
                MinimumLevel = alert.MinimumLevel,
                Status = alert.Status,
                Supplier = item?.Supplier,
                Location = item?.StorageLocation,
                Message = alert.Remarks ?? $"Current stock {alert.CurrentStock} is below minimum {alert.MinimumLevel}",
                AlertedTo = alert.AlertedTo,
                AlertDate = alert.AlertDate,
                ResolvedDate = alert.ResolvedDate,
                ResolvedBy = alert.ResolvedBy,
                LastUpdated = lastUpdated.ToString("yyyy-MM-dd HH:mm"),
                Remarks = alert.Remarks
            };
        }
    }
}
