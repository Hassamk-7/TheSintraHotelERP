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
    public class MarketingCRMController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<MarketingCRMController> _logger;

        public MarketingCRMController(HotelDbContext context, ILogger<MarketingCRMController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // CUSTOMER DATABASE ENDPOINTS
        [HttpGet("customer-database")]
        public async Task<IActionResult> GetCustomerDatabase([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string segment = "")
        {
            try
            {
                var query = _context.CustomerDatabases.Where(c => c.IsActive);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(c => c.FirstName.Contains(search) || c.LastName.Contains(search) || c.Email.Contains(search) || c.PhoneNumber.Contains(search));
                
                if (!string.IsNullOrEmpty(segment))
                    query = query.Where(c => c.CustomerSegment == segment);

                var totalCount = await query.CountAsync();
                var customers = await query
                    .OrderByDescending(c => c.TotalSpent)
                    .ThenBy(c => c.FirstName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = customers, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer database");
                return StatusCode(500, new { success = false, message = "Error retrieving customer database" });
            }
        }

        [HttpGet("customer-database/{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            try
            {
                var customer = await _context.CustomerDatabases
                    .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

                if (customer == null)
                    return NotFound(new { success = false, message = "Customer not found" });

                return Ok(new { success = true, data = customer });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer");
                return StatusCode(500, new { success = false, message = "Error retrieving customer" });
            }
        }

        [HttpPost("customer-database")]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerDatabase customer)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if email already exists
                var existingCustomer = await _context.CustomerDatabases.AnyAsync(c => c.Email == customer.Email && c.IsActive);
                if (existingCustomer)
                    return BadRequest(new { success = false, message = "Customer with this email already exists" });

                customer.CustomerCode = $"CUST{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                customer.FirstVisit = DateTime.UtcNow;
                customer.TotalVisits = 1;
                customer.CustomerSegment = customer.CustomerSegment ?? "New";
                customer.IsActive = true;
                customer.CreatedAt = DateTime.UtcNow;
                customer.UpdatedAt = DateTime.UtcNow;

                _context.CustomerDatabases.Add(customer);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id },
                    new { success = true, data = customer, message = "Customer created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                return StatusCode(500, new { success = false, message = "Error creating customer" });
            }
        }

        [HttpPut("customer-database/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerDatabase customer)
        {
            try
            {
                var existingCustomer = await _context.CustomerDatabases.FindAsync(id);
                if (existingCustomer == null || !existingCustomer.IsActive)
                    return NotFound(new { success = false, message = "Customer not found" });

                // Update properties
                existingCustomer.FirstName = customer.FirstName;
                existingCustomer.LastName = customer.LastName;
                existingCustomer.Email = customer.Email;
                existingCustomer.PhoneNumber = customer.PhoneNumber;
                existingCustomer.Address = customer.Address;
                existingCustomer.City = customer.City;
                existingCustomer.Country = customer.Country;
                existingCustomer.DateOfBirth = customer.DateOfBirth;
                existingCustomer.Gender = customer.Gender;
                existingCustomer.MaritalStatus = customer.MaritalStatus;
                existingCustomer.Occupation = customer.Occupation;
                existingCustomer.IncomeRange = customer.IncomeRange;
                existingCustomer.Preferences = customer.Preferences;
                existingCustomer.Interests = customer.Interests;
                existingCustomer.CustomerSegment = customer.CustomerSegment;
                existingCustomer.PreferredCommunication = customer.PreferredCommunication;
                existingCustomer.OptInMarketing = customer.OptInMarketing;
                existingCustomer.Notes = customer.Notes;
                existingCustomer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Customer updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer");
                return StatusCode(500, new { success = false, message = "Error updating customer" });
            }
        }

        // LOYALTY PROGRAM ENDPOINTS
        [HttpGet("loyalty-programs")]
        public async Task<IActionResult> GetLoyaltyPrograms([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string tier = "")
        {
            try
            {
                var query = _context.LoyaltyPrograms.Include(l => l.Customer).Where(l => l.IsActive);
                
                if (!string.IsNullOrEmpty(tier))
                    query = query.Where(l => l.ProgramTier == tier);

                var totalCount = await query.CountAsync();
                var programs = await query
                    .OrderByDescending(l => l.CurrentPoints)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = programs, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving loyalty programs");
                return StatusCode(500, new { success = false, message = "Error retrieving loyalty programs" });
            }
        }

        [HttpPost("loyalty-programs")]
        public async Task<IActionResult> CreateLoyaltyProgram([FromBody] LoyaltyProgram program)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if customer already has a loyalty program
                var existingProgram = await _context.LoyaltyPrograms.AnyAsync(l => l.CustomerId == program.CustomerId && l.IsActive);
                if (existingProgram)
                    return BadRequest(new { success = false, message = "Customer already has a loyalty program membership" });

                program.MembershipNumber = $"LOY{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                program.JoinDate = DateTime.UtcNow;
                program.ProgramTier = program.ProgramTier ?? "Bronze";
                program.Status = "Active";
                program.IsActive = true;
                program.CreatedAt = DateTime.UtcNow;
                program.UpdatedAt = DateTime.UtcNow;

                _context.LoyaltyPrograms.Add(program);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = program, message = "Loyalty program membership created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating loyalty program");
                return StatusCode(500, new { success = false, message = "Error creating loyalty program" });
            }
        }

        [HttpPut("loyalty-programs/{id}/add-points")]
        public async Task<IActionResult> AddLoyaltyPoints(int id, [FromBody] int points)
        {
            try
            {
                var program = await _context.LoyaltyPrograms.FindAsync(id);
                if (program == null || !program.IsActive)
                    return NotFound(new { success = false, message = "Loyalty program not found" });

                program.CurrentPoints += points;
                program.LifetimePoints += points;
                program.LastActivity = DateTime.UtcNow;
                program.UpdatedAt = DateTime.UtcNow;

                // Check for tier upgrade
                if (program.CurrentPoints >= 10000 && program.ProgramTier == "Gold")
                    program.ProgramTier = "Platinum";
                else if (program.CurrentPoints >= 5000 && program.ProgramTier == "Silver")
                    program.ProgramTier = "Gold";
                else if (program.CurrentPoints >= 1000 && program.ProgramTier == "Bronze")
                    program.ProgramTier = "Silver";

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = $"{points} points added successfully", data = program });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding loyalty points");
                return StatusCode(500, new { success = false, message = "Error adding loyalty points" });
            }
        }

        // MARKETING CAMPAIGN ENDPOINTS
        [HttpGet("marketing-campaigns")]
        public async Task<IActionResult> GetMarketingCampaigns([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "")
        {
            try
            {
                var query = _context.MarketingCampaigns.Where(c => c.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(c => c.Status == status);

                var totalCount = await query.CountAsync();
                var campaigns = await query
                    .OrderByDescending(c => c.StartDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = campaigns, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving marketing campaigns");
                return StatusCode(500, new { success = false, message = "Error retrieving marketing campaigns" });
            }
        }

        [HttpPost("marketing-campaigns")]
        public async Task<IActionResult> CreateMarketingCampaign([FromBody] MarketingCampaign campaign)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                campaign.CampaignCode = $"CAM{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                campaign.Status = "Planning";
                campaign.IsActive = true;
                campaign.CreatedAt = DateTime.UtcNow;
                campaign.UpdatedAt = DateTime.UtcNow;

                _context.MarketingCampaigns.Add(campaign);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = campaign, message = "Marketing campaign created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating marketing campaign");
                return StatusCode(500, new { success = false, message = "Error creating marketing campaign" });
            }
        }

        // GUEST COMMUNICATION ENDPOINTS
        [HttpGet("guest-communications")]
        public async Task<IActionResult> GetGuestCommunications([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string communicationType = "")
        {
            try
            {
                var query = _context.GuestCommunications.Include(g => g.Customer).Where(g => g.IsActive);
                
                if (!string.IsNullOrEmpty(communicationType))
                    query = query.Where(g => g.CommunicationType == communicationType);

                var totalCount = await query.CountAsync();
                var communications = await query
                    .OrderByDescending(g => g.SentDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = communications, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest communications");
                return StatusCode(500, new { success = false, message = "Error retrieving guest communications" });
            }
        }

        [HttpPost("guest-communications")]
        public async Task<IActionResult> CreateGuestCommunication([FromBody] GuestCommunication communication)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                communication.CommunicationNumber = $"COM{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                communication.SentDate = DateTime.UtcNow;
                communication.Status = "Sent";
                communication.IsActive = true;
                communication.CreatedAt = DateTime.UtcNow;
                communication.UpdatedAt = DateTime.UtcNow;

                _context.GuestCommunications.Add(communication);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = communication, message = "Guest communication sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest communication");
                return StatusCode(500, new { success = false, message = "Error creating guest communication" });
            }
        }

        // REVIEWS MANAGEMENT ENDPOINTS
        [HttpGet("reviews-management")]
        public async Task<IActionResult> GetReviewsManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string reviewType = "", [FromQuery] string source = "")
        {
            try
            {
                var query = _context.ReviewsManagements.Include(r => r.Customer).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(reviewType))
                    query = query.Where(r => r.ReviewType == reviewType);
                
                if (!string.IsNullOrEmpty(source))
                    query = query.Where(r => r.ReviewSource == source);

                var totalCount = await query.CountAsync();
                var reviews = await query
                    .OrderByDescending(r => r.ReviewDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = reviews, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reviews management");
                return StatusCode(500, new { success = false, message = "Error retrieving reviews management" });
            }
        }

        [HttpPost("reviews-management")]
        public async Task<IActionResult> CreateReviewsManagement([FromBody] ReviewsManagement review)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                review.ReviewNumber = $"REV{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                review.Status = "New";
                
                // Auto-categorize review type based on rating
                if (review.OverallRating >= 4)
                    review.ReviewType = "Positive";
                else if (review.OverallRating <= 2)
                    review.ReviewType = "Negative";
                else
                    review.ReviewType = "Neutral";

                review.IsActive = true;
                review.CreatedAt = DateTime.UtcNow;
                review.UpdatedAt = DateTime.UtcNow;

                _context.ReviewsManagements.Add(review);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = review, message = "Review recorded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reviews management");
                return StatusCode(500, new { success = false, message = "Error creating reviews management" });
            }
        }

        [HttpPut("reviews-management/{id}/respond")]
        public async Task<IActionResult> RespondToReview(int id, [FromBody] string response)
        {
            try
            {
                var review = await _context.ReviewsManagements.FindAsync(id);
                if (review == null || !review.IsActive)
                    return NotFound(new { success = false, message = "Review not found" });

                review.ManagementResponse = response;
                review.ResponseDate = DateTime.UtcNow;
                review.Status = "Responded";
                review.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Response added to review successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error responding to review");
                return StatusCode(500, new { success = false, message = "Error responding to review" });
            }
        }

        // SOCIAL MEDIA MANAGEMENT ENDPOINTS
        [HttpGet("social-media-management")]
        public async Task<IActionResult> GetSocialMediaManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string platform = "")
        {
            try
            {
                var query = _context.SocialMediaManagements.Where(s => s.IsActive);
                
                if (!string.IsNullOrEmpty(platform))
                    query = query.Where(s => s.Platform == platform);

                var totalCount = await query.CountAsync();
                var posts = await query
                    .OrderByDescending(s => s.ScheduledDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = posts, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving social media management");
                return StatusCode(500, new { success = false, message = "Error retrieving social media management" });
            }
        }

        [HttpPost("social-media-management")]
        public async Task<IActionResult> CreateSocialMediaPost([FromBody] SocialMediaManagement post)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                post.PostNumber = $"POST{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                post.Status = "Draft";
                post.IsActive = true;
                post.CreatedAt = DateTime.UtcNow;
                post.UpdatedAt = DateTime.UtcNow;

                _context.SocialMediaManagements.Add(post);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = post, message = "Social media post created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating social media post");
                return StatusCode(500, new { success = false, message = "Error creating social media post" });
            }
        }
    }
}
