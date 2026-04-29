using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class DeliveryPersonMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DeliveryPersonMastersController> _logger;

        public DeliveryPersonMastersController(HotelDbContext context, ILogger<DeliveryPersonMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDeliveryPersons()
        {
            try
            {
                var persons = await _context.DeliveryPersonMasters.Where(d => d.IsActive).ToListAsync();
                return HandleSuccess(persons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving delivery persons");
                return HandleError("An error occurred while retrieving delivery persons");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDeliveryPerson([FromBody] DeliveryPersonMaster person)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid delivery person data");
            }

            try
            {
                person.IsActive = true;
                _context.DeliveryPersonMasters.Add(person);
                await _context.SaveChangesAsync();

                return HandleCreated(person, "Delivery person created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating delivery person");
                return HandleError("An error occurred while creating the delivery person");
            }
        }
    }
}
