using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class LaundryMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<LaundryMastersController> _logger;

        public LaundryMastersController(HotelDbContext context, ILogger<LaundryMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetLaundryServices()
        {
            try
            {
                var services = await _context.LaundryMasters.Where(l => l.IsActive).ToListAsync();
                return HandleSuccess(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving laundry services");
                return HandleError("An error occurred while retrieving laundry services");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateLaundryService([FromBody] LaundryMaster service)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid laundry service data");
            }

            try
            {
                service.IsActive = true;
                _context.LaundryMasters.Add(service);
                await _context.SaveChangesAsync();

                return HandleCreated(service, "Laundry service created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating laundry service");
                return HandleError("An error occurred while creating the laundry service");
            }
        }
    }
}
