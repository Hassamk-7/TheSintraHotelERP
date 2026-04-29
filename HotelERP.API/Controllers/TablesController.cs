using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager,Receptionist")] // Temporarily disabled for testing
    public class TablesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<TablesController> _logger;

        public TablesController(HotelDbContext context, ILogger<TablesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/tables
        [HttpGet]
        public async Task<IActionResult> GetTables([FromQuery] int? hotelId = null, [FromQuery] string location = null, [FromQuery] string status = null)
        {
            try
            {
                var query = _context.TableMasters.AsQueryable();

                if (!string.IsNullOrEmpty(location))
                {
                    query = query.Where(t => t.Location.Contains(location));
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(t => t.Status == status);
                }

                var tables = await query.OrderBy(t => t.TableNumber).ToListAsync();
                return HandleSuccess(tables);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tables");
                return HandleError("An error occurred while retrieving tables");
            }
        }

        // GET: api/tables/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTable(int id)
        {
            try
            {
                var table = await _context.TableMasters.FindAsync(id);

                if (table == null)
                {
                    return HandleNotFound("Table not found");
                }

                return HandleSuccess(table);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving table with ID: {id}");
                return HandleError($"An error occurred while retrieving table with ID: {id}");
            }
        }

        // POST: api/tables
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateTable([FromBody] TableCreateDto tableDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid table data");
            }

            try
            {
                if (!tableDto.HotelId.HasValue || tableDto.HotelId.Value <= 0)
                {
                    return HandleError("Hotel is required");
                }

                var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == tableDto.HotelId.Value && h.IsActive);
                if (!hotelExists)
                {
                    return HandleError("Invalid hotel");
                }

                var table = new TableMaster
                {
                    HotelId = tableDto.HotelId.Value,
                    TableNumber = tableDto.TableNumber,
                    TableCode = tableDto.TableCode,
                    Capacity = tableDto.Capacity,
                    Location = tableDto.Location,
                    TableType = tableDto.TableType,
                    Shape = tableDto.Shape,
                    Description = tableDto.Description,
                    IsReservable = tableDto.IsReservable,
                    HasView = tableDto.HasView,
                    Features = tableDto.Features != null ? string.Join(",", tableDto.Features) : null,
                    MinOrderAmount = tableDto.MinOrderAmount,
                    Status = "Available",
                    FloorNumber = tableDto.FloorNumber
                };

                _context.TableMasters.Add(table);
                await _context.SaveChangesAsync();

                return HandleCreated(table, "Table created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating table");
                return HandleError("An error occurred while creating the table");
            }
        }

        // PUT: api/tables/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateTable(int id, [FromBody] TableUpdateDto tableDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid table data");
            }

            try
            {
                var table = await _context.TableMasters.FindAsync(id);

                if (table == null)
                {
                    return HandleNotFound("Table not found");
                }

                table.TableNumber = tableDto.TableNumber ?? table.TableNumber;
                table.TableCode = tableDto.TableCode ?? table.TableCode;
                table.Capacity = tableDto.Capacity ?? table.Capacity;
                table.Location = tableDto.Location ?? table.Location;
                table.TableType = tableDto.TableType ?? table.TableType;
                table.Shape = tableDto.Shape ?? table.Shape;
                table.Description = tableDto.Description ?? table.Description;
                table.IsReservable = tableDto.IsReservable ?? table.IsReservable;
                table.HasView = tableDto.HasView ?? table.HasView;
                table.Features = tableDto.Features != null ? string.Join(",", tableDto.Features) : table.Features;
                table.MinOrderAmount = tableDto.MinOrderAmount ?? table.MinOrderAmount;
                table.Status = tableDto.Status ?? table.Status;
                table.FloorNumber = tableDto.FloorNumber ?? table.FloorNumber;

                if (tableDto.HotelId.HasValue && tableDto.HotelId.Value > 0)
                {
                    var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == tableDto.HotelId.Value && h.IsActive);
                    if (!hotelExists)
                    {
                        return HandleError("Invalid hotel");
                    }
                    table.HotelId = tableDto.HotelId.Value;
                }

                await _context.SaveChangesAsync();

                return HandleSuccess(table, "Table updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating table with ID: {id}");
                return HandleError($"An error occurred while updating table with ID: {id}");
            }
        }

        // DELETE: api/tables/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteTable(int id)
        {
            try
            {
                var table = await _context.TableMasters.FindAsync(id);
                if (table == null)
                {
                    return HandleNotFound("Table not found");
                }

                _context.TableMasters.Remove(table);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Table deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting table with ID: {id}");
                return HandleError($"An error occurred while deleting table with ID: {id}");
            }
        }
    }
}
