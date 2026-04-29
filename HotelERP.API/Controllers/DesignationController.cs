using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesignationController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DesignationController> _logger;

        public DesignationController(HotelDbContext context, ILogger<DesignationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("designations")]
        public async Task<IActionResult> GetDesignations([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] int? departmentId = null)
        {
            try
            {
                var query = _context.Designations.Where(d => d.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(d => d.Title.Contains(search) || d.Code.Contains(search));
                }

                if (departmentId.HasValue)
                {
                    query = query.Where(d => d.DepartmentId == departmentId.Value);
                }

                var total = await query.CountAsync();
                var designations = await query
                    .Include(d => d.Department)
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = designations,
                    total = total,
                    page = page,
                    pageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving designations");
                return StatusCode(500, new { success = false, message = "Error retrieving designations" });
            }
        }

        [HttpGet("designations/{id}")]
        public async Task<IActionResult> GetDesignation(int id)
        {
            try
            {
                var designation = await _context.Designations
                    .Include(d => d.Department)
                    .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

                if (designation == null)
                    return NotFound(new { success = false, message = "Designation not found" });

                return Ok(new { success = true, data = designation });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving designation");
                return StatusCode(500, new { success = false, message = "Error retrieving designation" });
            }
        }

        [HttpPost("designations")]
        public async Task<IActionResult> CreateDesignation([FromBody] Designation designation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if designation code already exists
                var existingDesig = await _context.Designations.AnyAsync(d => d.Code == designation.Code && d.IsActive);
                if (existingDesig)
                    return BadRequest(new { success = false, message = "Designation code already exists" });

                // Verify department exists
                var deptExists = await _context.Departments.AnyAsync(d => d.Id == designation.DepartmentId && d.IsActive);
                if (!deptExists)
                    return BadRequest(new { success = false, message = "Department not found" });

                designation.IsActive = true;
                designation.CreatedAt = DateTime.UtcNow;
                designation.UpdatedAt = DateTime.UtcNow;

                _context.Designations.Add(designation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDesignation), new { id = designation.Id },
                    new { success = true, data = designation, message = "Designation created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating designation");
                return StatusCode(500, new { success = false, message = "Error creating designation" });
            }
        }

        [HttpPut("designations/{id}")]
        public async Task<IActionResult> UpdateDesignation(int id, [FromBody] Designation designation)
        {
            try
            {
                var existingDesig = await _context.Designations.FindAsync(id);
                if (existingDesig == null || !existingDesig.IsActive)
                    return NotFound(new { success = false, message = "Designation not found" });

                // Verify department exists if changed
                if (designation.DepartmentId != existingDesig.DepartmentId)
                {
                    var deptExists = await _context.Departments.AnyAsync(d => d.Id == designation.DepartmentId && d.IsActive);
                    if (!deptExists)
                        return BadRequest(new { success = false, message = "Department not found" });
                }

                // Update properties
                existingDesig.Title = designation.Title ?? existingDesig.Title;
                existingDesig.Code = designation.Code ?? existingDesig.Code;
                existingDesig.Description = designation.Description;
                existingDesig.DepartmentId = designation.DepartmentId;
                existingDesig.Level = designation.Level;
                existingDesig.MinSalary = designation.MinSalary;
                existingDesig.MaxSalary = designation.MaxSalary;
                existingDesig.Responsibilities = designation.Responsibilities;
                existingDesig.Requirements = designation.Requirements;
                existingDesig.Skills = designation.Skills;
                existingDesig.ReportsToDesignationId = designation.ReportsToDesignationId;
                existingDesig.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Designation updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating designation");
                return StatusCode(500, new { success = false, message = "Error updating designation" });
            }
        }

        [HttpDelete("designations/{id}")]
        public async Task<IActionResult> DeleteDesignation(int id)
        {
            try
            {
                var designation = await _context.Designations.FindAsync(id);
                if (designation == null || !designation.IsActive)
                    return NotFound(new { success = false, message = "Designation not found" });

                designation.IsActive = false;
                designation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Designation deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting designation");
                return StatusCode(500, new { success = false, message = "Error deleting designation" });
            }
        }
    }
}
