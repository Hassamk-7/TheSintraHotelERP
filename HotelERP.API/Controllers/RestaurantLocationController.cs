using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantLocationController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public RestaurantLocationController(HotelDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/RestaurantLocation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantLocation>>> GetRestaurants()
        {
            return await _context.Restaurants
                .Where(r => r.IsActive)
                .OrderBy(r => r.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/RestaurantLocation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RestaurantLocation>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.MenuItems)
                .FirstOrDefaultAsync(r => r.RestaurantID == id);

            if (restaurant == null)
            {
                return NotFound();
            }

            return restaurant;
        }

        // GET: api/RestaurantLocation/ByLocation/Islamabad
        [HttpGet("ByLocation/{location}")]
        public async Task<ActionResult<RestaurantLocation>> GetRestaurantByLocation(string location)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.MenuItems.Where(m => m.IsActive))
                .FirstOrDefaultAsync(r => r.Location == location && r.IsActive);

            if (restaurant == null)
            {
                return NotFound();
            }

            return restaurant;
        }

        // POST: api/RestaurantLocation
        [HttpPost]
        public async Task<ActionResult<RestaurantLocation>> PostRestaurant([FromForm] RestaurantUploadDto dto)
        {
            try
            {
                string imagePath = null;

                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "Gallery", "Restaurants");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    imagePath = $"/Gallery/Restaurants/{fileName}";
                }

                var restaurant = new RestaurantLocation
                {
                    Name = dto.Name,
                    Location = dto.Location,
                    Description = dto.Description,
                    ImagePath = imagePath,
                    Rating = dto.Rating ?? 4.5M,
                    PhoneNumber = dto.PhoneNumber,
                    Email = dto.Email,
                    OpeningHours = dto.OpeningHours,
                    DisplayOrder = dto.DisplayOrder,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.Restaurants.Add(restaurant);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRestaurant), new { id = restaurant.RestaurantID }, restaurant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/RestaurantLocation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRestaurant(int id, [FromForm] RestaurantUploadDto dto)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            try
            {
                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "Gallery", "Restaurants");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    restaurant.ImagePath = $"/Gallery/Restaurants/{fileName}";
                }

                restaurant.Name = dto.Name;
                restaurant.Location = dto.Location;
                restaurant.Description = dto.Description;
                restaurant.Rating = dto.Rating ?? restaurant.Rating;
                restaurant.PhoneNumber = dto.PhoneNumber;
                restaurant.Email = dto.Email;
                restaurant.OpeningHours = dto.OpeningHours;
                restaurant.DisplayOrder = dto.DisplayOrder;
                restaurant.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/RestaurantLocation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            restaurant.IsActive = false;
            restaurant.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class RestaurantUploadDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; }
        public decimal? Rating { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string OpeningHours { get; set; }
        public int DisplayOrder { get; set; }
    }
}
