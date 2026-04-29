using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class HousekeepingController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<HousekeepingController> _logger;

        public HousekeepingController(HotelDbContext context, ILogger<HousekeepingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // HOUSEKEEPING ROOM STATUS ENDPOINTS
        [HttpGet("room-status")]
        public async Task<IActionResult> GetHousekeepingRoomStatus([FromQuery] string cleaningStatus = "", [FromQuery] string occupancyStatus = "", [FromQuery] string assignedHousekeeper = "")
        {
            try
            {
                var query = _context.HousekeepingRoomStatuses.Include(r => r.Room).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(cleaningStatus))
                    query = query.Where(r => r.CleaningStatus == cleaningStatus);
                
                if (!string.IsNullOrEmpty(occupancyStatus))
                    query = query.Where(r => r.OccupancyStatus == occupancyStatus);
                
                if (!string.IsNullOrEmpty(assignedHousekeeper))
                    query = query.Where(r => r.AssignedHousekeeper == assignedHousekeeper);

                var roomStatuses = await query
                    .OrderBy(r => r.Room.RoomNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = roomStatuses });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving housekeeping room status");
                return StatusCode(500, new { success = false, message = "Error retrieving housekeeping room status" });
            }
        }

        [HttpGet("room-status/{roomId}")]
        public async Task<IActionResult> GetRoomStatus(int roomId)
        {
            try
            {
                var roomStatus = await _context.HousekeepingRoomStatuses
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.RoomId == roomId && r.IsActive);

                if (roomStatus == null)
                    return NotFound(new { success = false, message = "Room status not found" });

                return Ok(new { success = true, data = roomStatus });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room status");
                return StatusCode(500, new { success = false, message = "Error retrieving room status" });
            }
        }

        [HttpPost("room-status")]
        public async Task<IActionResult> CreateRoomStatus([FromBody] HousekeepingRoomStatus roomStatus)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if room status already exists
                var existingStatus = await _context.HousekeepingRoomStatuses.AnyAsync(r => r.RoomId == roomStatus.RoomId && r.IsActive);
                if (existingStatus)
                    return BadRequest(new { success = false, message = "Room status already exists" });

                roomStatus.LastCleaned = DateTime.UtcNow;
                roomStatus.IsActive = true;
                roomStatus.CreatedAt = DateTime.UtcNow;
                roomStatus.UpdatedAt = DateTime.UtcNow;

                _context.HousekeepingRoomStatuses.Add(roomStatus);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = roomStatus, message = "Room status created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room status");
                return StatusCode(500, new { success = false, message = "Error creating room status" });
            }
        }

        [HttpPut("room-status/{roomId}")]
        public async Task<IActionResult> UpdateRoomStatus(int roomId, [FromBody] HousekeepingRoomStatus roomStatus)
        {
            try
            {
                var existingStatus = await _context.HousekeepingRoomStatuses.FirstOrDefaultAsync(r => r.RoomId == roomId && r.IsActive);
                if (existingStatus == null)
                    return NotFound(new { success = false, message = "Room status not found" });

                existingStatus.CleaningStatus = roomStatus.CleaningStatus;
                existingStatus.OccupancyStatus = roomStatus.OccupancyStatus;
                existingStatus.AssignedHousekeeper = roomStatus.AssignedHousekeeper;
                existingStatus.CleaningNotes = roomStatus.CleaningNotes;
                existingStatus.RequiresInspection = roomStatus.RequiresInspection;
                existingStatus.NextCleaningScheduled = roomStatus.NextCleaningScheduled;
                
                if (roomStatus.CleaningStatus == "Clean")
                    existingStatus.LastCleaned = DateTime.UtcNow;

                existingStatus.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room status");
                return StatusCode(500, new { success = false, message = "Error updating room status" });
            }
        }

        // CLEANING SCHEDULE ENDPOINTS


        [HttpPut("cleaning-schedule/{id}/status")]
        public async Task<IActionResult> UpdateCleaningScheduleStatus(int id, [FromBody] string status)
        {
            try
            {
                var schedule = await _context.CleaningSchedules.FindAsync(id);
                if (schedule == null || !schedule.IsActive)
                    return NotFound(new { success = false, message = "Cleaning schedule not found" });

                schedule.Status = status;
                
                if (status == "InProgress" && !schedule.StartTime.HasValue)
                    schedule.StartTime = DateTime.UtcNow;
                
                if (status == "Completed")
                {
                    schedule.CompletionTime = DateTime.UtcNow;
                    if (schedule.StartTime.HasValue)
                        schedule.ActualDuration = (int)(DateTime.UtcNow - schedule.StartTime.Value).TotalMinutes;
                }

                schedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cleaning schedule status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cleaning schedule status");
                return StatusCode(500, new { success = false, message = "Error updating cleaning schedule status" });
            }
        }

        // MAINTENANCE REQUEST ENDPOINTS
        [HttpGet("maintenance-requests")]
        public async Task<IActionResult> GetMaintenanceRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] string priority = "", [FromQuery] string issueType = "", [FromQuery] string search = "")
        {
            try
            {
                var query = _context.MaintenanceRequests
                    .Include(m => m.Room)
                        .ThenInclude(r => r.RoomType)
                    .Where(m => m.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(m => m.Status == status);
                
                if (!string.IsNullOrEmpty(priority))
                    query = query.Where(m => m.Priority == priority);
                
                if (!string.IsNullOrEmpty(issueType))
                    query = query.Where(m => m.IssueType == issueType);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(m => m.Room.RoomNumber.Contains(search) || 
                                           m.RequestNumber.Contains(search) ||
                                           m.Description.Contains(search) ||
                                           m.ReportedBy.Contains(search) ||
                                           m.AssignedTo.Contains(search));

                var totalCount = await query.CountAsync();
                var requests = await query
                    .OrderBy(m => m.Priority == "Urgent" ? 1 : m.Priority == "High" ? 2 : m.Priority == "Medium" ? 3 : 4)
                    .ThenByDescending(m => m.ReportedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = requests, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving maintenance requests");
                return StatusCode(500, new { success = false, message = "Error retrieving maintenance requests" });
            }
        }

        [HttpPost("maintenance-requests")]
        public async Task<IActionResult> CreateMaintenanceRequest([FromBody] MaintenanceRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Generate unique request number
                var lastRequest = await _context.MaintenanceRequests.OrderByDescending(m => m.Id).FirstOrDefaultAsync();
                var requestNumber = $"MR{DateTime.Now:yyyyMMdd}{(lastRequest?.Id + 1 ?? 1):D4}";
                request.RequestNumber = requestNumber;
                request.ReportedDate = DateTime.UtcNow;
                request.Status = request.Status ?? "Pending";
                request.Priority = request.Priority ?? "Medium";
                request.IsActive = true;
                request.CreatedAt = DateTime.UtcNow;
                request.UpdatedAt = DateTime.UtcNow;

                _context.MaintenanceRequests.Add(request);
                await _context.SaveChangesAsync();
                
                // Reload with room data for response
                var createdRequest = await _context.MaintenanceRequests
                    .Include(m => m.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(m => m.Id == request.Id);

                return Ok(new { success = true, data = createdRequest, message = "Maintenance request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating maintenance request");
                return StatusCode(500, new { success = false, message = "Error creating maintenance request" });
            }
        }

        [HttpGet("maintenance-requests/{id}")]
        public async Task<IActionResult> GetMaintenanceRequestById(int id)
        {
            try
            {
                var request = await _context.MaintenanceRequests
                    .Include(m => m.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(m => m.Id == id && m.IsActive);

                if (request == null)
                    return NotFound(new { success = false, message = "Maintenance request not found" });

                return Ok(new { success = true, data = request });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving maintenance request");
                return StatusCode(500, new { success = false, message = "Error retrieving maintenance request" });
            }
        }

        [HttpPut("maintenance-requests/{id}")]
        public async Task<IActionResult> UpdateMaintenanceRequest(int id, [FromBody] MaintenanceRequest request)
        {
            try
            {
                var existingRequest = await _context.MaintenanceRequests.FindAsync(id);
                if (existingRequest == null || !existingRequest.IsActive)
                    return NotFound(new { success = false, message = "Maintenance request not found" });

                existingRequest.Status = request.Status;
                existingRequest.AssignedTo = request.AssignedTo;
                existingRequest.ScheduledDate = request.ScheduledDate;
                existingRequest.EstimatedCost = request.EstimatedCost;
                existingRequest.ActualCost = request.ActualCost;
                existingRequest.WorkPerformed = request.WorkPerformed;
                existingRequest.PartsUsed = request.PartsUsed;
                existingRequest.CompletionNotes = request.CompletionNotes;
                
                if (request.Status == "InProgress" && !existingRequest.StartDate.HasValue)
                    existingRequest.StartDate = DateTime.UtcNow;
                
                if (request.Status == "Completed")
                    existingRequest.CompletionDate = DateTime.UtcNow;

                existingRequest.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Maintenance request updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating maintenance request");
                return StatusCode(500, new { success = false, message = "Error updating maintenance request" });
            }
        }

        // LOST AND FOUND ENDPOINTS
        [HttpGet("lost-and-found")]
        public async Task<IActionResult> GetLostAndFoundItems([FromQuery] int page = 1, [FromQuery] int pageSize = 10, 
            [FromQuery] string? status = null, [FromQuery] string? category = null, [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.LostAndFounds.Include(l => l.Room).Where(l => l.IsActive == true);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(l => l.Status == status);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(l => l.Category == category);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(l => l.DateFound)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = items, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving lost and found");
                return StatusCode(500, new { success = false, message = "Error retrieving lost and found" });
            }
        }

        [HttpPost("lost-and-found")]
        public async Task<IActionResult> CreateLostAndFound([FromBody] LostAndFound item)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                item.ItemNumber = $"LF{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                item.DateFound = DateTime.UtcNow;
                item.Status = "Found";
                item.IsActive = true;
                item.CreatedAt = DateTime.UtcNow;
                item.UpdatedAt = DateTime.UtcNow;

                _context.LostAndFounds.Add(item);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = item, message = "Lost and found item recorded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating lost and found item");
                return StatusCode(500, new { success = false, message = "Error creating lost and found item" });
            }
        }

        [HttpGet("lost-and-found/{id}")]
        public async Task<IActionResult> GetLostAndFoundItem(int id)
        {
            try
            {
                var item = await _context.LostAndFounds
                    .Include(l => l.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(l => l.Id == id && l.IsActive == true);

                if (item == null)
                    return NotFound(new { success = false, message = "Lost and found item not found" });

                return Ok(new { success = true, data = item });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving lost and found item");
                return StatusCode(500, new { success = false, message = "Error retrieving lost and found item" });
            }
        }

        [HttpPut("lost-and-found/{id}")]
        public async Task<IActionResult> UpdateLostAndFoundItem(int id, [FromBody] LostAndFound updatedItem)
        {
            try
            {
                var item = await _context.LostAndFounds.FindAsync(id);
                if (item == null || item.IsActive != true)
                    return NotFound(new { success = false, message = "Lost and found item not found" });

                // Update the item properties
                item.RoomId = updatedItem.RoomId;
                item.ItemDescription = updatedItem.ItemDescription;
                item.Category = updatedItem.Category;
                item.LocationFound = updatedItem.LocationFound;
                item.DateFound = updatedItem.DateFound;
                item.FoundBy = updatedItem.FoundBy;
                item.Status = updatedItem.Status;
                item.GuestName = updatedItem.GuestName;
                item.GuestPhone = updatedItem.GuestPhone;
                item.GuestEmail = updatedItem.GuestEmail;
                item.ClaimedBy = updatedItem.ClaimedBy;
                item.ClaimedDate = updatedItem.ClaimedDate;
                item.Remarks = updatedItem.Remarks;
                item.ImagePath = updatedItem.ImagePath;
                item.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Return updated item with room information
                var updatedItemWithRoom = await _context.LostAndFounds
                    .Include(l => l.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(l => l.Id == id);

                return Ok(new { success = true, data = updatedItemWithRoom, message = "Lost and found item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating lost and found item");
                return StatusCode(500, new { success = false, message = "Error updating lost and found item" });
            }
        }

        [HttpDelete("lost-and-found/{id}")]
        public async Task<IActionResult> DeleteLostAndFoundItem(int id)
        {
            try
            {
                var item = await _context.LostAndFounds.FindAsync(id);
                if (item == null || item.IsActive != true)
                    return NotFound(new { success = false, message = "Lost and found item not found" });

                // Soft delete
                item.IsActive = false;
                item.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Lost and found item deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting lost and found item");
                return StatusCode(500, new { success = false, message = "Error deleting lost and found item" });
            }
        }

        [HttpPut("lost-and-found/{id}/claim")]
        public async Task<IActionResult> ClaimLostAndFoundItem(int id, [FromBody] LostAndFound claimInfo)
        {
            try
            {
                var item = await _context.LostAndFounds.FindAsync(id);
                if (item == null || item.IsActive != true)
                    return NotFound(new { success = false, message = "Lost and found item not found" });

                item.Status = "Claimed";
                item.GuestName = claimInfo.GuestName;
                item.GuestPhone = claimInfo.GuestPhone;
                item.GuestEmail = claimInfo.GuestEmail;
                item.ClaimedDate = DateTime.UtcNow;
                item.ClaimedBy = claimInfo.ClaimedBy;
                item.Remarks = claimInfo.Remarks;
                item.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Lost and found item claimed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error claiming lost and found item");
                return StatusCode(500, new { success = false, message = "Error claiming lost and found item" });
            }
        }

        // HOUSEKEEPING LAUNDRY ENDPOINTS
        [HttpGet("housekeeping-laundry")]
        public async Task<IActionResult> GetHousekeepingLaundry([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] int? roomId = null)
        {
            try
            {
                var query = _context.HousekeepingLaundries.Include(l => l.Room).Include(l => l.Guest).Where(l => l.IsActive == true);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(l => l.Status == status);
                
                if (roomId.HasValue)
                    query = query.Where(l => l.RoomId == roomId.Value);

                var totalCount = await query.CountAsync();
                var laundryItems = await query
                    .OrderByDescending(l => l.RequestDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = laundryItems, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving housekeeping laundry");
                return StatusCode(500, new { success = false, message = "Error retrieving housekeeping laundry" });
            }
        }

        [HttpPost("housekeeping-laundry")]
        public async Task<IActionResult> CreateHousekeepingLaundry([FromBody] HousekeepingLaundry laundry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                laundry.LaundryNumber = $"HL{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                laundry.RequestDate = DateTime.UtcNow;
                laundry.Status = "Requested";
                laundry.PaymentStatus = "Pending";
                
                // Calculate total amount
                if (laundry.IsExpress)
                    laundry.TotalAmount = laundry.ServiceCharge + laundry.ExpressCharge;
                else
                    laundry.TotalAmount = laundry.ServiceCharge;

                laundry.IsActive = true;
                laundry.CreatedAt = DateTime.UtcNow;
                laundry.UpdatedAt = DateTime.UtcNow;

                _context.HousekeepingLaundries.Add(laundry);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = laundry, message = "Housekeeping laundry request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating housekeeping laundry");
                return StatusCode(500, new { success = false, message = "Error creating housekeeping laundry" });
            }
        }

        [HttpPut("housekeeping-laundry/{id}/status")]
        public async Task<IActionResult> UpdateHousekeepingLaundryStatus(int id, [FromBody] string status)
        {
            try
            {
                var laundry = await _context.HousekeepingLaundries.FindAsync(id);
                if (laundry == null || !laundry.IsActive)
                    return NotFound(new { success = false, message = "Housekeeping laundry not found" });

                laundry.Status = status;
                
                if (status == "Picked" && !laundry.PickupDate.HasValue)
                    laundry.PickupDate = DateTime.UtcNow;
                
                if (status == "Delivered")
                    laundry.DeliveryDate = DateTime.UtcNow;

                laundry.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Housekeeping laundry status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating housekeeping laundry status");
                return StatusCode(500, new { success = false, message = "Error updating housekeeping laundry status" });
            }
        }

        // ROOM STATUS MASTER ENDPOINTS
        [HttpGet("room-status-master")]
        public async Task<IActionResult> GetRoomStatusMaster([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] string search = "")
        {
            try
            {
                var query = _context.RoomStatusMasters.Include(r => r.Room).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(r => r.Status == status);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(r => r.Room.RoomNumber.Contains(search) || r.UpdatedBy.Contains(search));

                var totalCount = await query.CountAsync();
                var roomStatuses = await query
                    .OrderBy(r => r.Room.RoomNumber)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = roomStatuses, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room status master");
                return StatusCode(500, new { success = false, message = "Error retrieving room status master" });
            }
        }

        [HttpGet("room-status-master/{id}")]
        public async Task<IActionResult> GetRoomStatusMasterById(int id)
        {
            try
            {
                var roomStatus = await _context.RoomStatusMasters
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);

                if (roomStatus == null)
                    return NotFound(new { success = false, message = "Room status not found" });

                return Ok(new { success = true, data = roomStatus });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room status");
                return StatusCode(500, new { success = false, message = "Error retrieving room status" });
            }
        }

        [HttpPost("room-status-master")]
        public async Task<IActionResult> CreateRoomStatusMaster([FromBody] RoomStatusMaster roomStatus)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if room already has active status
                var existingStatus = await _context.RoomStatusMasters.AnyAsync(r => r.RoomId == roomStatus.RoomId && r.IsActive);
                if (existingStatus)
                    return BadRequest(new { success = false, message = "Room status already exists for this room" });

                roomStatus.StatusDate = DateTime.UtcNow;
                roomStatus.IsActive = true;
                roomStatus.CreatedAt = DateTime.UtcNow;
                roomStatus.UpdatedAt = DateTime.UtcNow;

                _context.RoomStatusMasters.Add(roomStatus);
                await _context.SaveChangesAsync();

                var createdStatus = await _context.RoomStatusMasters
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == roomStatus.Id);

                return Ok(new { success = true, data = createdStatus, message = "Room status created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room status");
                return StatusCode(500, new { success = false, message = "Error creating room status" });
            }
        }

        [HttpPut("room-status-master/{id}")]
        public async Task<IActionResult> UpdateRoomStatusMaster(int id, [FromBody] RoomStatusMaster roomStatus)
        {
            try
            {
                var existingStatus = await _context.RoomStatusMasters.FindAsync(id);
                if (existingStatus == null || !existingStatus.IsActive)
                    return NotFound(new { success = false, message = "Room status not found" });

                // Check if trying to change to a room that already has status
                if (existingStatus.RoomId != roomStatus.RoomId)
                {
                    var duplicateRoom = await _context.RoomStatusMasters
                        .AnyAsync(r => r.RoomId == roomStatus.RoomId && r.Id != id && r.IsActive);
                    if (duplicateRoom)
                        return BadRequest(new { success = false, message = "Room already has an active status" });
                }

                existingStatus.RoomId = roomStatus.RoomId;
                existingStatus.Status = roomStatus.Status;
                existingStatus.HousekeepingStatus = roomStatus.HousekeepingStatus;
                existingStatus.UpdatedBy = roomStatus.UpdatedBy;
                existingStatus.Remarks = roomStatus.Remarks;
                existingStatus.MaintenanceScheduled = roomStatus.MaintenanceScheduled;
                existingStatus.CleaningScheduled = roomStatus.CleaningScheduled;
                existingStatus.StatusDate = DateTime.UtcNow;
                existingStatus.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var updatedStatus = await _context.RoomStatusMasters
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == id);

                return Ok(new { success = true, data = updatedStatus, message = "Room status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room status");
                return StatusCode(500, new { success = false, message = "Error updating room status" });
            }
        }

        [HttpDelete("room-status-master/{id}")]
        public async Task<IActionResult> DeleteRoomStatusMaster(int id)
        {
            try
            {
                var roomStatus = await _context.RoomStatusMasters.FindAsync(id);
                if (roomStatus == null || !roomStatus.IsActive)
                    return NotFound(new { success = false, message = "Room status not found" });

                roomStatus.IsActive = false;
                roomStatus.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room status deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room status");
                return StatusCode(500, new { success = false, message = "Error deleting room status" });
            }
        }

        // ROOMS DROPDOWN ENDPOINT
        [HttpGet("rooms-dropdown")]
        public async Task<IActionResult> GetRoomsDropdown()
        {
            try
            {
                var rooms = await _context.Rooms
                    .Include(r => r.RoomType)
                    .Where(r => r.IsActive)
                    .Select(r => new
                    {
                        r.Id,
                        r.RoomNumber,
                        r.RoomTypeId,
                        r.FloorNumber,
                        r.Status,
                        r.MaxAdults,
                        r.MaxChildren,
                        r.BasePrice,
                        RoomType = r.RoomType != null ? new
                        {
                            r.RoomType.Id,
                            r.RoomType.Name,
                            r.RoomType.Code
                        } : new
                        {
                            Id = 0,
                            Name = "Standard",
                            Code = "STD"
                        }
                    })
                    .OrderBy(r => r.RoomNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = rooms });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rooms dropdown");
                return StatusCode(500, new { success = false, message = "Error getting rooms dropdown" });
            }
        }

        // HOUSEKEEPING DASHBOARD SUMMARY
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetHousekeepingDashboardSummary()
        {
            try
            {
                var summary = new
                {
                    TotalRooms = await _context.HousekeepingRoomStatuses.CountAsync(r => r.IsActive),
                    CleanRooms = await _context.HousekeepingRoomStatuses.CountAsync(r => r.CleaningStatus == "Clean" && r.IsActive),
                    DirtyRooms = await _context.HousekeepingRoomStatuses.CountAsync(r => r.CleaningStatus == "Dirty" && r.IsActive),
                    OutOfOrderRooms = await _context.HousekeepingRoomStatuses.CountAsync(r => r.CleaningStatus == "OutOfOrder" && r.IsActive),
                    PendingMaintenance = await _context.MaintenanceRequests.CountAsync(m => m.Status == "Reported" && m.IsActive),
                    UrgentMaintenance = await _context.MaintenanceRequests.CountAsync(m => m.Priority == "Urgent" && m.Status != "Completed" && m.IsActive),
                    TodayCleaningSchedule = await _context.CleaningSchedules.CountAsync(c => c.ScheduledDate.Date == DateTime.Today && c.IsActive == true),
                    CompletedCleaningToday = await _context.CleaningSchedules.CountAsync(c => c.ScheduledDate.Date == DateTime.Today && c.Status == "Completed" && c.IsActive == true),
                    LostAndFoundItems = await _context.LostAndFounds.CountAsync(l => l.Status == "Found" && l.IsActive == true),
                    LaundryRequests = await _context.HousekeepingLaundries.CountAsync(l => l.Status == "Requested" && l.IsActive == true)
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving housekeeping dashboard summary");
                return StatusCode(500, new { success = false, message = "Error retrieving housekeeping dashboard summary" });
            }
        }

        // CleaningSchedule CRUD Operations
        [HttpGet("cleaning-schedule")]
        public async Task<IActionResult> GetCleaningSchedule([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] string search = "")
        {
            try
            {
                var query = _context.CleaningSchedules
                    .Include(c => c.Room)
                        .ThenInclude(r => r.RoomType)
                    .Where(c => c.IsActive);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(c => c.Status == status);

                if (!string.IsNullOrEmpty(search))
                    query = query.Where(c => c.Room.RoomNumber.Contains(search) || 
                                           c.AssignedHousekeeper.Contains(search) ||
                                           c.ScheduleNumber.Contains(search));

                var totalCount = await query.CountAsync();
                var schedules = await query.OrderBy(c => c.ScheduledDate)
                                          .ThenBy(c => c.ScheduledTime)
                                          .Skip((page - 1) * pageSize)
                                          .Take(pageSize)
                                          .ToListAsync();

                return Ok(new { success = true, data = schedules, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cleaning schedules");
                return StatusCode(500, new { success = false, message = "Error getting cleaning schedules" });
            }
        }

        [HttpGet("cleaning-schedule/{id}")]
        public async Task<IActionResult> GetCleaningScheduleById(int id)
        {
            try
            {
                var schedule = await _context.CleaningSchedules
                    .Include(c => c.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

                if (schedule == null)
                    return NotFound(new { success = false, message = "Cleaning schedule not found" });

                return Ok(new { success = true, data = schedule });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cleaning schedule by id");
                return StatusCode(500, new { success = false, message = "Error getting cleaning schedule" });
            }
        }

        [HttpPost("cleaning-schedule")]
        public async Task<IActionResult> CreateCleaningSchedule([FromBody] CleaningSchedule schedule)
        {
            try
            {
                // Generate schedule number
                var lastSchedule = await _context.CleaningSchedules.OrderByDescending(c => c.Id).FirstOrDefaultAsync();
                var scheduleNumber = $"CS{DateTime.Now:yyyyMMdd}{(lastSchedule?.Id + 1 ?? 1):D4}";

                schedule.ScheduleNumber = scheduleNumber;
                schedule.CreatedAt = DateTime.UtcNow;
                schedule.UpdatedAt = DateTime.UtcNow;
                schedule.IsActive = true;

                _context.CleaningSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                var createdSchedule = await _context.CleaningSchedules
                    .Include(c => c.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(c => c.Id == schedule.Id);

                return Ok(new { success = true, data = createdSchedule, message = "Cleaning schedule created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating cleaning schedule");
                return StatusCode(500, new { success = false, message = "Error creating cleaning schedule" });
            }
        }

        [HttpPut("cleaning-schedule/{id}")]
        public async Task<IActionResult> UpdateCleaningSchedule(int id, [FromBody] CleaningSchedule schedule)
        {
            try
            {
                var existingSchedule = await _context.CleaningSchedules.FindAsync(id);
                if (existingSchedule == null || !existingSchedule.IsActive)
                    return NotFound(new { success = false, message = "Cleaning schedule not found" });

                existingSchedule.RoomId = schedule.RoomId;
                existingSchedule.ScheduledDate = schedule.ScheduledDate;
                existingSchedule.ScheduledTime = schedule.ScheduledTime;
                existingSchedule.CleaningType = schedule.CleaningType;
                existingSchedule.AssignedHousekeeper = schedule.AssignedHousekeeper;
                existingSchedule.Status = schedule.Status;
                existingSchedule.StartTime = schedule.StartTime;
                existingSchedule.CompletionTime = schedule.CompletionTime;
                existingSchedule.SpecialInstructions = schedule.SpecialInstructions;
                existingSchedule.CompletionNotes = schedule.CompletionNotes;
                existingSchedule.EstimatedDuration = schedule.EstimatedDuration;
                existingSchedule.ActualDuration = schedule.ActualDuration;
                existingSchedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var updatedSchedule = await _context.CleaningSchedules
                    .Include(c => c.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(c => c.Id == id);

                return Ok(new { success = true, data = updatedSchedule, message = "Cleaning schedule updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cleaning schedule");
                return StatusCode(500, new { success = false, message = "Error updating cleaning schedule" });
            }
        }

        [HttpDelete("cleaning-schedule/{id}")]
        public async Task<IActionResult> DeleteCleaningSchedule(int id)
        {
            try
            {
                var schedule = await _context.CleaningSchedules.FindAsync(id);
                if (schedule == null || !schedule.IsActive)
                    return NotFound(new { success = false, message = "Cleaning schedule not found" });

                schedule.IsActive = false;
                schedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Cleaning schedule deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting cleaning schedule");
                return StatusCode(500, new { success = false, message = "Error deleting cleaning schedule" });
            }
        }

    }
}
