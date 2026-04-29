using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(HotelDbContext context, ILogger<DepartmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Departments.Where(d => d.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(d => d.Name.Contains(search) || d.Code.Contains(search));
                }

                var total = await query.CountAsync();
                var departments = await query
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = departments,
                    total = total,
                    page = page,
                    pageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving departments");
                return StatusCode(500, new { success = false, message = "Error retrieving departments" });
            }
        }

        [HttpGet("departments/{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            try
            {
                var department = await _context.Departments
                    .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

                if (department == null)
                    return NotFound(new { success = false, message = "Department not found" });

                return Ok(new { success = true, data = department });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving department");
                return StatusCode(500, new { success = false, message = "Error retrieving department" });
            }
        }

        [HttpPost("departments")]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if department code already exists
                var existingDept = await _context.Departments.AnyAsync(d => d.Code == department.Code && d.IsActive);
                if (existingDept)
                    return BadRequest(new { success = false, message = "Department code already exists" });

                department.IsActive = true;
                department.CreatedAt = DateTime.UtcNow;
                department.UpdatedAt = DateTime.UtcNow;

                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDepartment), new { id = department.Id },
                    new { success = true, data = department, message = "Department created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating department");
                return StatusCode(500, new { success = false, message = "Error creating department" });
            }
        }

        [HttpPut("departments/{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {
            try
            {
                var existingDept = await _context.Departments.FindAsync(id);
                if (existingDept == null || !existingDept.IsActive)
                    return NotFound(new { success = false, message = "Department not found" });

                // Update properties
                existingDept.Name = department.Name ?? existingDept.Name;
                existingDept.Code = department.Code ?? existingDept.Code;
                existingDept.Description = department.Description;
                existingDept.ParentDepartmentId = department.ParentDepartmentId;
                existingDept.HeadOfDepartment = department.HeadOfDepartment;
                existingDept.Location = department.Location;
                existingDept.Phone = department.Phone;
                existingDept.Email = department.Email;
                existingDept.Budget = department.Budget;
                existingDept.CostCenter = department.CostCenter;
                existingDept.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Department updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating department");
                return StatusCode(500, new { success = false, message = "Error updating department" });
            }
        }

        [HttpDelete("departments/{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null || !department.IsActive)
                    return NotFound(new { success = false, message = "Department not found" });

                department.IsActive = false;
                department.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Department deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting department");
                return StatusCode(500, new { success = false, message = "Error deleting department" });
            }
        }
    }
}
