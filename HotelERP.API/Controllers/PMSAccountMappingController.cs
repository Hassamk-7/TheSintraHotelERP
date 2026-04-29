using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PMSAccountMappingController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<PMSAccountMappingController> _logger;

        public PMSAccountMappingController(HotelDbContext context, ILogger<PMSAccountMappingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetMappings(
            [FromQuery] int page = 1,
            [FromQuery] int perPage = 50,
            [FromQuery] string search = "",
            [FromQuery] string pmsType = "")
        {
            try
            {
                var query = _context.PMSAccountMappings.Where(m => m.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(m =>
                        m.PMSCode.Contains(search) ||
                        m.PMSDescription.Contains(search) ||
                        m.GLAccountCode.Contains(search));
                }

                if (!string.IsNullOrEmpty(pmsType))
                {
                    query = query.Where(m => m.PMSType == pmsType);
                }

                var totalRecords = await query.CountAsync();

                var mappings = await query
                    .OrderBy(m => m.PMSType)
                    .ThenBy(m => m.PMSCode)
                    .Skip((page - 1) * perPage)
                    .Take(perPage)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = mappings,
                    pagination = new
                    {
                        page,
                        perPage,
                        totalRecords,
                        totalPages = (int)Math.Ceiling(totalRecords / (double)perPage)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching PMS mappings");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMapping(int id)
        {
            try
            {
                var mapping = await _context.PMSAccountMappings.FindAsync(id);
                if (mapping == null)
                {
                    return NotFound(new { success = false, message = "Mapping not found" });
                }

                return Ok(new { success = true, data = mapping });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching mapping");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateMapping([FromBody] PMSAccountMapping mapping)
        {
            try
            {
                if (await _context.PMSAccountMappings.AnyAsync(m => m.PMSCode == mapping.PMSCode && m.IsActive))
                {
                    return BadRequest(new { success = false, message = "PMS code already exists" });
                }

                mapping.IsActive = true;
                mapping.CreatedAt = DateTime.UtcNow;
                _context.PMSAccountMappings.Add(mapping);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMapping), new { id = mapping.Id },
                    new { success = true, data = mapping, message = "Mapping created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating mapping");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMapping(int id, [FromBody] PMSAccountMapping mapping)
        {
            try
            {
                var existing = await _context.PMSAccountMappings.FindAsync(id);
                if (existing == null)
                {
                    return NotFound(new { success = false, message = "Mapping not found" });
                }

                existing.PMSCode = mapping.PMSCode;
                existing.PMSDescription = mapping.PMSDescription;
                existing.PMSType = mapping.PMSType;
                existing.GLAccountCode = mapping.GLAccountCode;
                existing.GLAccountName = mapping.GLAccountName;
                existing.DepartmentCode = mapping.DepartmentCode;
                existing.DepartmentName = mapping.DepartmentName;
                existing.MappingRule = mapping.MappingRule;
                existing.Notes = mapping.Notes;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existing, message = "Mapping updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating mapping");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMapping(int id)
        {
            try
            {
                var mapping = await _context.PMSAccountMappings.FindAsync(id);
                if (mapping == null)
                {
                    return NotFound(new { success = false, message = "Mapping not found" });
                }

                mapping.IsActive = false;
                mapping.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Mapping deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting mapping");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
