using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    public class RoomTransfersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RoomTransfersController> _logger;

        public RoomTransfersController(HotelDbContext context, ILogger<RoomTransfersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/roomtransfers
        [HttpGet]
        public async Task<IActionResult> GetRoomTransfers()
        {
            try
            {
                _logger.LogInformation("Fetching room transfers...");

                var transfers = await _context.RoomTransfers
                    .Include(rt => rt.CheckIn)
                    .Include(rt => rt.FromRoom)
                    .Include(rt => rt.ToRoom)
                    .OrderByDescending(rt => rt.TransferDate)
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {transfers.Count} room transfers");

                return Ok(new
                {
                    success = true,
                    message = "Room transfers retrieved successfully",
                    data = transfers,
                    count = transfers.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching room transfers");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve room transfers",
                    error = ex.Message
                });
            }
        }

        // GET: api/roomtransfers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomTransfer(int id)
        {
            try
            {
                var transfer = await _context.RoomTransfers
                    .Include(rt => rt.CheckIn)
                    .Include(rt => rt.FromRoom)
                    .Include(rt => rt.ToRoom)
                    .FirstOrDefaultAsync(rt => rt.Id == id);

                if (transfer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Room transfer not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Room transfer retrieved successfully",
                    data = transfer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching room transfer with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve room transfer",
                    error = ex.Message
                });
            }
        }

        // POST: api/roomtransfers
        [HttpPost]
        public async Task<IActionResult> CreateRoomTransfer([FromBody] RoomTransfer roomTransfer)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid data provided",
                        errors = ModelState
                    });
                }

                // Generate transfer number
                var transferCount = await _context.RoomTransfers.CountAsync();
                roomTransfer.TransferNumber = $"RT-{DateTime.Now:yyyyMMdd}-{(transferCount + 1):D4}";

                // Set creation timestamp
                roomTransfer.CreatedAt = DateTime.UtcNow;
                roomTransfer.UpdatedAt = DateTime.UtcNow;

                _context.RoomTransfers.Add(roomTransfer);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Room transfer created with ID {roomTransfer.Id}");

                return CreatedAtAction(nameof(GetRoomTransfer), new { id = roomTransfer.Id }, new
                {
                    success = true,
                    message = "Room transfer created successfully",
                    data = roomTransfer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room transfer");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to create room transfer",
                    error = ex.Message
                });
            }
        }

        // PUT: api/roomtransfers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomTransfer(int id, [FromBody] RoomTransfer roomTransfer)
        {
            try
            {
                if (id != roomTransfer.Id)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID mismatch"
                    });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid data provided",
                        errors = ModelState
                    });
                }

                var existingTransfer = await _context.RoomTransfers.FindAsync(id);
                if (existingTransfer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Room transfer not found"
                    });
                }

                // Update properties
                existingTransfer.CheckInId = roomTransfer.CheckInId;
                existingTransfer.FromRoomId = roomTransfer.FromRoomId;
                existingTransfer.ToRoomId = roomTransfer.ToRoomId;
                existingTransfer.TransferDate = roomTransfer.TransferDate;
                existingTransfer.Reason = roomTransfer.Reason;
                existingTransfer.Status = roomTransfer.Status;
                existingTransfer.AuthorizedBy = roomTransfer.AuthorizedBy;
                existingTransfer.ProcessedBy = roomTransfer.ProcessedBy;
                existingTransfer.AdditionalCharges = roomTransfer.AdditionalCharges;
                existingTransfer.Remarks = roomTransfer.Remarks;
                existingTransfer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Room transfer updated with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Room transfer updated successfully",
                    data = existingTransfer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating room transfer with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update room transfer",
                    error = ex.Message
                });
            }
        }

        // DELETE: api/roomtransfers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomTransfer(int id)
        {
            try
            {
                var transfer = await _context.RoomTransfers.FindAsync(id);
                if (transfer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Room transfer not found"
                    });
                }

                _context.RoomTransfers.Remove(transfer);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Room transfer deleted with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Room transfer deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting room transfer with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to delete room transfer",
                    error = ex.Message
                });
            }
        }

        // PUT: api/roomtransfers/{id}/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveRoomTransfer(int id, [FromBody] ApprovalRequest request)
        {
            try
            {
                var transfer = await _context.RoomTransfers.FindAsync(id);
                if (transfer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Room transfer not found"
                    });
                }

                transfer.Status = "Approved";
                transfer.AuthorizedBy = request.ApprovedBy;
                transfer.Remarks = request.Remarks;
                transfer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Room transfer approved with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Room transfer approved successfully",
                    data = transfer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error approving room transfer with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to approve room transfer",
                    error = ex.Message
                });
            }
        }

        // PUT: api/roomtransfers/{id}/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectRoomTransfer(int id, [FromBody] ApprovalRequest request)
        {
            try
            {
                var transfer = await _context.RoomTransfers.FindAsync(id);
                if (transfer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Room transfer not found"
                    });
                }

                transfer.Status = "Rejected";
                transfer.AuthorizedBy = request.ApprovedBy;
                transfer.Remarks = request.Remarks;
                transfer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Room transfer rejected with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Room transfer rejected successfully",
                    data = transfer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error rejecting room transfer with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to reject room transfer",
                    error = ex.Message
                });
            }
        }
    }

    public class ApprovalRequest
    {
        public string ApprovedBy { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }
}
