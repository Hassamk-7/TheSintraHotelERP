using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.Services;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactMessageController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IEmailService _emailService;

        public ContactMessageController(HotelDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/ContactMessage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetContactMessages()
        {
            return await _context.ContactMessages
                .OrderByDescending(m => m.CreatedDate)
                .ToListAsync();
        }

        // GET: api/ContactMessage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactMessage>> GetContactMessage(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);

            if (contactMessage == null)
            {
                return NotFound();
            }

            return contactMessage;
        }

        // GET: api/ContactMessage/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.ContactMessages.CountAsync();
            var unread = await _context.ContactMessages.CountAsync(m => !m.IsRead);
            var read = total - unread;

            return Ok(new
            {
                total,
                unread,
                read
            });
        }

        // POST: api/ContactMessage
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> PostContactMessage(ContactMessageDto dto)
        {
            var contactMessage = new ContactMessage
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Subject = dto.Subject,
                Message = dto.Message,
                Location = dto.Location,
                IsRead = false,
                CreatedDate = DateTime.Now
            };

            _context.ContactMessages.Add(contactMessage);
            await _context.SaveChangesAsync();

            // Send email notification
            try
            {
                await _emailService.SendContactNotificationAsync(
                    dto.Name,
                    dto.Email,
                    dto.Phone,
                    dto.Subject,
                    dto.Message,
                    dto.Location
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email notification: {ex.Message}");
                // Continue even if email fails
            }

            return CreatedAtAction(nameof(GetContactMessage), new { id = contactMessage.MessageID }, contactMessage);
        }

        // PUT: api/ContactMessage/5/mark-read
        [HttpPut("{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);
            if (contactMessage == null)
            {
                return NotFound();
            }

            contactMessage.IsRead = true;
            contactMessage.ReadDate = DateTime.Now;
            contactMessage.ReadBy = "Admin"; // You can get this from authenticated user

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/ContactMessage/5/mark-unread
        [HttpPut("{id}/mark-unread")]
        public async Task<IActionResult> MarkAsUnread(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);
            if (contactMessage == null)
            {
                return NotFound();
            }

            contactMessage.IsRead = false;
            contactMessage.ReadDate = null;
            contactMessage.ReadBy = null;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ContactMessage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactMessage(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);
            if (contactMessage == null)
            {
                return NotFound();
            }

            _context.ContactMessages.Remove(contactMessage);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class ContactMessageDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Location { get; set; }
    }
}
