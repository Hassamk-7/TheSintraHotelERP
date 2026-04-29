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
    public class GuestHistoryController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestHistoryController> _logger;

        public GuestHistoryController(HotelDbContext context, ILogger<GuestHistoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/guesthistory
        [HttpGet]
        public async Task<IActionResult> GetGuestHistory([FromQuery] string? guestName = null, [FromQuery] string? roomNumber = null)
        {
            try
            {
                _logger.LogInformation("Fetching guest history...");

                var query = _context.GuestHistories
                    .Include(gh => gh.Guest)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(guestName))
                {
                    query = query.Where(gh => gh.Guest.FirstName.Contains(guestName) || gh.Guest.LastName.Contains(guestName));
                }

                if (!string.IsNullOrEmpty(roomNumber))
                {
                    query = query.Where(gh => gh.RoomNumber == roomNumber);
                }

                var history = await query
                    .OrderByDescending(gh => gh.CheckOutDate)
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {history.Count} guest history records");

                return Ok(new
                {
                    success = true,
                    message = "Guest history retrieved successfully",
                    data = history,
                    count = history.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching guest history");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve guest history",
                    error = ex.Message
                });
            }
        }

        // GET: api/guesthistory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGuestHistoryRecord(int id)
        {
            try
            {
                var historyRecord = await _context.GuestHistories
                    .Include(gh => gh.Guest)
                    .FirstOrDefaultAsync(gh => gh.Id == id);

                if (historyRecord == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest history record not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Guest history record retrieved successfully",
                    data = historyRecord
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching guest history record with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve guest history record",
                    error = ex.Message
                });
            }
        }

        // GET: api/guesthistory/guest/{guestId}
        [HttpGet("guest/{guestId}")]
        public async Task<IActionResult> GetGuestHistoryByGuest(int guestId)
        {
            try
            {
                var guestHistory = await _context.GuestHistories
                    .Include(gh => gh.Guest)
                    .Where(gh => gh.GuestId == guestId)
                    .OrderByDescending(gh => gh.CheckOutDate)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Guest history retrieved successfully",
                    data = guestHistory,
                    count = guestHistory.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching guest history for guest ID {guestId}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve guest history",
                    error = ex.Message
                });
            }
        }

        // POST: api/guesthistory
        [HttpPost]
        public async Task<IActionResult> CreateGuestHistory([FromBody] GuestHistory guestHistory)
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

                // Generate visit number
                var visitCount = await _context.GuestHistories.Where(gh => gh.GuestId == guestHistory.GuestId).CountAsync();
                guestHistory.VisitNumber = $"V-{guestHistory.GuestId:D4}-{(visitCount + 1):D3}";

                // Set creation timestamp
                guestHistory.CreatedAt = DateTime.UtcNow;
                guestHistory.UpdatedAt = DateTime.UtcNow;

                _context.GuestHistories.Add(guestHistory);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Guest history record created with ID {guestHistory.Id}");

                return CreatedAtAction(nameof(GetGuestHistoryRecord), new { id = guestHistory.Id }, new
                {
                    success = true,
                    message = "Guest history record created successfully",
                    data = guestHistory
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest history record");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to create guest history record",
                    error = ex.Message
                });
            }
        }

        // PUT: api/guesthistory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuestHistory(int id, [FromBody] GuestHistory guestHistory)
        {
            try
            {
                if (id != guestHistory.Id)
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

                var existingHistory = await _context.GuestHistories.FindAsync(id);
                if (existingHistory == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest history record not found"
                    });
                }

                // Update properties
                existingHistory.GuestId = guestHistory.GuestId;
                existingHistory.CheckInDate = guestHistory.CheckInDate;
                existingHistory.CheckOutDate = guestHistory.CheckOutDate;
                existingHistory.RoomNumber = guestHistory.RoomNumber;
                existingHistory.RoomType = guestHistory.RoomType;
                existingHistory.TotalBill = guestHistory.TotalBill;
                existingHistory.AmountPaid = guestHistory.AmountPaid;
                existingHistory.PaymentStatus = guestHistory.PaymentStatus;
                existingHistory.Feedback = guestHistory.Feedback;
                existingHistory.Rating = guestHistory.Rating;
                existingHistory.Purpose = guestHistory.Purpose;
                existingHistory.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Guest history record updated with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Guest history record updated successfully",
                    data = existingHistory
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating guest history record with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update guest history record",
                    error = ex.Message
                });
            }
        }

        // DELETE: api/guesthistory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuestHistory(int id)
        {
            try
            {
                var historyRecord = await _context.GuestHistories.FindAsync(id);
                if (historyRecord == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest history record not found"
                    });
                }

                _context.GuestHistories.Remove(historyRecord);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Guest history record deleted with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Guest history record deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting guest history record with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to delete guest history record",
                    error = ex.Message
                });
            }
        }

        // GET: api/guesthistory/statistics/{guestId}
        [HttpGet("statistics/{guestId}")]
        public async Task<IActionResult> GetGuestStatistics(int guestId)
        {
            try
            {
                var guestHistory = await _context.GuestHistories
                    .Where(gh => gh.GuestId == guestId)
                    .ToListAsync();

                var statistics = new
                {
                    TotalVisits = guestHistory.Count,
                    TotalSpent = guestHistory.Sum(gh => gh.TotalBill),
                    TotalPaid = guestHistory.Sum(gh => gh.AmountPaid),
                    AverageRating = guestHistory.Where(gh => gh.Rating > 0).Average(gh => (double?)gh.Rating) ?? 0,
                    LastVisit = guestHistory.OrderByDescending(gh => gh.CheckOutDate).FirstOrDefault()?.CheckOutDate,
                    FavoriteRoomType = guestHistory.GroupBy(gh => gh.RoomType)
                        .OrderByDescending(g => g.Count())
                        .FirstOrDefault()?.Key ?? "N/A",
                    TotalNights = guestHistory.Sum(gh => (gh.CheckOutDate - gh.CheckInDate).Days)
                };

                return Ok(new
                {
                    success = true,
                    message = "Guest statistics retrieved successfully",
                    data = statistics
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching guest statistics for guest ID {guestId}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve guest statistics",
                    error = ex.Message
                });
            }
        }
    }
}
