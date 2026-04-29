using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager,Chef")] // Temporarily disabled for testing
    public class KitchenSectionsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<KitchenSectionsController> _logger;

        public KitchenSectionsController(HotelDbContext context, ILogger<KitchenSectionsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/kitchensections
        [HttpGet]
        public async Task<IActionResult> GetKitchenSections([FromQuery] string sectionType = null)
        {
            try
            {
                var query = _context.KitchenSections.Where(k => k.IsActive);

                if (!string.IsNullOrEmpty(sectionType))
                {
                    query = query.Where(k => k.SectionType == sectionType);
                }

                var sections = await query.OrderBy(k => k.DisplayOrder).ThenBy(k => k.Name).ToListAsync();
                return HandleSuccess(sections);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving kitchen sections");
                return HandleError("An error occurred while retrieving kitchen sections");
            }
        }

        // GET: api/kitchensections/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKitchenSection(int id)
        {
            try
            {
                var section = await _context.KitchenSections.FindAsync(id);

                if (section == null)
                {
                    return HandleNotFound("Kitchen section not found");
                }

                return HandleSuccess(section);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving kitchen section with ID: {id}");
                return HandleError($"An error occurred while retrieving kitchen section with ID: {id}");
            }
        }

        // POST: api/kitchensections
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateKitchenSection([FromBody] KitchenSectionCreateDto sectionDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid kitchen section data");
            }

            try
            {
                var section = new KitchenSection
                {
                    Name = sectionDto.Name,
                    Code = sectionDto.Code,
                    Description = sectionDto.Description,
                    Location = sectionDto.Location,
                    SectionType = sectionDto.SectionType,
                    ResponsibleChef = sectionDto.ResponsibleChef,
                    Specialties = sectionDto.Specialties,
                    DisplayOrder = sectionDto.DisplayOrder,
                    IsActive = true
                };

                _context.KitchenSections.Add(section);
                await _context.SaveChangesAsync();

                return HandleCreated(section, "Kitchen section created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating kitchen section");
                return HandleError("An error occurred while creating the kitchen section");
            }
        }

        // PUT: api/kitchensections/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateKitchenSection(int id, [FromBody] KitchenSectionUpdateDto sectionDto)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid kitchen section data");
            }

            try
            {
                var section = await _context.KitchenSections.FindAsync(id);

                if (section == null)
                {
                    return HandleNotFound("Kitchen section not found");
                }

                section.Name = sectionDto.Name ?? section.Name;
                section.Code = sectionDto.Code ?? section.Code;
                section.Description = sectionDto.Description ?? section.Description;
                section.Location = sectionDto.Location ?? section.Location;
                section.SectionType = sectionDto.SectionType ?? section.SectionType;
                section.ResponsibleChef = sectionDto.ResponsibleChef ?? section.ResponsibleChef;
                section.Specialties = sectionDto.Specialties ?? section.Specialties;
                section.DisplayOrder = sectionDto.DisplayOrder ?? section.DisplayOrder;

                await _context.SaveChangesAsync();

                return HandleSuccess(section, "Kitchen section updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating kitchen section with ID: {id}");
                return HandleError($"An error occurred while updating kitchen section with ID: {id}");
            }
        }

        // DELETE: api/kitchensections/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteKitchenSection(int id)
        {
            try
            {
                var section = await _context.KitchenSections.FindAsync(id);
                if (section == null)
                {
                    return HandleNotFound("Kitchen section not found");
                }

                _context.KitchenSections.Remove(section);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Kitchen section deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting kitchen section with ID: {id}");
                return HandleError($"An error occurred while deleting kitchen section with ID: {id}");
            }
        }
    }
}
