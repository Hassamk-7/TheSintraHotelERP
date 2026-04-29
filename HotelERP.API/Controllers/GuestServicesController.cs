using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GuestServicesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestServicesController> _logger;

        public GuestServicesController(HotelDbContext context, ILogger<GuestServicesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // CONCIERGE SERVICES ENDPOINTS
        [HttpGet("concierge-services")]
        public async Task<IActionResult> GetConciergeServices([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "")
        {
            try
            {
                var query = _context.ConciergeServices.Include(c => c.Guest).Include(c => c.Room).Where(c => c.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(c => c.Status == status);

                var totalCount = await query.CountAsync();
                var services = await query
                    .OrderByDescending(c => c.RequestDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = services, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving concierge services");
                return StatusCode(500, new { success = false, message = "Error retrieving concierge services" });
            }
        }

        [HttpGet("concierge-services/{id}")]
        public async Task<IActionResult> GetConciergeService(int id)
        {
            try
            {
                var service = await _context.ConciergeServices
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

                if (service == null)
                    return NotFound(new { success = false, message = "Concierge service not found" });

                return Ok(new { success = true, data = service });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving concierge service");
                return StatusCode(500, new { success = false, message = "Error retrieving concierge service" });
            }
        }

        [HttpPost("concierge-services")]
        public async Task<IActionResult> CreateConciergeService([FromBody] ConciergeServices service)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                service.ServiceNumber = $"CON{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                service.RequestDate = DateTime.UtcNow;
                service.Status = "Requested";
                service.IsActive = true;
                service.CreatedAt = DateTime.UtcNow;
                service.UpdatedAt = DateTime.UtcNow;

                _context.ConciergeServices.Add(service);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetConciergeService), new { id = service.Id },
                    new { success = true, data = service, message = "Concierge service request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating concierge service");
                return StatusCode(500, new { success = false, message = "Error creating concierge service" });
            }
        }

        [HttpPut("concierge-services/{id}")]
        public async Task<IActionResult> UpdateConciergeService(int id, [FromBody] ConciergeServices service)
        {
            try
            {
                var existingService = await _context.ConciergeServices.FindAsync(id);
                if (existingService == null || !existingService.IsActive)
                    return NotFound(new { success = false, message = "Concierge service not found" });

                existingService.Status = service.Status;
                existingService.ServiceCharge = service.ServiceCharge;
                existingService.AssignedTo = service.AssignedTo;
                existingService.CompletionNotes = service.CompletionNotes;
                existingService.Rating = service.Rating;
                existingService.GuestFeedback = service.GuestFeedback;
                
                if (service.Status == "Completed")
                    existingService.CompletionDate = DateTime.UtcNow;

                existingService.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Concierge service updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating concierge service");
                return StatusCode(500, new { success = false, message = "Error updating concierge service" });
            }
        }

        // SPA & WELLNESS ENDPOINTS
        [HttpGet("spa-wellness")]
        public async Task<IActionResult> GetSpaWellness([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string category = "")
        {
            try
            {
                var query = _context.SpaWellnesses.Include(s => s.Guest).Where(s => s.IsActive);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(s => s.ServiceCategory == category);

                var totalCount = await query.CountAsync();
                var bookings = await query
                    .OrderByDescending(s => s.ServiceDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = bookings, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving spa wellness bookings");
                return StatusCode(500, new { success = false, message = "Error retrieving spa wellness bookings" });
            }
        }

        [HttpPost("spa-wellness")]
        public async Task<IActionResult> CreateSpaWellnessBooking([FromBody] SpaWellness booking)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                booking.BookingNumber = $"SPA{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                booking.BookingDate = DateTime.UtcNow;
                booking.Status = "Booked";
                booking.IsActive = true;
                booking.CreatedAt = DateTime.UtcNow;
                booking.UpdatedAt = DateTime.UtcNow;

                _context.SpaWellnesses.Add(booking);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = booking, message = "Spa wellness booking created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating spa wellness booking");
                return StatusCode(500, new { success = false, message = "Error creating spa wellness booking" });
            }
        }

        // EVENT MANAGEMENT ENDPOINTS
        [HttpGet("event-management")]
        public async Task<IActionResult> GetEventManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string eventType = "")
        {
            try
            {
                var query = _context.EventManagements.Include(e => e.OrganizerGuest).Where(e => e.IsActive);
                
                if (!string.IsNullOrEmpty(eventType))
                    query = query.Where(e => e.EventType == eventType);

                var totalCount = await query.CountAsync();
                var events = await query
                    .OrderByDescending(e => e.EventDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = events, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event management");
                return StatusCode(500, new { success = false, message = "Error retrieving event management" });
            }
        }

        [HttpPost("event-management")]
        public async Task<IActionResult> CreateEventManagement([FromBody] EventManagement eventData)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                eventData.EventNumber = $"EVT{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                eventData.Status = "Inquiry";
                eventData.IsActive = true;
                eventData.CreatedAt = DateTime.UtcNow;
                eventData.UpdatedAt = DateTime.UtcNow;

                _context.EventManagements.Add(eventData);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = eventData, message = "Event booking created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event management");
                return StatusCode(500, new { success = false, message = "Error creating event management" });
            }
        }

        // TRANSPORTATION ENDPOINTS
        [HttpGet("transportation")]
        public async Task<IActionResult> GetTransportation([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string transportType = "")
        {
            try
            {
                var query = _context.Transportations.Include(t => t.Guest).Where(t => t.IsActive);
                
                if (!string.IsNullOrEmpty(transportType))
                    query = query.Where(t => t.TransportType == transportType);

                var totalCount = await query.CountAsync();
                var bookings = await query
                    .OrderByDescending(t => t.ServiceDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = bookings, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transportation");
                return StatusCode(500, new { success = false, message = "Error retrieving transportation" });
            }
        }

        [HttpPost("transportation")]
        public async Task<IActionResult> CreateTransportation([FromBody] Transportation transport)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                transport.BookingNumber = $"TRN{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                transport.BookingDate = DateTime.UtcNow;
                transport.Status = "Booked";
                transport.IsActive = true;
                transport.CreatedAt = DateTime.UtcNow;
                transport.UpdatedAt = DateTime.UtcNow;

                _context.Transportations.Add(transport);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = transport, message = "Transportation booking created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transportation");
                return StatusCode(500, new { success = false, message = "Error creating transportation" });
            }
        }

        // TOUR & TRAVEL ENDPOINTS
        [HttpGet("tour-travel")]
        public async Task<IActionResult> GetTourTravel([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string tourType = "")
        {
            try
            {
                var query = _context.TourTravels.Include(t => t.Guest).Where(t => t.IsActive);
                
                if (!string.IsNullOrEmpty(tourType))
                    query = query.Where(t => t.TourType == tourType);

                var totalCount = await query.CountAsync();
                var tours = await query
                    .OrderByDescending(t => t.TourDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = tours, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tour travel");
                return StatusCode(500, new { success = false, message = "Error retrieving tour travel" });
            }
        }

        [HttpPost("tour-travel")]
        public async Task<IActionResult> CreateTourTravel([FromBody] TourTravel tour)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                tour.BookingNumber = $"TUR{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                tour.BookingDate = DateTime.UtcNow;
                tour.Status = "Booked";
                tour.IsActive = true;
                tour.CreatedAt = DateTime.UtcNow;
                tour.UpdatedAt = DateTime.UtcNow;

                _context.TourTravels.Add(tour);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = tour, message = "Tour booking created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tour travel");
                return StatusCode(500, new { success = false, message = "Error creating tour travel" });
            }
        }

        // GUEST FEEDBACK ENDPOINTS
        [HttpGet("guest-feedback")]
        public async Task<IActionResult> GetGuestFeedback([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string feedbackType = "")
        {
            try
            {
                var query = _context.GuestFeedbackServices.Include(f => f.Guest).Include(f => f.CheckIn).Where(f => f.IsActive);
                
                if (!string.IsNullOrEmpty(feedbackType))
                    query = query.Where(f => f.FeedbackType == feedbackType);

                var totalCount = await query.CountAsync();
                var feedback = await query
                    .OrderByDescending(f => f.FeedbackDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = feedback, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest feedback");
                return StatusCode(500, new { success = false, message = "Error retrieving guest feedback" });
            }
        }

        [HttpPost("guest-feedback")]
        public async Task<IActionResult> CreateGuestFeedback([FromBody] GuestFeedbackService feedback)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                feedback.FeedbackNumber = $"FBK{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                feedback.FeedbackDate = DateTime.UtcNow;
                feedback.Status = "Received";
                feedback.IsActive = true;
                feedback.CreatedAt = DateTime.UtcNow;
                feedback.UpdatedAt = DateTime.UtcNow;

                _context.GuestFeedbackServices.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = feedback, message = "Guest feedback recorded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest feedback");
                return StatusCode(500, new { success = false, message = "Error creating guest feedback" });
            }
        }

        [HttpPut("guest-feedback/{id}/respond")]
        public async Task<IActionResult> RespondToGuestFeedback(int id, [FromBody] string response)
        {
            try
            {
                var feedback = await _context.GuestFeedbackServices.FindAsync(id);
                if (feedback == null || !feedback.IsActive)
                    return NotFound(new { success = false, message = "Guest feedback not found" });

                feedback.ManagementResponse = response;
                feedback.ResponseDate = DateTime.UtcNow;
                feedback.Status = "Responded";
                feedback.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Response added to guest feedback successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error responding to guest feedback");
                return StatusCode(500, new { success = false, message = "Error responding to guest feedback" });
            }
        }
    }
}
