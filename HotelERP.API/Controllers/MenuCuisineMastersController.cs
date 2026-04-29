using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class MenuCuisineMastersController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<MenuCuisineMastersController> _logger;

        public MenuCuisineMastersController(HotelDbContext context, ILogger<MenuCuisineMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 200, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.MenuCuisineMasters.Where(x => x.IsActive);
                if (!string.IsNullOrWhiteSpace(search))
                    query = query.Where(x => x.Name.Contains(search) || x.Code.Contains(search));

                var totalCount = await query.CountAsync();
                var data = await query
                    .OrderBy(x => x.DisplayOrder)
                    .ThenBy(x => x.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving menu cuisine masters");
                return StatusCode(500, new { success = false, message = "Error retrieving cuisines" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MenuCuisineMaster model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                var code = (model.Code ?? string.Empty).Trim().ToUpperInvariant();
                if (string.IsNullOrWhiteSpace(code))
                    return BadRequest(new { success = false, message = "Code is required" });

                var exists = await _context.MenuCuisineMasters.AnyAsync(x => x.IsActive && x.Code == code);
                if (exists)
                    return BadRequest(new { success = false, message = "Code already exists" });

                model.Code = code;
                model.Name = (model.Name ?? string.Empty).Trim();
                model.Description = model.Description ?? string.Empty;
                model.IsActive = true;
                model.CreatedAt = DateTime.UtcNow;
                model.UpdatedAt = DateTime.UtcNow;

                _context.MenuCuisineMasters.Add(model);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = model.Id }, new { success = true, data = model, message = "Menu cuisine created" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating menu cuisine master");
                return StatusCode(500, new { success = false, message = "Error creating menu cuisine" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MenuCuisineMaster model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                var existing = await _context.MenuCuisineMasters.FindAsync(id);
                if (existing == null || !existing.IsActive)
                    return NotFound(new { success = false, message = "Menu cuisine not found" });

                var code = (model.Code ?? string.Empty).Trim().ToUpperInvariant();
                if (string.IsNullOrWhiteSpace(code))
                    return BadRequest(new { success = false, message = "Code is required" });

                var exists = await _context.MenuCuisineMasters.AnyAsync(x => x.IsActive && x.Id != id && x.Code == code);
                if (exists)
                    return BadRequest(new { success = false, message = "Code already exists" });

                existing.Name = (model.Name ?? string.Empty).Trim();
                existing.Code = code;
                existing.Description = model.Description ?? string.Empty;
                existing.DisplayOrder = model.DisplayOrder;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = existing, message = "Menu cuisine updated" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating menu cuisine master");
                return StatusCode(500, new { success = false, message = "Error updating menu cuisine" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existing = await _context.MenuCuisineMasters.FindAsync(id);
                if (existing == null || !existing.IsActive)
                    return NotFound(new { success = false, message = "Menu cuisine not found" });

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Menu cuisine deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting menu cuisine master");
                return StatusCode(500, new { success = false, message = "Error deleting menu cuisine" });
            }
        }
    }
}
