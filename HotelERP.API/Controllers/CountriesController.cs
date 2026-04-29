using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountriesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CountriesController> _logger;

        public CountriesController(HotelDbContext context, ILogger<CountriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries([FromQuery] int page = 1, [FromQuery] int pageSize = 500, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Countries.Where(c => c.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c => c.Name.Contains(search) || c.Code.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var countries = await query
                    .OrderBy(c => c.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = countries,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving countries");
                return StatusCode(500, new { success = false, message = "Error retrieving countries" });
            }
        }
    }
}
