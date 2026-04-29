using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class LeaveManagementController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<LeaveManagementController> _logger;

        public LeaveManagementController(HotelDbContext context, ILogger<LeaveManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/LeaveManagement
        [HttpGet]
        public async Task<IActionResult> GetLeaves([FromQuery] int page = 1, [FromQuery] int pageSize = 10, 
            [FromQuery] string status = "", [FromQuery] int? employeeId = null, [FromQuery] string leaveType = "")
        {
            try
            {
                var query = _context.LeaveManagements.Include(l => l.Employee).Where(l => l.IsActive);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(l => l.Status == status);

                if (employeeId.HasValue)
                    query = query.Where(l => l.EmployeeId == employeeId.Value);

                if (!string.IsNullOrEmpty(leaveType))
                    query = query.Where(l => l.LeaveType == leaveType);

                var totalCount = await query.CountAsync();
                var leaves = await query
                    .OrderByDescending(l => l.FromDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = leaves, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving leaves");
                return StatusCode(500, new { success = false, message = "Error retrieving leaves" });
            }
        }

        // GET: api/LeaveManagement/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeave(int id)
        {
            try
            {
                var leave = await _context.LeaveManagements
                    .Include(l => l.Employee)
                    .FirstOrDefaultAsync(l => l.Id == id && l.IsActive);

                if (leave == null)
                    return NotFound(new { success = false, message = "Leave request not found" });

                return Ok(new { success = true, data = leave });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving leave");
                return StatusCode(500, new { success = false, message = "Error retrieving leave" });
            }
        }

        // POST: api/LeaveManagement
        [HttpPost]
        public async Task<IActionResult> CreateLeave([FromBody] LeaveManagement leave)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Validate dates
                if (leave.FromDate >= leave.ToDate)
                    return BadRequest(new { success = false, message = "From date must be before to date" });

                // Check if employee exists
                var employee = await _context.Employees.FindAsync(leave.EmployeeId);
                if (employee == null)
                    return BadRequest(new { success = false, message = "Employee not found" });

                // Calculate total days
                leave.TotalDays = (int)Math.Ceiling((leave.ToDate - leave.FromDate).TotalDays) + 1;

                leave.LeaveNumber = $"LV-{DateTime.UtcNow.Ticks}";
                leave.Status = leave.Status ?? "Pending";
                leave.IsActive = true;
                leave.CreatedAt = DateTime.UtcNow;
                leave.UpdatedAt = DateTime.UtcNow;

                _context.LeaveManagements.Add(leave);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLeave), new { id = leave.Id },
                    new { success = true, data = leave, message = "Leave request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating leave");
                return StatusCode(500, new { success = false, message = "Error creating leave" });
            }
        }

        // PUT: api/LeaveManagement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeave(int id, [FromBody] LeaveManagement leave)
        {
            try
            {
                var existingLeave = await _context.LeaveManagements.FindAsync(id);
                if (existingLeave == null || !existingLeave.IsActive)
                    return NotFound(new { success = false, message = "Leave request not found" });

                // Validate dates
                if (leave.FromDate >= leave.ToDate)
                    return BadRequest(new { success = false, message = "From date must be before to date" });

                existingLeave.EmployeeId = leave.EmployeeId;
                existingLeave.LeaveType = leave.LeaveType;
                existingLeave.FromDate = leave.FromDate;
                existingLeave.ToDate = leave.ToDate;
                existingLeave.TotalDays = (int)Math.Ceiling((leave.ToDate - leave.FromDate).TotalDays) + 1;
                existingLeave.Reason = leave.Reason;
                existingLeave.Status = leave.Status;
                existingLeave.ApprovedBy = leave.ApprovedBy;
                existingLeave.ApprovalDate = leave.ApprovalDate;
                existingLeave.ApprovalRemarks = leave.ApprovalRemarks;
                existingLeave.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Leave request updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating leave");
                return StatusCode(500, new { success = false, message = "Error updating leave" });
            }
        }

        // PUT: api/LeaveManagement/5/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveLeave(int id, [FromBody] ApproveLeaveDto dto)
        {
            try
            {
                var leave = await _context.LeaveManagements.FindAsync(id);
                if (leave == null || !leave.IsActive)
                    return NotFound(new { success = false, message = "Leave request not found" });

                leave.Status = "Approved";
                leave.ApprovedBy = dto?.ApprovedBy ?? "Admin";
                leave.ApprovalDate = DateTime.UtcNow;
                leave.ApprovalRemarks = dto?.Remarks ?? "";
                leave.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Leave request approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving leave");
                return StatusCode(500, new { success = false, message = "Error approving leave" });
            }
        }

        // PUT: api/LeaveManagement/5/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectLeave(int id, [FromBody] RejectLeaveDto dto)
        {
            try
            {
                var leave = await _context.LeaveManagements.FindAsync(id);
                if (leave == null || !leave.IsActive)
                    return NotFound(new { success = false, message = "Leave request not found" });

                leave.Status = "Rejected";
                leave.ApprovedBy = dto?.RejectedBy ?? "Admin";
                leave.ApprovalDate = DateTime.UtcNow;
                leave.ApprovalRemarks = dto?.Remarks ?? "";
                leave.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Leave request rejected successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting leave");
                return StatusCode(500, new { success = false, message = "Error rejecting leave" });
            }
        }

        // DELETE: api/LeaveManagement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeave(int id)
        {
            try
            {
                var leave = await _context.LeaveManagements.FindAsync(id);
                if (leave == null || !leave.IsActive)
                    return NotFound(new { success = false, message = "Leave request not found" });

                leave.IsActive = false;
                leave.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Leave request deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting leave");
                return StatusCode(500, new { success = false, message = "Error deleting leave" });
            }
        }

        // GET: api/LeaveManagement/statistics
        [HttpGet("statistics/summary")]
        public async Task<IActionResult> GetLeaveStatistics()
        {
            try
            {
                var leaves = await _context.LeaveManagements.Where(l => l.IsActive).ToListAsync();

                var statistics = new
                {
                    totalRequests = leaves.Count,
                    approved = leaves.Count(l => l.Status == "Approved"),
                    pending = leaves.Count(l => l.Status == "Pending"),
                    rejected = leaves.Count(l => l.Status == "Rejected"),
                    totalDaysApproved = leaves.Where(l => l.Status == "Approved").Sum(l => l.TotalDays),
                    byLeaveType = leaves.GroupBy(l => l.LeaveType)
                        .Select(g => new { leaveType = g.Key, count = g.Count(), totalDays = g.Sum(l => l.TotalDays) })
                        .ToList()
                };

                return Ok(new { success = true, data = statistics });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving statistics");
                return StatusCode(500, new { success = false, message = "Error retrieving statistics" });
            }
        }
    }

    // DTOs
    public class ApproveLeaveDto
    {
        public string ApprovedBy { get; set; }
        public string Remarks { get; set; }
    }

    public class RejectLeaveDto
    {
        public string RejectedBy { get; set; }
        public string Remarks { get; set; }
    }
}
