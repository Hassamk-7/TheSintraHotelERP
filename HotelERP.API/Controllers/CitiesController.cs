using System;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    public class CitiesController : BaseController
    {
        private readonly HotelDbContext _context;

        public CitiesController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: api/cities
        [HttpGet]
        public async Task<IActionResult> GetCities([FromQuery] string search = "")
        {
            try
            {
                var query = _context.Cities.Where(c => c.IsActive).AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(c => c.Name.Contains(search));
                }

                var cities = await query
                    .OrderBy(c => c.Name)
                    .Select(c => new { c.Id, c.Name, c.Province, c.Country })
                    .ToListAsync();

                return HandleSuccess(cities, $"Retrieved {cities.Count} cities successfully");
            }
            catch (Exception ex)
            {
                return HandleError($"Database error: {ex.Message}");
            }
        }
    }
}
