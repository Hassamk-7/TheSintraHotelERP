using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdTypesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<IdTypesController> _logger;

        public IdTypesController(HotelDbContext context, ILogger<IdTypesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/idtypes
        [HttpGet]
        public async Task<IActionResult> GetIdTypes([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.IdTypes.Where(i => i.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(i => i.Name.Contains(search) || 
                                           i.Code.Contains(search) ||
                                           i.Country.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var idTypes = await query
                    .OrderBy(i => i.DisplayOrder)
                    .ThenBy(i => i.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(i => new IdTypeDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Code = i.Code,
                        Description = i.Description,
                        IsRequired = i.IsRequired,
                        Country = i.Country,
                        DisplayOrder = i.DisplayOrder,
                        IsActive = i.IsActive,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = idTypes, 
                    totalCount, 
                    page, 
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ID types");
                return StatusCode(500, new { success = false, message = "Error retrieving ID types" });
            }
        }

        // GET: api/idtypes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIdType(int id)
        {
            try
            {
                var idType = await _context.IdTypes
                    .Where(i => i.Id == id && i.IsActive)
                    .Select(i => new IdTypeDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Code = i.Code,
                        Description = i.Description,
                        IsRequired = i.IsRequired,
                        Country = i.Country,
                        DisplayOrder = i.DisplayOrder,
                        IsActive = i.IsActive,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (idType == null)
                {
                    return NotFound(new { success = false, message = "ID type not found" });
                }

                return Ok(new { success = true, data = idType });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ID type with ID {IdTypeId}", id);
                return StatusCode(500, new { success = false, message = "Error retrieving ID type" });
            }
        }

        // POST: api/idtypes
        [HttpPost]
        public async Task<IActionResult> CreateIdType([FromBody] CreateIdTypeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                // Check if code already exists
                var existingIdType = await _context.IdTypes
                    .AnyAsync(i => i.Code == dto.Code && i.IsActive);

                if (existingIdType)
                {
                    return BadRequest(new { success = false, message = "ID type code already exists" });
                }

                var idType = new IdType
                {
                    Name = dto.Name,
                    Code = dto.Code.ToUpper(),
                    Description = dto.Description ?? "",
                    IsRequired = dto.IsRequired,
                    Country = dto.Country ?? "Pakistan",
                    DisplayOrder = dto.DisplayOrder,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.IdTypes.Add(idType);
                await _context.SaveChangesAsync();

                var idTypeDto = new IdTypeDto
                {
                    Id = idType.Id,
                    Name = idType.Name,
                    Code = idType.Code,
                    Description = idType.Description,
                    IsRequired = idType.IsRequired,
                    Country = idType.Country,
                    DisplayOrder = idType.DisplayOrder,
                    IsActive = idType.IsActive,
                    CreatedAt = idType.CreatedAt,
                    UpdatedAt = idType.UpdatedAt
                };

                return CreatedAtAction(nameof(GetIdType), new { id = idType.Id },
                    new { success = true, data = idTypeDto, message = "ID type created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating ID type");
                return StatusCode(500, new { success = false, message = "Error creating ID type", error = ex.Message });
            }
        }

        // PUT: api/idtypes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIdType(int id, [FromBody] UpdateIdTypeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                var idType = await _context.IdTypes.FindAsync(id);
                if (idType == null || !idType.IsActive)
                {
                    return NotFound(new { success = false, message = "ID type not found" });
                }

                // Check if code already exists (excluding current ID type)
                var existingIdType = await _context.IdTypes
                    .AnyAsync(i => i.Code == dto.Code && i.Id != id && i.IsActive);

                if (existingIdType)
                {
                    return BadRequest(new { success = false, message = "ID type code already exists" });
                }

                // Update properties
                idType.Name = dto.Name;
                idType.Code = dto.Code.ToUpper();
                idType.Description = dto.Description ?? "";
                idType.IsRequired = dto.IsRequired;
                idType.Country = dto.Country ?? "Pakistan";
                idType.DisplayOrder = dto.DisplayOrder;
                idType.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "ID type updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ID type with ID {IdTypeId}", id);
                return StatusCode(500, new { success = false, message = "Error updating ID type" });
            }
        }

        // DELETE: api/idtypes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdType(int id)
        {
            try
            {
                var idType = await _context.IdTypes.FindAsync(id);
                if (idType == null || !idType.IsActive)
                {
                    return NotFound(new { success = false, message = "ID type not found" });
                }

                // Soft delete
                idType.IsActive = false;
                idType.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "ID type deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting ID type with ID {IdTypeId}", id);
                return StatusCode(500, new { success = false, message = "Error deleting ID type" });
            }
        }
    }
}

